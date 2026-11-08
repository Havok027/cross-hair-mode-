import {
  ButtonItem,
  DropdownItem,
  Focusable,
  PanelSection,
  PanelSectionRow,
  Router,
  SliderField,
  ToggleField,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useEffect, useRef, useState } from "react";
import { FaCrosshairs } from "react-icons/fa";

// ---------------------------------------------------------------------------
// Tipos e chamadas ao backend (main.py)
// ---------------------------------------------------------------------------
interface Settings {
  enabled: boolean;
  model: string;
  resolution: string;
  color: string; // RRGGBB, sem "#"
  size: number; // porcentagem (50 a 300)
  nudge_x: number;
  nudge_y: number;
  auto_apply: boolean;
}

interface PluginState {
  settings: Settings;
  models: { id: string; label: string; lines: string[] }[];
  resolutions: { id: string; label: string }[];
  profiles: { appid: string; name: string }[];
  offset_x: number;
  offset_y: number;
}

interface GameInfo {
  appid: string;
  name: string;
}

const getState = callable<[], PluginState>("get_state");
const updateSettings = callable<[Record<string, unknown>], PluginState>("update_settings");
const nudge = callable<[number, number], PluginState>("nudge");
const resetNudge = callable<[], PluginState>("reset_nudge");
const saveProfile = callable<[string, string], PluginState>("save_profile");
const deleteProfile = callable<[string], PluginState>("delete_profile");
const gameStarted = callable<[string], PluginState>("game_started");

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const COLORS = [
  { name: "Rosa", hex: "FF007B" },
  { name: "Verde", hex: "00FF66" },
  { name: "Vermelho", hex: "FF2D2D" },
  { name: "Amarelo", hex: "FFE600" },
  { name: "Ciano", hex: "00E5FF" },
  { name: "Roxo", hex: "9B5CFF" },
  { name: "Laranja", hex: "FF8A00" },
  { name: "Branco", hex: "FFFFFF" },
];

function hexToRgb(hex: string): number[] {
  const n = parseInt(hex, 16);
  if (Number.isNaN(n)) return [255, 0, 123];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const p = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return (p(r) + p(g) + p(b)).toUpperCase();
}

// Jogo que está rodando agora (null se estiver só no menu)
function getRunningGame(): GameInfo | null {
  try {
    const app = (Router as unknown as {
      MainRunningApp?: { appid: string | number; display_name?: string };
    }).MainRunningApp;
    if (app && app.appid) {
      return { appid: String(app.appid), name: app.display_name || "Jogo " + app.appid };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

const STYLES = `
.xh-preview {
  display: flex; align-items: center; justify-content: center;
  height: 118px; width: 100%; border-radius: 16px; overflow: hidden;
  background: radial-gradient(circle at 50% 30%, #34406a 0%, #141726 72%);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: inset 0 0 24px rgba(0,0,0,0.45);
}
.xh-preview-text {
  font-family: monospace; white-space: pre; text-align: center; line-height: 1.15;
  text-shadow: 0 0 8px rgba(0,0,0,0.85);
}
.xh-chip {
  display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px;
  background: rgba(26,159,255,0.20); border: 1px solid rgba(26,159,255,0.55);
}
.xh-chip.xh-off { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); opacity: 0.8; }
.xh-swatches { display: flex; flex-wrap: wrap; gap: 12px; padding: 4px 2px; }
.xh-swatch {
  width: 34px; height: 34px; border-radius: 50%; box-sizing: border-box;
  border: 3px solid rgba(255,255,255,0.22); transition: transform 0.12s, border-color 0.12s;
}
.xh-swatch.xh-active { border-color: #ffffff; }
.xh-swatch.gpfocus { transform: scale(1.2); box-shadow: 0 0 0 3px #1a9fff; }
.xh-hint { font-size: 12px; line-height: 1.45; opacity: 0.62; }
.xh-offsets { font-size: 12px; opacity: 0.75; text-align: center; width: 100%; }
.xh-game { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
`;

function Swatch(props: { hex: string; active: boolean; onSelect: () => void }) {
  return (
    <Focusable
      className={"xh-swatch" + (props.active ? " xh-active" : "")}
      style={{ background: "#" + props.hex }}
      onActivate={props.onSelect}
    />
  );
}

// ---------------------------------------------------------------------------
// Tela principal
// ---------------------------------------------------------------------------
function Content() {
  const [state, setState] = useState<PluginState | null>(null);
  const [status, setStatus] = useState("");
  const [game] = useState<GameInfo | null>(() => getRunningGame());
  const [customColor, setCustomColor] = useState(false);
  const [bigStep, setBigStep] = useState(false);

  // Junta alterações rápidas (sliders) e envia ao backend de uma vez
  const pending = useRef<Record<string, unknown>>({});
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    getState()
      .then(setState)
      .catch((error) => {
        console.error(error);
        setStatus("Falha ao carregar: " + String(error));
      });
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    };
  }, []);

  const run = async (action: () => Promise<PluginState>, okMessage: string) => {
    try {
      setState(await action());
      setStatus(okMessage);
    } catch (error) {
      console.error(error);
      setStatus("Falhou: " + String(error));
    }
  };

  const patchSettings = (patch: Partial<Settings>) => {
    setState((prev) => (prev ? { ...prev, settings: { ...prev.settings, ...patch } } : prev));
    pending.current = { ...pending.current, ...patch };
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      const toSend = pending.current;
      pending.current = {};
      try {
        setState(await updateSettings(toSend));
        setStatus("");
      } catch (error) {
        console.error(error);
        setStatus("Falha ao aplicar: " + String(error));
      }
    }, 150);
  };

  if (!state) {
    return (
      <PanelSection title="Crosshair">
        <PanelSectionRow>
          <div className="xh-hint">{status || "Carregando..."}</div>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const { settings, models, resolutions, profiles } = state;
  const currentModel = models.find((m) => m.id === settings.model) ?? models[0];
  const [r, g, b] = hexToRgb(settings.color);
  const step = bigStep ? 5 : 1;
  const hasProfile = game !== null && profiles.some((p) => p.appid === game.appid);

  return (
    <>
      <style>{STYLES}</style>

      <PanelSection title="Crosshair">
        <PanelSectionRow>
          <div className="xh-preview">
            <div
              className="xh-preview-text"
              style={{
                color: "#" + settings.color,
                fontSize: Math.round((24 * settings.size) / 100) + "px",
                opacity: settings.enabled ? 1 : 0.3,
              }}
            >
              {currentModel.lines.join("\n")}
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Mostrar crosshair"
            description="Substitui o overlay de desempenho (MangoHud)."
            checked={settings.enabled}
            onChange={(value: boolean) => patchSettings({ enabled: value })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label="Modelo"
            rgOptions={models.map((m) => ({ data: m.id, label: m.label }))}
            selectedOption={settings.model}
            onChange={(option: { data: string }) => patchSettings({ model: option.data })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label="Resolução da tela"
            rgOptions={resolutions.map((res) => ({ data: res.id, label: res.label }))}
            selectedOption={settings.resolution}
            onChange={(option: { data: string }) => patchSettings({ resolution: option.data })}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Cor e tamanho">
        <PanelSectionRow>
          <div className="xh-swatches">
            {COLORS.map((c) => (
              <Swatch
                key={c.hex}
                hex={c.hex}
                active={c.hex === settings.color}
                onSelect={() => patchSettings({ color: c.hex })}
              />
            ))}
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Cor personalizada (RGB)"
            checked={customColor}
            onChange={(value: boolean) => setCustomColor(value)}
          />
        </PanelSectionRow>
        {customColor && (
          <>
            <PanelSectionRow>
              <SliderField
                label="Vermelho"
                value={r}
                min={0}
                max={255}
                step={5}
                showValue
                onChange={(v: number) => patchSettings({ color: rgbToHex(v, g, b) })}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <SliderField
                label="Verde"
                value={g}
                min={0}
                max={255}
                step={5}
                showValue
                onChange={(v: number) => patchSettings({ color: rgbToHex(r, v, b) })}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <SliderField
                label="Azul"
                value={b}
                min={0}
                max={255}
                step={5}
                showValue
                onChange={(v: number) => patchSettings({ color: rgbToHex(r, g, v) })}
              />
            </PanelSectionRow>
          </>
        )}
        <PanelSectionRow>
          <SliderField
            label="Tamanho"
            value={settings.size}
            min={50}
            max={300}
            step={10}
            showValue
            valueSuffix="%"
            onChange={(v: number) => patchSettings({ size: v })}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Posição">
        <PanelSectionRow>
          <SliderField
            label="Horizontal (X)"
            value={settings.nudge_x}
            min={-200}
            max={200}
            step={1}
            showValue
            onChange={(v: number) => patchSettings({ nudge_x: v })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            label="Vertical (Y)"
            value={settings.nudge_y}
            min={-200}
            max={200}
            step={1}
            showValue
            onChange={(v: number) => patchSettings({ nudge_y: v })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Botões com passo grande (5 px)"
            checked={bigStep}
            onChange={(value: boolean) => setBigStep(value)}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => run(() => nudge(0, -step), "Posição ajustada")}>
            Cima
          </ButtonItem>
          <ButtonItem layout="below" onClick={() => run(() => nudge(-step, 0), "Posição ajustada")}>
            Esquerda
          </ButtonItem>
          <ButtonItem layout="below" onClick={() => run(() => nudge(step, 0), "Posição ajustada")}>
            Direita
          </ButtonItem>
          <ButtonItem layout="below" onClick={() => run(() => nudge(0, step), "Posição ajustada")}>
            Baixo
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => run(() => resetNudge(), "Ajuste zerado")}>
            Zerar ajuste de posição
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <div className="xh-offsets">
            Posição final: {state.offset_x}, {state.offset_y}
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Perfil do jogo">
        <PanelSectionRow>
          {game ? (
            <div>
              <div className="xh-game">{game.name}</div>
              <span className={"xh-chip" + (hasProfile ? "" : " xh-off")}>
                {hasProfile ? "Perfil salvo" : "Sem perfil"}
              </span>
            </div>
          ) : (
            <div className="xh-hint">
              Abra este menu com um jogo rodando para salvar um perfil só para ele (modelo, cor, tamanho e
              posição).
            </div>
          )}
        </PanelSectionRow>
        {game && (
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={() => run(() => saveProfile(game.appid, game.name), "Perfil salvo para " + game.name)}
            >
              {hasProfile ? "Atualizar perfil deste jogo" : "Salvar perfil deste jogo"}
            </ButtonItem>
          </PanelSectionRow>
        )}
        {game && hasProfile && (
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={() => run(() => deleteProfile(game.appid), "Perfil removido de " + game.name)}
            >
              Excluir perfil deste jogo
            </ButtonItem>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ToggleField
            label="Aplicar perfil ao abrir o jogo"
            checked={settings.auto_apply}
            onChange={(value: boolean) => patchSettings({ auto_apply: value })}
          />
        </PanelSectionRow>
        {profiles
          .filter((p) => !game || p.appid !== game.appid)
          .map((p) => (
            <PanelSectionRow key={p.appid}>
              <ButtonItem
                layout="below"
                onClick={() => run(() => deleteProfile(p.appid), "Perfil removido de " + p.name)}
              >
                Excluir perfil: {p.name}
              </ButtonItem>
            </PanelSectionRow>
          ))}
      </PanelSection>

      <PanelSection>
        {status && (
          <PanelSectionRow>
            <div className="xh-hint">{status}</div>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <div className="xh-hint">
            O plugin usa o texto do MangoHud como mira, então não dá para ter o overlay de desempenho ao mesmo
            tempo. Para voltar o overlay, mude o nível de desempenho no menu rápido. Depois, ligue o crosshair
            de novo aqui.
          </div>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
}

export default definePlugin(() => {
  // Ao abrir um jogo, aplica o perfil salvo dele (se houver)
  let unregister: { unregister?: () => void } | undefined;
  try {
    const steamClient = (window as unknown as { SteamClient?: any }).SteamClient;
    unregister = steamClient?.GameSessions?.RegisterForAppLifetimeNotifications?.(
      (update: { unAppID: number; bRunning: boolean }) => {
        if (update.bRunning) {
          gameStarted(String(update.unAppID)).catch((error) => console.error(error));
        }
      },
    );
  } catch (error) {
    console.error(error);
  }

  return {
    name: "Crosshair Plugin",
    titleView: <div className={staticClasses.Title}>Crosshair</div>,
    content: <Content />,
    icon: <FaCrosshairs />,
    onDismount() {
      try {
        unregister?.unregister?.();
      } catch (error) {
        console.error(error);
      }
    },
  };
});
