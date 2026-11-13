import asyncio
import ctypes
import fcntl
import glob
import json
import os
import re
import select
import struct
import threading
import time

import decky

# ---------------------------------------------------------------------------
# Catálogo de resoluções (largura, altura). Para adicionar uma tela nova,
# basta incluir uma linha aqui: o frontend lê esta lista automaticamente.
# ---------------------------------------------------------------------------
RESOLUTIONS = {
    "800p": {"label": "Steam Deck (1280x800)", "width": 1280, "height": 800},
    "1200p": {"label": "Legion Go S (1920x1200)", "width": 1920, "height": 1200},
    "1080p": {"label": "Monitor externo 1080p (1920x1080)", "width": 1920, "height": 1080},
    "1600p": {"label": "Legion Go (2560x1600)", "width": 2560, "height": 1600},
    "2160p": {"label": "Monitor externo 4K (3840x2160)", "width": 3840, "height": 2160},
}

# ---------------------------------------------------------------------------
# Catálogo de modelos. "lines" são as 3 linhas de texto do MangoHud; o símbolo
# fica sempre na linha do meio. "half_w" é a metade da largura (em px, com
# fonte tamanho 24) usada para centralizar. Os modelos "box" e "dot" usam os
# valores originais do plugin. Os demais são estimativas: ajuste fino pelos
# botões de posição (o ajuste é salvo por modelo).
# ---------------------------------------------------------------------------
MODELS = {
    "box": {"label": "Caixa", "lines": ["-----", "| + |", "-----"], "half_w": 22},
    "dot": {"label": "Ponto (+)", "lines": [" ", "+", " "], "half_w": 8},
    "ring": {"label": "Anel (O)", "lines": [" ", "O", " "], "half_w": 10},
    "x": {"label": "X", "lines": [" ", "x", " "], "half_w": 7},
    "star": {"label": "Estrela (*)", "lines": [" ", "*", " "], "half_w": 7},
    "bracket": {"label": "Colchetes", "lines": [" ", "[ + ]", " "], "half_w": 22},
    "dash": {"label": "Traços", "lines": [" ", "- + -", " "], "half_w": 23},
}

# Marca no fim do arquivo do MangoHud que foi o plugin quem o escreveu. Assim ele
# sabe quando pode devolver o overlay de antes e quando o Steam já o trocou.
CONFIG_MARKER = "# crosshair-plugin: configuracao gerada pelo plugin"
MAX_BACKUPS = 5
# A mesma apertada pode chegar pelos dois caminhos (interface e leitura em jogo).
# Dois avisos de origens diferentes dentro desta janela contam como um só.
TOGGLE_DEDUP_SECONDS = 1.0

REF_FONT_SIZE = 24  # tamanho de fonte padrão do MangoHud (100%)
HALF_H = 20  # metade da altura do bloco de 3 linhas, em px (valor original)

# Compensação de escala (px). Parte do deslocamento da mira em relação à borda
# da janela do MangoHud NÃO cresce com a fonte (margens internas). Para a mira
# crescer a partir do centro, só a parte que cresce com a fonte é escalada:
#   offset = centro - pad - (meia_largura - pad) * escala
# Com escala 100% o resultado é idêntico ao anterior. Os valores abaixo são
# estimativas; dá para calibrar por modelo na interface (Calibrar escala).
DEFAULT_COMP = (2, -16)

DEFAULTS = {
    "language": "pt",
    "enabled": False,
    "model": "box",
    "resolution": "800p",
    "color": "FF007B",  # rosa, igual ao plugin original
    "size": 100,  # porcentagem do tamanho padrão
    "nudge": {},  # ajuste fino por modelo: {"box": [dx, dy]}
    "comp": {},  # compensação de escala por modelo: {"box": [px, py]}
    "hotkey": {"enabled": False, "buttons": [], "hold_ms": 0, "v": 2},  # atalho liga/desliga
    "auto_apply": True,  # aplicar o perfil do jogo quando ele abrir
    "profiles": {},  # perfis por jogo: {"<appid>": {...}}
}

# Valores exatos do plugin original (tamanho 100%). A diferença para a fórmula
# é de poucos pixels; mantê-los garante que quem já usava não perca o ajuste.
LEGACY_OFFSETS = {
    ("800p", "box"): (618, 380),
    ("800p", "dot"): (631, 380),
    ("1080p", "box"): (938, 520),
    ("1080p", "dot"): (952, 520),
    ("2160p", "box"): (1900, 1060),
    ("2160p", "dot"): (1913, 1060),
}

HEX_RE = re.compile(r"^[0-9A-Fa-f]{6}$")


# ---------------------------------------------------------------------------
# Atalho de botões do controle (liga/desliga o crosshair)
#
# Como funciona: a combinação é gravada pela interface (que recebe os botões do
# Steam com o menu aberto) e fica salva como IDs de botão do Steam. Em jogo, o
# backend lê o controle direto do sistema e compara com esses mesmos IDs.
#
# As tabelas de botões e os formatos dos controles Valve vêm do projeto
# Steamcord (Necrosiak, BSD-3-Clause, https://github.com/Necrosiak/Steamcord),
# que foi validado no aparelho. Tudo aqui é isolado: se algo falhar, só o atalho
# para de funcionar e o restante do plugin segue normal.
# ---------------------------------------------------------------------------
EV_KEY = 0x01
EV_ABS = 0x03
EV_MAX = 0x1F
KEY_MAX = 0x2FF
BTN_SOUTH = 0x130  # primeiro botão de gamepad (A)
ABS_HAT0X, ABS_HAT0Y = 0x10, 0x11
VENDOR_VALVE = 0x28DE
STEAM_VIRTUAL_GAMEPAD = 0x11FF  # controle virtual que o Steam cria para os jogos
_EVENT = struct.Struct("llHHi")  # struct input_event do kernel

# Botões do controle virtual/clássico (evdev) -> IDs de botão do Steam. Um botão
# pode valer mais de um ID, porque o Steam numera alguns botões de forma diferente
# conforme a versão (ex.: Menu aparece como 8 ou 36).
EVDEV_TO_STEAM = {
    0x130: (0,),  # A
    0x131: (1,),  # B
    0x134: (2,),  # X
    0x133: (3,),  # Y
    0x220: (20,),  # direcional cima
    0x221: (21,),  # direcional baixo
    0x222: (22,),  # direcional esquerda
    0x223: (23,),  # direcional direita
    0x136: (30,),  # LB
    0x137: (31,),  # RB
    0x13A: (9, 35),  # View / Select
    0x13B: (8, 36),  # Menu / Start
    0x13C: (34,),  # Guia
}
# Gatilhos (eixos). Só valem em controles estilo Xbox, como o controle virtual do Steam.
EVDEV_TRIGGERS = {0x02: 28, 0x05: 29}  # ABS_Z -> LT, ABS_RZ -> RT
TRIGGER_THRESHOLD = 100
XBOX_VENDORS = {0x045E}  # Microsoft
EVDEV_IDS = frozenset(i for ids in EVDEV_TO_STEAM.values() for i in ids)
EVDEV_TRIGGER_IDS = frozenset(EVDEV_TRIGGERS.values())

# Controles Valve lidos direto (hidraw): Steam Controller (2026) e Steam Deck
HID_TRITON_PRODUCTS = {0x1302, 0x1303, 0x1304, 0x1305}
HID_TRITON_STATE_REPORTS = {0x42, 0x45, 0x47}
HID_TRITON_WIRELESS = 0x79
HID_TRITON_DISCONNECT = 1
HID_TRITON_TO_STEAM = {
    0x00000001: 0, 0x00000002: 1, 0x00000004: 2, 0x00000008: 3,
    0x00002000: 20, 0x00000400: 21, 0x00001000: 22, 0x00000800: 23,
    0x00040000: 32, 0x00000100: 33, 0x00020000: 44, 0x00000080: 45,
}
HID_DECK_PRODUCTS = {0x1205}
HID_DECK_STATE = 0x09
HID_DECK_TO_STEAM = {
    0x00000080: 0, 0x00000020: 1, 0x00000040: 2, 0x00000010: 3,
    0x00000100: 20, 0x00000800: 21, 0x00000400: 22, 0x00000200: 23,
    0x00008000: 32, 0x00010000: 33, 1 << 41: 44, 1 << 42: 45,
}
# IDs que o backend sabe ler em jogo. Combinações com outros botões (ex.: L3/R3)
# são lidas só pela interface do Steam, com o menu em foco.
HID_IDS = frozenset(HID_TRITON_TO_STEAM.values()) | frozenset(HID_DECK_TO_STEAM.values())
SUPPORTED_BUTTONS = HID_IDS | EVDEV_IDS | EVDEV_TRIGGER_IDS


class _InputId(ctypes.Structure):
    _fields_ = [
        ("bustype", ctypes.c_ushort),
        ("vendor", ctypes.c_ushort),
        ("product", ctypes.c_ushort),
        ("version", ctypes.c_ushort),
    ]


def _ioc(direction, typ, nr, size):
    return (direction << 30) | (size << 16) | (typ << 8) | nr


def _eviocgid():
    return _ioc(2, ord("E"), 0x02, ctypes.sizeof(_InputId))


def _eviocgbit(ev, size):
    return _ioc(2, ord("E"), 0x20 + ev, size)


def _test_bit(buf, bit):
    idx = bit // 8
    return idx < len(buf) and bool(buf[idx] & (1 << (bit % 8)))


def _bits(fd, ev_type, max_code):
    size = (max_code + 8) // 8
    buf = bytearray(size)
    try:
        fcntl.ioctl(fd, _eviocgbit(ev_type, size), buf, True)
    except OSError:
        return bytearray()
    return buf


def _ident(fd):
    ident = _InputId()
    try:
        fcntl.ioctl(fd, _eviocgid(), ident, True)
    except OSError:
        return (0, 0, 0)
    return (ident.bustype, ident.vendor, ident.product)


def _node_num(path):
    digits = re.sub(r"\D", "", os.path.basename(path))
    return int(digits) if digits else 0


def _open_device(path):
    return os.open(path, os.O_RDONLY | os.O_NONBLOCK | getattr(os, "O_CLOEXEC", 0))


def list_evdev_gamepads():
    """Controles clássicos e o controle virtual do Steam que dá para abrir de verdade."""
    found = []
    for path in sorted(glob.glob("/dev/input/event*"), key=_node_num):
        try:
            fd = _open_device(path)
        except OSError:
            continue
        try:
            if not _test_bit(_bits(fd, 0, EV_MAX), EV_KEY):
                continue
            if not _test_bit(_bits(fd, EV_KEY, KEY_MAX), BTN_SOUTH):
                continue
            _bus, vendor, product = _ident(fd)
            if vendor == VENDOR_VALVE and product != STEAM_VIRTUAL_GAMEPAD:
                continue  # controles Valve físicos são lidos em hidraw
            found.append(path)
        except OSError:
            continue
        finally:
            os.close(fd)
    return found


def list_hid_controllers():
    """Controles Valve (hidraw) que dá para abrir de verdade."""
    found = []
    for dev in sorted(glob.glob("/sys/class/hidraw/hidraw*")):
        try:
            with open(os.path.join(dev, "device", "uevent")) as f:
                uevent = f.read()
        except OSError:
            continue
        match = re.search(r"^HID_ID=[0-9A-Fa-f]+:([0-9A-Fa-f]+):([0-9A-Fa-f]+)$", uevent, re.M)
        if not match or int(match.group(1), 16) != VENDOR_VALVE:
            continue
        product = int(match.group(2), 16)
        if product not in HID_TRITON_PRODUCTS and product not in HID_DECK_PRODUCTS:
            continue
        path = "/dev/" + os.path.basename(dev)
        try:
            os.close(_open_device(path))
        except OSError:
            continue
        found.append(path)
    return found


def discover_controllers():
    """[(caminho, tipo)] com tipo "evdev" ou "hid"."""
    return [(p, "evdev") for p in list_evdev_gamepads()] + [(p, "hid") for p in list_hid_controllers()]


def steam_buttons(table, raw):
    return frozenset(steam for bit, steam in table.items() if raw & bit)


def parse_hid_report(data):
    """IDs Steam segurados num relatório hidraw, ou None se não for um relatório de estado."""
    if len(data) >= 16 and data[0] == 0x01 and data[2] == HID_DECK_STATE:
        return steam_buttons(HID_DECK_TO_STEAM, int.from_bytes(data[8:16], "little"))
    if data and data[0] in HID_TRITON_STATE_REPORTS and len(data) >= 6:
        return steam_buttons(HID_TRITON_TO_STEAM, int.from_bytes(data[2:6], "little"))
    if len(data) >= 2 and data[0] == HID_TRITON_WIRELESS and data[1] == HID_TRITON_DISCONNECT:
        return frozenset()  # controle desligado: nada mais está segurado
    return None


def apply_evdev_events(held, data, xinput=False):
    """Atualiza o conjunto de IDs Steam segurados com uma leva de eventos evdev."""
    held = set(held)
    for offset in range(0, len(data) - _EVENT.size + 1, _EVENT.size):
        _s, _us, etype, code, value = _EVENT.unpack_from(data, offset)
        if etype == EV_KEY and code in EVDEV_TO_STEAM:
            if value == 2:  # auto-repetição
                continue
            for steam_id in EVDEV_TO_STEAM[code]:
                (held.add if value else held.discard)(steam_id)
        elif etype == EV_ABS and code in (ABS_HAT0X, ABS_HAT0Y):
            negative, positive = (22, 23) if code == ABS_HAT0X else (20, 21)
            held.discard(negative)
            held.discard(positive)
            if value < 0:
                held.add(negative)
            elif value > 0:
                held.add(positive)
        elif etype == EV_ABS and xinput and code in EVDEV_TRIGGERS:
            (held.add if value > TRIGGER_THRESHOLD else held.discard)(EVDEV_TRIGGERS[code])
    return frozenset(held)


class HotkeyMonitor:
    """Lê os controles em uma thread própria e avisa quando a combinação é segurada."""

    def __init__(self, log, on_fire, on_covered, discover=None, opener=None, ident=None):
        self.log = log
        self.on_fire = on_fire
        self.on_covered = on_covered
        self.discover = discover or discover_controllers
        self.opener = opener or _open_device
        self.ident = ident or _ident
        self.denied = 0
        self.lock = threading.RLock()
        self.thread = None
        self.stop_event = threading.Event()
        self.combo = []
        self.hold = 0.0
        self.active = False
        self.devices = {}
        self.pressed_since = None
        self.fired = False
        self.covered_sent = False
        self.last_seen = []  # IDs do último grupo de botões lidos em jogo
        self.last_seen_at = None

    # --- usado pelo plugin -------------------------------------------------
    def configure(self, combo, hold_ms, active):
        with self.lock:
            self.combo = list(combo)
            self.hold = max(0, hold_ms) / 1000.0
            self.active = bool(active) and len(self.combo) == 2
            self.pressed_since = None
            self.fired = False

    def ensure_running(self):
        with self.lock:
            if self.thread is not None:
                return
            self.stop_event = threading.Event()
            self.thread = threading.Thread(
                target=self._run, args=(self.stop_event,), name="crosshair-hotkey", daemon=True
            )
            self.thread.start()

    def stop(self):
        with self.lock:
            thread = self.thread
            self.stop_event.set()
            self.thread = None
        if thread is not None and thread is not threading.current_thread():
            thread.join(timeout=2)

    def status(self):
        with self.lock:
            return {
                "running": self.thread is not None,
                "devices": len(self.devices),
                "denied": self.denied,
                "covered": self._covered(),
                "last_seen": list(self.last_seen),
                "last_seen_age": None
                if self.last_seen_at is None
                else int(time.monotonic() - self.last_seen_at),
            }

    # --- thread de leitura -------------------------------------------------
    def _covered(self):
        """O backend cobre a combinação quando os controles abertos conseguem entregar todos os botões dela."""
        if not self.active or not self.devices:
            return False
        provided = set()
        for device in self.devices.values():
            provided |= device["provides"]
        return set(self.combo) <= provided

    def _run(self, stop_event):
        last_scan = 0.0
        try:
            while not stop_event.is_set():
                with self.lock:
                    if not self.active:
                        if self.thread is threading.current_thread():
                            self.thread = None
                        return
                try:
                    now = time.monotonic()
                    if now - last_scan >= 3.0:
                        self._rescan()
                        last_scan = now
                    by_fd = {d["fd"]: d for d in list(self.devices.values())}
                    if by_fd:
                        try:
                            ready, _, _ = select.select(list(by_fd), [], [], 0.05)
                        except (OSError, ValueError):
                            self._close_all()
                            last_scan = 0.0
                            ready = []
                        for fd in ready:
                            self._read(by_fd[fd])
                    else:
                        stop_event.wait(0.1)
                    self._tick(time.monotonic())
                except Exception as e:  # nunca derruba a thread por um erro isolado
                    self.log.error(f"Erro no monitor de atalho: {e}")
                    stop_event.wait(0.5)
        finally:
            self._close_all()
            with self.lock:
                if self.thread is threading.current_thread():
                    self.thread = None
                notify = self.covered_sent
                self.covered_sent = False
                self.pressed_since = None
                self.fired = False
            if notify:
                self._call(self.on_covered, False)

    def _rescan(self):
        try:
            found = self.discover()
        except Exception as e:
            self.log.error(f"Erro ao procurar controles: {e}")
            return
        wanted = {path: kind for path, kind in found}
        with self.lock:
            for path in list(self.devices):
                if path not in wanted:
                    self._drop(path)
            denied = 0
            for path, kind in wanted.items():
                if path in self.devices:
                    continue
                try:
                    fd = self.opener(path)
                except PermissionError:
                    denied += 1
                    continue
                except OSError:
                    continue
                xinput = False
                if kind == "evdev":
                    _bus, vendor, product = self.ident(fd)
                    xinput = vendor in XBOX_VENDORS or (vendor, product) == (VENDOR_VALVE, STEAM_VIRTUAL_GAMEPAD)
                    provides = EVDEV_IDS | (EVDEV_TRIGGER_IDS if xinput else frozenset())
                else:
                    provides = HID_IDS
                self.devices[path] = {
                    "path": path, "kind": kind, "fd": fd, "held": frozenset(), "xinput": xinput, "provides": provides,
                }
            self.denied = denied

    def _drop(self, path):
        with self.lock:
            device = self.devices.pop(path, None)
        if device is not None:
            try:
                os.close(device["fd"])
            except OSError:
                pass

    def _close_all(self):
        for path in list(self.devices):
            self._drop(path)

    def _read(self, device):
        """Lê tudo o que o controle entregou e atualiza os botões segurados dele."""
        size = _EVENT.size * 64 if device["kind"] == "evdev" else 64
        held = device["held"]
        for _ in range(200):
            try:
                data = os.read(device["fd"], size)
            except BlockingIOError:
                break
            except OSError:
                self._drop(device["path"])  # desconectado ou acordou da suspensão
                return
            if not data:
                break
            if device["kind"] == "evdev":
                # Evaluate every input edge. A quick ABXY tap and its release
                # can arrive in one read; evaluating only the final state loses it.
                for offset in range(0, len(data) - _EVENT.size + 1, _EVENT.size):
                    held = apply_evdev_events(held, data[offset:offset + _EVENT.size], device.get("xinput", False))
                    with self.lock:
                        device["held"] = held
                    self._tick(time.monotonic())
            else:
                parsed = parse_hid_report(data)
                if parsed is not None:
                    held = parsed
                    with self.lock:
                        device["held"] = held
                    self._tick(time.monotonic())
        with self.lock:
            device["held"] = held

    def _held(self):
        held = set()
        for device in self.devices.values():
            held |= device["held"]
        return held

    def _tick(self, now):
        """Dispara o atalho e avisa quando a cobertura do backend muda."""
        fire = False
        covered_change = None
        with self.lock:
            held = self._held()
            if held:
                # guarda o maior grupo de botões de uma mesma apertada (para o diagnóstico)
                if self.last_seen_at is None or now - self.last_seen_at > 1.0 or len(held) >= len(self.last_seen):
                    self.last_seen = sorted(held)
                self.last_seen_at = now
            if self.active and set(self.combo) <= held:
                if self.pressed_since is None:
                    self.pressed_since = now
                if not self.fired and now - self.pressed_since >= self.hold:
                    self.fired = True
                    fire = True
            else:
                self.pressed_since = None
                self.fired = False
            covered = self._covered()
            if covered != self.covered_sent:
                self.covered_sent = covered
                covered_change = covered
        if covered_change is not None:
            self._call(self.on_covered, covered_change)
        if fire:
            self._call(self.on_fire)

    def _call(self, callback, *args):
        try:
            callback(*args)
        except Exception as e:
            self.log.error(f"Erro no atalho: {e}")


def _clamp(value, low, high):
    return max(low, min(high, value))


def sanitize_hotkey(raw):
    """Valida o atalho: ativo ou não, os 2 IDs de botão do Steam e quanto tempo segurar (ms)."""
    if not isinstance(raw, dict):
        raw = {}
    buttons = raw.get("buttons", [])
    if (
        not isinstance(buttons, (list, tuple))
        or len(buttons) != 2
        or not all(isinstance(b, int) and not isinstance(b, bool) and 0 <= b <= 255 for b in buttons)
        or buttons[0] == buttons[1]
    ):
        buttons = []
    try:
        hold_ms = _clamp(int(raw.get("hold_ms", 0)), 0, 1000)
    except (TypeError, ValueError):
        hold_ms = 0
    if raw.get("v") != 2:
        hold_ms = 0  # formato antigo (1.5.0): volta ao padrão instantâneo
    return {
        "enabled": bool(raw.get("enabled", False)) and len(buttons) == 2,
        "buttons": list(buttons),
        "hold_ms": hold_ms,
        "v": 2,
    }


def sanitize_profile(raw, name):
    """Valida um perfil de jogo (modelo, cor, tamanho, posição e se aparece)."""
    color = str(raw.get("color", DEFAULTS["color"])).lstrip("#")
    try:
        size = _clamp(int(raw.get("size", 100)), 50, 300)
    except (TypeError, ValueError):
        size = 100
    try:
        nudge_x = _clamp(int(raw.get("nudge_x", 0)), -600, 600)
        nudge_y = _clamp(int(raw.get("nudge_y", 0)), -600, 600)
    except (TypeError, ValueError):
        nudge_x, nudge_y = 0, 0
    return {
        "name": str(name)[:80],
        "enabled": bool(raw.get("enabled", True)),
        "model": raw.get("model") if raw.get("model") in MODELS else DEFAULTS["model"],
        "color": color.upper() if HEX_RE.match(color) else DEFAULTS["color"],
        "size": size,
        "nudge_x": nudge_x,
        "nudge_y": nudge_y,
    }


class Plugin:
    def __init__(self):
        self.settings = json.loads(json.dumps(DEFAULTS))
        self.settings_path = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "settings.json")
        self.monitor = None  # monitor do atalho (criado só quando necessário)
        self.loop = None
        self.last_toggle = None  # (origem, instante) do último liga/desliga pelo atalho
        self.backup_path = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "mangohud_backup.json")
        self.backups = {}  # caminho do arquivo do MangoHud -> conteúdo de antes da mira

    # ------------------------------------------------------------------
    # Persistência
    # ------------------------------------------------------------------
    def load_backups(self):
        try:
            with open(self.backup_path, "r") as f:
                data = json.load(f)
            if isinstance(data, dict):
                self.backups = {str(k): v for k, v in data.items() if isinstance(v, str)}
        except FileNotFoundError:
            pass
        except Exception as e:
            decky.logger.error(f"Erro ao ler o backup do MangoHud: {e}")

    def remember_config(self, path, content):
        """Guarda o MangoHud de antes da mira para devolvê-lo quando a mira for desligada."""
        self.backups.pop(path, None)
        self.backups[path] = content
        while len(self.backups) > MAX_BACKUPS:
            self.backups.pop(next(iter(self.backups)))
        try:
            os.makedirs(os.path.dirname(self.backup_path), exist_ok=True)
            with open(self.backup_path, "w") as f:
                json.dump(self.backups, f)
        except Exception as e:
            decky.logger.error(f"Erro ao salvar o backup do MangoHud: {e}")

    def load_settings(self):
        self.load_backups()
        try:
            with open(self.settings_path, "r") as f:
                saved = json.load(f)
            self.settings = self.sanitize({**DEFAULTS, **saved})
        except FileNotFoundError:
            pass
        except Exception as e:
            decky.logger.error(f"Erro ao ler configurações: {e}")

    def save_settings(self):
        try:
            os.makedirs(os.path.dirname(self.settings_path), exist_ok=True)
            with open(self.settings_path, "w") as f:
                json.dump(self.settings, f)
        except Exception as e:
            decky.logger.error(f"Erro ao salvar configurações: {e}")

    def sanitize(self, s):
        out = json.loads(json.dumps(DEFAULTS))
        out["language"] = s.get("language") if s.get("language") in ("pt", "en", "es") else "pt"
        out["enabled"] = bool(s.get("enabled", False))
        out["model"] = s.get("model") if s.get("model") in MODELS else DEFAULTS["model"]
        out["resolution"] = s.get("resolution") if s.get("resolution") in RESOLUTIONS else DEFAULTS["resolution"]
        color = str(s.get("color", DEFAULTS["color"])).lstrip("#")
        out["color"] = color.upper() if HEX_RE.match(color) else DEFAULTS["color"]
        try:
            out["size"] = _clamp(int(s.get("size", 100)), 50, 300)
        except (TypeError, ValueError):
            out["size"] = 100
        nudge = {}
        raw = s.get("nudge", {})
        if isinstance(raw, dict):
            for model_id, pair in raw.items():
                if model_id in MODELS and isinstance(pair, (list, tuple)) and len(pair) == 2:
                    try:
                        nudge[model_id] = [_clamp(int(pair[0]), -600, 600), _clamp(int(pair[1]), -600, 600)]
                    except (TypeError, ValueError):
                        continue
        out["nudge"] = nudge
        comp = {}
        raw_comp = s.get("comp", {})
        if isinstance(raw_comp, dict):
            for model_id, pair in raw_comp.items():
                if model_id in MODELS and isinstance(pair, (list, tuple)) and len(pair) == 2:
                    try:
                        comp[model_id] = [_clamp(int(pair[0]), -100, 100), _clamp(int(pair[1]), -100, 100)]
                    except (TypeError, ValueError):
                        continue
        out["comp"] = comp
        out["auto_apply"] = bool(s.get("auto_apply", True))
        profiles = {}
        raw_profiles = s.get("profiles", {})
        if isinstance(raw_profiles, dict):
            for appid, prof in raw_profiles.items():
                if isinstance(prof, dict):
                    profiles[str(appid)[:20]] = sanitize_profile(prof, prof.get("name", appid))
        out["profiles"] = profiles
        out["hotkey"] = sanitize_hotkey(s.get("hotkey", {}))
        return out

    # ------------------------------------------------------------------
    # Cálculo de posição
    # ------------------------------------------------------------------
    def effective_comp(self):
        """Compensação de escala do modelo atual (salva ou padrão)."""
        comp = self.settings["comp"].get(self.settings["model"])
        return tuple(comp) if comp else DEFAULT_COMP

    def compute_offsets(self):
        s = self.settings
        res = RESOLUTIONS[s["resolution"]]
        model = MODELS[s["model"]]
        scale = s["size"] / 100
        dx, dy = s["nudge"].get(s["model"], [0, 0])
        px, py = self.effective_comp()
        x = round(res["width"] / 2 - px - (model["half_w"] - px) * scale) + dx
        y = round(res["height"] / 2 - py - (HALF_H - py) * scale) + dy
        legacy = LEGACY_OFFSETS.get((s["resolution"], s["model"]))
        if legacy:
            x += legacy[0] - round(res["width"] / 2 - model["half_w"])
            y += legacy[1] - round(res["height"] / 2 - HALF_H)
        return x, y

    def state(self):
        x, y = self.compute_offsets()
        s = self.settings
        nx, ny = s["nudge"].get(s["model"], [0, 0])
        cx, cy = self.effective_comp()
        return {
            "settings": {
                "language": s["language"],
                "enabled": s["enabled"],
                "model": s["model"],
                "resolution": s["resolution"],
                "color": s["color"],
                "size": s["size"],
                "nudge_x": nx,
                "nudge_y": ny,
                "comp_x": cx,
                "comp_y": cy,
                "auto_apply": s["auto_apply"],
            },
            "profiles": [
                {
                    "appid": k,
                    "name": v["name"],
                    "enabled": v["enabled"],
                    "model": v["model"],
                    "color": v["color"],
                    "size": v["size"],
                    "nudge_x": v["nudge_x"],
                    "nudge_y": v["nudge_y"],
                }
                for k, v in s["profiles"].items()
            ],
            "hotkey": self.hotkey_state(),
            "models": [{"id": k, "label": v["label"], "lines": v["lines"]} for k, v in MODELS.items()],
            "resolutions": [{"id": k, "label": v["label"]} for k, v in RESOLUTIONS.items()],
            "offset_x": x,
            "offset_y": y,
        }

    # ------------------------------------------------------------------
    # MangoHud
    # ------------------------------------------------------------------
    def find_mangohud_config_path(self):
        """Encontra o arquivo de configuração ativo do MangoHud (processo mangoapp)."""
        try:
            for proc_dir in os.listdir("/proc"):
                if not proc_dir.isdigit():
                    continue
                proc_path = f"/proc/{proc_dir}"
                try:
                    with open(f"{proc_path}/cmdline", "r") as f:
                        cmdline = f.read()
                    if "mangoapp" in cmdline:
                        with open(f"{proc_path}/environ", "r") as f:
                            environ = f.read()
                        for env_var in environ.split("\0"):
                            if env_var.startswith("MANGOHUD_CONFIGFILE="):
                                config_path = env_var.split("=", 1)[1]
                                decky.logger.info(f"Config do MangoHud encontrada: {config_path}")
                                return config_path
                except (FileNotFoundError, PermissionError, IOError):
                    continue

            common_paths = [
                os.path.expanduser("~/.config/MangoHud/MangoHud.conf"),
                "/tmp/mangohud.conf",
                "/tmp/MangoHud.conf",
            ]
            for path in common_paths:
                if os.path.exists(path):
                    decky.logger.info(f"Usando config alternativa do MangoHud: {path}")
                    return path

            default_path = "/tmp/mangohud_crosshair.conf"
            decky.logger.info(f"Nenhuma config do MangoHud encontrada, criando: {default_path}")
            return default_path
        except Exception as e:
            decky.logger.error(f"Erro ao procurar a config do MangoHud: {e}")
            return "/tmp/mangohud_crosshair.conf"

    def build_config(self, force_enabled=None):
        s = self.settings
        show = s["enabled"] if force_enabled is None else force_enabled
        if show:
            lines = MODELS[s["model"]]["lines"]
            x, y = self.compute_offsets()
        else:
            lines = ["", "", ""]
            x, y = 0, 0
        font_size = max(1, round(REF_FONT_SIZE * s["size"] / 100))
        return (
            "legacy_layout=false\n"
            "background_alpha=0\n"
            "alpha=1\n"
            "background_color=020202\n"
            f"text_color={s['color']}\n"
            f"font_size={font_size}\n"
            f"custom_text={lines[0]}\n"
            f"custom_text={lines[1]}\n"
            f"custom_text={lines[2]}\n"
            f"offset_x={x}\n"
            f"offset_y={y}\n"
            f"{CONFIG_MARKER}\n"
        )

    def apply(self, force_enabled=None):
        """Liga a mira (guardando o MangoHud de antes) ou a desliga (devolvendo o MangoHud de antes)."""
        config_path = self.find_mangohud_config_path()
        show = self.settings["enabled"] if force_enabled is None else force_enabled
        try:
            with open(config_path, "r", errors="replace") as f:
                current = f.read()
        except OSError:
            current = None
        ours = current is not None and CONFIG_MARKER in current
        if show:
            if current is not None and not ours:
                self.remember_config(config_path, current)
            with open(config_path, "w") as f:
                f.write(self.build_config(True))
            decky.logger.info(f"Crosshair escrito em {config_path}")
        elif ours:
            backup = self.backups.get(config_path)
            with open(config_path, "w") as f:
                f.write(backup if backup is not None else self.build_config(False))
            decky.logger.info(f"MangoHud restaurado em {config_path}")
        # Se o arquivo não é do plugin, o Steam já o trocou: não mexe.

    def restore_overlay(self):
        """Tira a mira do arquivo do MangoHud e devolve o overlay que existia antes."""
        try:
            self.apply(force_enabled=False)
        except Exception as e:
            decky.logger.error(f"Erro ao restaurar o MangoHud: {e}")

    # ------------------------------------------------------------------
    # API chamada pelo frontend
    # ------------------------------------------------------------------
    async def get_state(self) -> dict:
        return self.state()

    async def update_settings(self, patch: dict) -> dict:
        merged = dict(self.settings)
        for key in ("enabled", "model", "resolution", "color", "size", "auto_apply", "language"):
            if key in patch:
                merged[key] = patch[key]
        merged["nudge"] = dict(self.settings["nudge"])
        if "nudge_x" in patch or "nudge_y" in patch:
            model_id = merged["model"] if merged["model"] in MODELS else self.settings["model"]
            ox, oy = merged["nudge"].get(model_id, [0, 0])
            merged["nudge"][model_id] = [patch.get("nudge_x", ox), patch.get("nudge_y", oy)]
        merged["comp"] = dict(self.settings["comp"])
        if "comp_x" in patch or "comp_y" in patch:
            model_id = merged["model"] if merged["model"] in MODELS else self.settings["model"]
            ex, ey = merged["comp"].get(model_id, list(DEFAULT_COMP))
            merged["comp"][model_id] = [patch.get("comp_x", ex), patch.get("comp_y", ey)]
        merged["hotkey"] = dict(self.settings["hotkey"])
        if "hotkey_enabled" in patch:
            merged["hotkey"]["enabled"] = bool(patch["hotkey_enabled"])
        if "hotkey_hold" in patch:
            merged["hotkey"]["hold_ms"] = patch["hotkey_hold"]
        self.settings = self.sanitize(merged)
        self.sync_monitor()
        self.save_settings()
        try:
            self.apply()
        except Exception as e:
            decky.logger.error(f"Erro ao aplicar o crosshair: {e}")
            raise
        return self.state()

    async def nudge(self, dx: int, dy: int) -> dict:
        model_id = self.settings["model"]
        ox, oy = self.settings["nudge"].get(model_id, [0, 0])
        return await self.update_settings({"nudge_x": ox + int(dx), "nudge_y": oy + int(dy)})

    async def reset_nudge(self) -> dict:
        return await self.update_settings({"nudge_x": 0, "nudge_y": 0})

    async def reset_comp(self) -> dict:
        """Volta a compensação de escala do modelo atual para o padrão."""
        self.settings["comp"].pop(self.settings["model"], None)
        self.save_settings()
        try:
            self.apply()
        except Exception as e:
            decky.logger.error(f"Erro ao aplicar o crosshair: {e}")
        return self.state()

    async def save_profile(self, appid: str, name: str) -> dict:
        """Salva as configurações atuais como perfil do jogo."""
        s = self.settings
        nx, ny = s["nudge"].get(s["model"], [0, 0])
        s["profiles"][str(appid)[:20]] = sanitize_profile(
            {
                "enabled": s["enabled"],
                "model": s["model"],
                "color": s["color"],
                "size": s["size"],
                "nudge_x": nx,
                "nudge_y": ny,
            },
            name or appid,
        )
        self.save_settings()
        return self.state()

    async def delete_profile(self, appid: str) -> dict:
        self.settings["profiles"].pop(str(appid), None)
        self.save_settings()
        return self.state()

    async def rename_profile(self, appid: str, name: str) -> dict:
        """Troca só o nome exibido do perfil; o jogo (appid) continua o mesmo."""
        profile = self.settings["profiles"].get(str(appid))
        clean = " ".join(str(name).split())[:80]
        if profile is not None and clean:
            profile["name"] = clean
            self.save_settings()
        return self.state()

    async def game_started(self, appid: str) -> dict:
        """Chamado quando um jogo abre: aplica o perfil dele, se existir."""
        prof = self.settings["profiles"].get(str(appid))
        if not self.settings["auto_apply"] or not prof:
            return self.state()
        merged = dict(self.settings)
        merged["enabled"] = prof["enabled"]
        merged["model"] = prof["model"]
        merged["color"] = prof["color"]
        merged["size"] = prof["size"]
        merged["nudge"] = dict(self.settings["nudge"])
        merged["nudge"][prof["model"]] = [prof["nudge_x"], prof["nudge_y"]]
        self.settings = self.sanitize(merged)
        self.save_settings()
        try:
            self.apply()
        except Exception as e:
            decky.logger.error(f"Erro ao aplicar o perfil do jogo {appid}: {e}")
        return self.state()

    # ------------------------------------------------------------------
    # Atalho de botões (liga/desliga)
    # ------------------------------------------------------------------
    def ensure_monitor(self):
        if self.monitor is None:
            self.monitor = HotkeyMonitor(decky.logger, self._schedule_fire, self._schedule_covered)
        return self.monitor

    def sync_monitor(self):
        """Liga a leitura em jogo só quando o atalho está ativo e o backend sabe ler os 2 botões."""
        try:
            hk = self.settings["hotkey"]
            active = hk["enabled"] and len(hk["buttons"]) == 2 and set(hk["buttons"]) <= SUPPORTED_BUTTONS
            monitor = self.ensure_monitor() if active else self.monitor
            if monitor is None:
                return
            monitor.configure(hk["buttons"], hk["hold_ms"], active)
            if active:
                monitor.ensure_running()
        except Exception as e:
            decky.logger.error(f"Erro ao configurar o atalho: {e}")

    def hotkey_state(self):
        hk = self.settings["hotkey"]
        info = {}
        if self.monitor is not None:
            try:
                info = self.monitor.status()
            except Exception as e:
                decky.logger.error(f"Erro ao ler o estado do atalho: {e}")
        return {
            "enabled": hk["enabled"],
            "buttons": list(hk["buttons"]),
            "hold_ms": hk["hold_ms"],
            "running": info.get("running", False),
            "devices": info.get("devices", 0),
            "denied": info.get("denied", 0),
            "covered": info.get("covered", False),
            "last_seen": info.get("last_seen", []),
            "last_seen_age": info.get("last_seen_age"),
            "supported": len(hk["buttons"]) == 2 and set(hk["buttons"]) <= SUPPORTED_BUTTONS,
        }

    def _schedule_fire(self):
        if self.loop is not None:
            asyncio.run_coroutine_threadsafe(self.hotkey_toggle("backend"), self.loop)

    def _schedule_covered(self, covered):
        if self.loop is not None:
            asyncio.run_coroutine_threadsafe(self._emit_covered(covered), self.loop)

    async def _emit_covered(self, covered):
        """Avisa a interface se o backend está cobrindo a combinação (ela então se cala)."""
        emit = getattr(decky, "emit", None)
        if emit is None:
            return
        try:
            await emit("hotkey_covered", bool(covered))
        except Exception as e:
            decky.logger.error(f"Erro ao avisar a interface do atalho: {e}")

    async def hotkey_toggle(self, source: str = "ui") -> dict:
        """Liga/desliga o crosshair. Chamado pela interface ("ui") ou pela leitura em jogo ("backend")."""
        now = time.monotonic()
        last = self.last_toggle
        if last is not None and last[0] != source and now - last[1] < TOGGLE_DEDUP_SECONDS:
            return self.state()  # a mesma apertada já foi tratada pelo outro caminho
        self.last_toggle = (str(source), now)
        self.settings["enabled"] = not self.settings["enabled"]
        self.save_settings()
        try:
            self.apply()
        except Exception as e:
            decky.logger.error(f"Erro ao aplicar o crosshair pelo atalho: {e}")
        return self.state()

    async def set_hotkey(self, buttons: list) -> dict:
        """Salva a combinação gravada pela interface (2 IDs de botão do Steam) e ativa o atalho."""
        self.loop = asyncio.get_running_loop()
        hotkey = sanitize_hotkey(
            {"enabled": True, "buttons": buttons, "hold_ms": self.settings["hotkey"]["hold_ms"], "v": 2}
        )
        if len(hotkey["buttons"]) != 2:
            raise ValueError("A combinação precisa de exatamente 2 botões diferentes")
        self.settings = self.sanitize({**self.settings, "hotkey": hotkey})
        self.save_settings()
        self.sync_monitor()
        await self._blink()
        return self.state()

    async def clear_hotkey(self) -> dict:
        hotkey = {**self.settings["hotkey"], "buttons": [], "enabled": False}
        self.settings = self.sanitize({**self.settings, "hotkey": hotkey})
        self.save_settings()
        self.sync_monitor()
        return self.state()

    async def _blink(self):
        """Pisca o crosshair duas vezes para confirmar que a combinação foi gravada."""
        original = self.settings["enabled"]
        try:
            for _ in range(2):
                self.apply(force_enabled=not original)
                await asyncio.sleep(0.2)
                self.apply(force_enabled=original)
                await asyncio.sleep(0.2)
        except Exception as e:
            decky.logger.error(f"Erro ao piscar o crosshair: {e}")

    async def _main(self):
        self.load_settings()
        # O crosshair sempre começa desligado: se uma mira ficou no arquivo do
        # MangoHud (ex.: depois de reiniciar o Decky), devolve o overlay de antes.
        self.settings["enabled"] = False
        self.restore_overlay()
        self.loop = asyncio.get_running_loop()
        self.sync_monitor()
        decky.logger.info("Crosshair Plugin iniciado!")

    async def _unload(self):
        try:
            if self.monitor is not None:
                self.monitor.stop()
        except Exception as e:
            decky.logger.error(f"Erro ao parar o atalho: {e}")
        self.restore_overlay()  # não deixa a mira presa na tela se o plugin for descarregado
        decky.logger.info("Crosshair Plugin finalizado!")
