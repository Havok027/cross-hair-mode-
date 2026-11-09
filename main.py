import asyncio
import json
import math
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
    "enabled": False,
    "model": "box",
    "resolution": "800p",
    "color": "FF007B",  # rosa, igual ao plugin original
    "size": 100,  # porcentagem do tamanho padrão
    "nudge": {},  # ajuste fino por modelo: {"box": [dx, dy]}
    "comp": {},  # compensação de escala por modelo: {"box": [px, py]}
    "hotkey": {"enabled": False, "buttons": [], "hold_ms": 250},  # atalho liga/desliga
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
# O plugin lê os eventos do controle direto do sistema (/dev/input/event*), o
# mesmo que os jogos enxergam. Isso não precisa de permissão extra e não mexe
# no controle. Tudo aqui fica isolado: se algo falhar, só o atalho para de
# funcionar e o restante do plugin segue normal.
# ---------------------------------------------------------------------------
EV_KEY = 1
EV_ABS = 3
ABS_HAT0X = 16
ABS_HAT0Y = 17
TRIGGER_AXES = (2, 5)  # ABS_Z / ABS_RZ: gatilhos LT / RT em controles estilo Xbox
TRIGGER_THRESHOLD = 100
BTN_SOUTH = 0x130  # primeiro botão de gamepad (A)
EVENT_FORMAT = "llHHi"  # struct input_event do kernel
EVENT_SIZE = struct.calcsize(EVENT_FORMAT)
LEARN_SECONDS = 15
BUTTON_ID_RE = re.compile(r"^(k\d{1,4}|a\d{1,2}|d[lrud])$")

BUTTON_LABELS = {
    "k304": "A",
    "k305": "B",
    "k307": "X",
    "k308": "Y",
    "k310": "LB",
    "k311": "RB",
    "k312": "LT",
    "k313": "RT",
    "k314": "View",
    "k315": "Menu",
    "k316": "Guia",
    "k317": "L3",
    "k318": "R3",
    "k544": "D-pad cima",
    "k545": "D-pad baixo",
    "k546": "D-pad esquerda",
    "k547": "D-pad direita",
    "a2": "LT",
    "a5": "RT",
    "du": "D-pad cima",
    "dd": "D-pad baixo",
    "dl": "D-pad esquerda",
    "dr": "D-pad direita",
}


def label_for(button_id):
    """Nome amigável de um botão (ex.: "k310" -> "LB")."""
    if button_id in BUTTON_LABELS:
        return BUTTON_LABELS[button_id]
    if button_id.startswith("k"):
        try:
            code = int(button_id[1:])
        except ValueError:
            return button_id
        if 0x2C0 <= code <= 0x2E7:  # botões extras (ex.: botões traseiros)
            return f"Extra {code - 0x2C0 + 1}"
        return f"Botão {code}"
    return button_id


def decode_event(etype, code, value, xinput):
    """Converte um evento do kernel em [(id_do_botão, pressionado)]."""
    if etype == EV_KEY:
        if code < 0x100 or value == 2:  # ignora teclado e auto-repetição
            return []
        return [(f"k{code}", value == 1)]
    if etype == EV_ABS:
        if code == ABS_HAT0X:
            return [("dl", value < 0), ("dr", value > 0)]
        if code == ABS_HAT0Y:
            return [("du", value < 0), ("dd", value > 0)]
        if xinput and code in TRIGGER_AXES:
            return [(f"a{code}", value > TRIGGER_THRESHOLD)]
    return []


def _has_bit(words, bit, word_bits):
    """Confere um bit no mapa de teclas do /proc (palavras em hex, da mais alta para a mais baixa)."""
    try:
        index = len(words) - 1 - bit // word_bits
        if index < 0:
            return False
        return bool((int(words[index], 16) >> (bit % word_bits)) & 1)
    except ValueError:
        return False


def parse_proc_devices(text):
    """Lista [(caminho, nome)] dos dispositivos que parecem controles de jogo."""
    found = []
    word_bits = struct.calcsize("P") * 8
    for block in text.strip().split("\n\n"):
        name, handlers, key_words = "", [], []
        for line in block.splitlines():
            if line.startswith("N: Name="):
                name = line.split("=", 1)[1].strip().strip('"')
            elif line.startswith("H: Handlers="):
                handlers = line.split("=", 1)[1].split()
            elif line.startswith("B: KEY="):
                key_words = line.split("=", 1)[1].split()
        event = next((h for h in handlers if h.startswith("event")), None)
        if event and key_words and _has_bit(key_words, BTN_SOUTH, word_bits):
            found.append(("/dev/input/" + event, name))
    return found


def discover_gamepads():
    with open("/proc/bus/input/devices", "r", errors="replace") as f:
        return parse_proc_devices(f.read())


def _open_device(path):
    return os.open(path, os.O_RDONLY | os.O_NONBLOCK | getattr(os, "O_CLOEXEC", 0))


def _is_xinput(name):
    lowered = name.lower()
    return "x-box" in lowered or "xbox" in lowered or "x360" in lowered


class HotkeyMonitor:
    """Lê os controles em uma thread própria e avisa quando a combinação é segurada."""

    def __init__(self, log, on_fire, on_learned, discover=None, opener=None):
        self.log = log
        self.on_fire = on_fire
        self.on_learned = on_learned
        self.discover = discover or discover_gamepads
        self.opener = opener or _open_device
        self.lock = threading.RLock()
        self.thread = None
        self.stop_event = threading.Event()
        self.combo = []
        self.hold = 0.25
        self.active = False
        self.devices = {}
        self.denied = 0
        self.order = []
        self.pressed_since = None
        self.fired = False
        self.require_release = False
        self.learn_deadline = 0.0
        self.learn_since = None
        self.message = ""
        self.last_button = ""

    # --- usado pelo plugin -------------------------------------------------
    def configure(self, combo, hold_ms, active):
        with self.lock:
            self.combo = list(combo)
            self.hold = max(0, hold_ms) / 1000.0
            self.active = bool(active) and len(self.combo) == 2
            self.pressed_since = None
            self.fired = False

    def start_learning(self, seconds=LEARN_SECONDS):
        with self.lock:
            self.learn_deadline = time.monotonic() + seconds
            self.learn_since = None
            self.message = ""
        self.ensure_running()

    def cancel_learning(self, message=""):
        with self.lock:
            self.learn_deadline = 0.0
            self.learn_since = None
            self.message = message

    def is_learning(self):
        return time.monotonic() < self.learn_deadline

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
        now = time.monotonic()
        with self.lock:
            return {
                "running": self.thread is not None,
                "devices": len(self.devices),
                "denied": self.denied,
                "learning": now < self.learn_deadline,
                "learn_left": max(0, math.ceil(self.learn_deadline - now)) if now < self.learn_deadline else 0,
                "message": self.message,
                "last_button": label_for(self.last_button) if self.last_button else "",
            }

    # --- thread de leitura -------------------------------------------------
    def _needed(self):
        return self.active or time.monotonic() < self.learn_deadline

    def _run(self, stop_event):
        last_scan = 0.0
        try:
            while not stop_event.is_set():
                with self.lock:
                    if not self._needed():
                        if self.thread is threading.current_thread():
                            self.thread = None
                        return
                try:
                    now = time.monotonic()
                    if now - last_scan >= 2.0:
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

    def _rescan(self):
        try:
            found = self.discover()
        except Exception as e:
            self.log.error(f"Erro ao procurar controles: {e}")
            return
        paths = {path for path, _ in found}
        with self.lock:
            for path in list(self.devices):
                if path not in paths:
                    self._drop(path)
            denied = 0
            for path, name in found:
                if path in self.devices:
                    continue
                try:
                    fd = self.opener(path)
                except PermissionError:
                    denied += 1
                    continue
                except OSError:
                    continue
                self.devices[path] = {"path": path, "name": name, "fd": fd, "held": set(), "xinput": _is_xinput(name)}
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

    def _held(self):
        held = set()
        for device in self.devices.values():
            held |= device["held"]
        return held

    def _read(self, device):
        try:
            data = os.read(device["fd"], EVENT_SIZE * 64)
        except BlockingIOError:
            return
        except OSError:
            self._drop(device["path"])
            return
        if not data:
            self._drop(device["path"])
            return
        for offset in range(0, len(data) - EVENT_SIZE + 1, EVENT_SIZE):
            _, _, etype, code, value = struct.unpack_from(EVENT_FORMAT, data, offset)
            for button, down in decode_event(etype, code, value, device["xinput"]):
                self._set_button(device, button, down)

    def _set_button(self, device, button, down):
        with self.lock:
            if down:
                device["held"].add(button)
                if button not in self.order:
                    self.order.append(button)
                self.last_button = button
            else:
                device["held"].discard(button)
                if button not in self._held() and button in self.order:
                    self.order.remove(button)

    def _tick(self, now):
        """Controla a gravação da combinação e o disparo do atalho."""
        learned = None
        fire = False
        with self.lock:
            held = self._held()
            if self.learn_deadline and now >= self.learn_deadline:
                self.learn_deadline = 0.0
                self.learn_since = None
                self.message = "Tempo esgotado. Nenhuma combinação foi gravada."
            if now < self.learn_deadline:
                if len(held) >= 2:
                    if self.learn_since is None:
                        self.learn_since = now
                    elif now - self.learn_since >= 0.4:
                        pressed = [b for b in self.order if b in held]
                        if len(held) == 2 and len(pressed) == 2:
                            learned = pressed
                            self.learn_deadline = 0.0
                            self.learn_since = None
                            self.require_release = True
                            self.message = ""
                        else:
                            self.message = "Aperte só 2 botões ao mesmo tempo."
                            self.learn_since = None
                else:
                    self.learn_since = None
            elif self.require_release:
                # logo após gravar, espera soltar os botões para não disparar sem querer
                if not held:
                    self.require_release = False
            elif self.active and set(self.combo) <= held:
                if self.pressed_since is None:
                    self.pressed_since = now
                if not self.fired and now - self.pressed_since >= self.hold:
                    self.fired = True
                    fire = True
            else:
                self.pressed_since = None
                self.fired = False
        if learned is not None:
            self._call(self.on_learned, learned)
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
    """Valida o atalho: ativo ou não, os 2 botões e quanto tempo segurar (ms)."""
    if not isinstance(raw, dict):
        raw = {}
    buttons = raw.get("buttons", [])
    if (
        not isinstance(buttons, (list, tuple))
        or len(buttons) != 2
        or buttons[0] == buttons[1]
        or not all(isinstance(b, str) and BUTTON_ID_RE.match(b) for b in buttons)
    ):
        buttons = []
    try:
        hold_ms = _clamp(int(raw.get("hold_ms", 250)), 0, 1000)
    except (TypeError, ValueError):
        hold_ms = 250
    return {"enabled": bool(raw.get("enabled", False)) and len(buttons) == 2, "buttons": list(buttons), "hold_ms": hold_ms}


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

    # ------------------------------------------------------------------
    # Persistência
    # ------------------------------------------------------------------
    def load_settings(self):
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
            "profiles": [{"appid": k, "name": v["name"]} for k, v in s["profiles"].items()],
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
            f"offset_y={y}"
        )

    def apply(self, force_enabled=None):
        config_path = self.find_mangohud_config_path()
        with open(config_path, "w") as f:
            f.write(self.build_config(force_enabled))
        decky.logger.info(f"Crosshair escrito em {config_path}")

    # ------------------------------------------------------------------
    # API chamada pelo frontend
    # ------------------------------------------------------------------
    async def get_state(self) -> dict:
        return self.state()

    async def update_settings(self, patch: dict) -> dict:
        merged = dict(self.settings)
        for key in ("enabled", "model", "resolution", "color", "size", "auto_apply"):
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
            self.monitor = HotkeyMonitor(decky.logger, self._schedule_fire, self._schedule_learned)
        return self.monitor

    def sync_monitor(self):
        """Liga o monitor só quando o atalho está ativo e com 2 botões gravados."""
        try:
            hk = self.settings["hotkey"]
            active = hk["enabled"] and len(hk["buttons"]) == 2
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
            "buttons": [label_for(b) for b in hk["buttons"]],
            "hold_ms": hk["hold_ms"],
            "running": info.get("running", False),
            "devices": info.get("devices", 0),
            "denied": info.get("denied", 0),
            "learning": info.get("learning", False),
            "learn_left": info.get("learn_left", 0),
            "message": info.get("message", ""),
            "last_button": info.get("last_button", ""),
        }

    def _schedule_fire(self):
        if self.loop is not None:
            asyncio.run_coroutine_threadsafe(self._hotkey_fire(), self.loop)

    def _schedule_learned(self, buttons):
        if self.loop is not None:
            asyncio.run_coroutine_threadsafe(self._hotkey_learned(buttons), self.loop)

    async def _hotkey_fire(self):
        self.settings["enabled"] = not self.settings["enabled"]
        self.save_settings()
        try:
            self.apply()
        except Exception as e:
            decky.logger.error(f"Erro ao aplicar o crosshair pelo atalho: {e}")

    async def _hotkey_learned(self, buttons):
        hotkey = {**self.settings["hotkey"], "buttons": list(buttons), "enabled": True}
        self.settings = self.sanitize({**self.settings, "hotkey": hotkey})
        self.save_settings()
        self.sync_monitor()
        await self._blink()

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

    async def start_hotkey_learning(self) -> dict:
        self.loop = asyncio.get_running_loop()
        self.ensure_monitor().start_learning()
        return self.state()

    async def cancel_hotkey_learning(self) -> dict:
        if self.monitor is not None:
            self.monitor.cancel_learning("Gravação cancelada.")
        return self.state()

    async def clear_hotkey(self) -> dict:
        hotkey = {**self.settings["hotkey"], "buttons": [], "enabled": False}
        self.settings = self.sanitize({**self.settings, "hotkey": hotkey})
        self.save_settings()
        self.sync_monitor()
        return self.state()

    async def _main(self):
        self.load_settings()
        # A config do MangoHud não é reaplicada ao iniciar (como no plugin
        # original), então o crosshair sempre começa desligado.
        self.settings["enabled"] = False
        self.loop = asyncio.get_running_loop()
        self.sync_monitor()
        decky.logger.info("Crosshair Plugin iniciado!")

    async def _unload(self):
        try:
            if self.monitor is not None:
                self.monitor.stop()
        except Exception as e:
            decky.logger.error(f"Erro ao parar o atalho: {e}")
        decky.logger.info("Crosshair Plugin finalizado!")
