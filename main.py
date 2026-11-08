import json
import os
import re

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

DEFAULTS = {
    "enabled": False,
    "model": "box",
    "resolution": "800p",
    "color": "FF007B",  # rosa, igual ao plugin original
    "size": 100,  # porcentagem do tamanho padrão
    "nudge": {},  # ajuste fino por modelo: {"box": [dx, dy]}
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


def _clamp(value, low, high):
    return max(low, min(high, value))


class Plugin:
    def __init__(self):
        self.settings = json.loads(json.dumps(DEFAULTS))
        self.settings_path = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "settings.json")

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
        return out

    # ------------------------------------------------------------------
    # Cálculo de posição
    # ------------------------------------------------------------------
    def compute_offsets(self):
        s = self.settings
        res = RESOLUTIONS[s["resolution"]]
        model = MODELS[s["model"]]
        scale = s["size"] / 100
        dx, dy = s["nudge"].get(s["model"], [0, 0])
        x = round(res["width"] / 2 - model["half_w"] * scale) + dx
        y = round(res["height"] / 2 - HALF_H * scale) + dy
        legacy = LEGACY_OFFSETS.get((s["resolution"], s["model"]))
        if legacy:
            x += legacy[0] - round(res["width"] / 2 - model["half_w"])
            y += legacy[1] - round(res["height"] / 2 - HALF_H)
        return x, y

    def state(self):
        x, y = self.compute_offsets()
        s = self.settings
        nx, ny = s["nudge"].get(s["model"], [0, 0])
        return {
            "settings": {
                "enabled": s["enabled"],
                "model": s["model"],
                "resolution": s["resolution"],
                "color": s["color"],
                "size": s["size"],
                "nudge_x": nx,
                "nudge_y": ny,
            },
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

    def build_config(self):
        s = self.settings
        if s["enabled"]:
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

    def apply(self):
        config_path = self.find_mangohud_config_path()
        with open(config_path, "w") as f:
            f.write(self.build_config())
        decky.logger.info(f"Crosshair escrito em {config_path}")

    # ------------------------------------------------------------------
    # API chamada pelo frontend
    # ------------------------------------------------------------------
    async def get_state(self) -> dict:
        return self.state()

    async def update_settings(self, patch: dict) -> dict:
        merged = dict(self.settings)
        for key in ("enabled", "model", "resolution", "color", "size"):
            if key in patch:
                merged[key] = patch[key]
        merged["nudge"] = dict(self.settings["nudge"])
        if "nudge_x" in patch or "nudge_y" in patch:
            model_id = merged["model"] if merged["model"] in MODELS else self.settings["model"]
            ox, oy = merged["nudge"].get(model_id, [0, 0])
            merged["nudge"][model_id] = [patch.get("nudge_x", ox), patch.get("nudge_y", oy)]
        self.settings = self.sanitize(merged)
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

    async def _main(self):
        self.load_settings()
        # A config do MangoHud não é reaplicada ao iniciar (como no plugin
        # original), então o crosshair sempre começa desligado.
        self.settings["enabled"] = False
        decky.logger.info("Crosshair Plugin iniciado!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin finalizado!")
