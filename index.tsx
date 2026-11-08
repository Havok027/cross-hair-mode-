import {
  ButtonItem,
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  SliderField,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";

interface Settings {
  enabled: boolean;
  model: string;
  resolution: string;
  color: string; // RRGGBB, sem "#"
  size: number; // porcentagem (50 a 300)
  nudge_x: number;
  nudge_y: number;
}

interface PluginState {
  settings: Settings;
  models: { id: string; label: string; lines: string[] }[];
  resolutions: { id: string; label: string }[];
  offset_x: number;
  offset_y: number;
}

// Métodos do main.py
const getState = callable<[], PluginState>("get_state");
const updateSettings = callable<[Record<string, unknown>], PluginState>("update_settings");
const nudge = callable<[number, number], PluginState>("nudge");
const resetNudge = callable<[], PluginState>("reset_nudge");

const COLORS = [
  { data: "FF007B", label: "Rosa" },
  { data: "00FF66", label: "Verde" },
  { data: "FF2D2D", label: "Vermelho" },
  { data: "FFE600", label: "Amarelo" },
  { data: "00E5FF", label: "Ciano" },
  { data: "9B5CFF", label: "Roxo" },
  { data: "FF8A00", label: "Laranja" },
  { data: "FFFFFF", label: "Branco" },
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

function Content() {
  const [state, setState] = useState<PluginState | null>(null);
  const [status, setStatus] = useState("Nenhuma ação ainda");

  const run = async (action: () => Promise<PluginState>, okMessage: string) => {
    try {
      setState(await action());
      setStatus(okMessage);
    } catch (error) {
      console.error(error);
      setStatus("Falhou: " + String(error));
    }
  };

  const change = (patch: Record<string, unknown>, okMessage: string) =>
    run(() => updateSettings(patch), okMessage);

  useEffect(() => {
    getState()
      .then(setState)
      .catch((error) => {
        console.error(error);
        setStatus("Falha ao carregar: " + String(error));
      });
  }, []);

  if (!state) {
    return (
      <PanelSection title="Crosshair Plugin">
        <PanelSectionRow>
          <div>{status}</div>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const { settings, models, resolutions } = state;
  const [r, g, b] = hexToRgb(settings.color);
  const colorKnown = COLORS.some((c) => c.data === settings.color);
  const colorOptions = colorKnown
    ? COLORS
    : [...COLORS, { data: settings.color, label: "Personalizada (#" + settings.color + ")" }];

  return (
    <PanelSection title="Crosshair Plugin">
      <PanelSectionRow>
        <div>
          NOTA: este plugin substitui o overlay de desempenho por um texto que funciona como crosshair. Não dá
          para ter os dois ao mesmo tempo. Para voltar o overlay, mude um dos 4 níveis no menu rápido.
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <DropdownItem
          label="Resolução"
          rgOptions={resolutions.map((res) => ({ data: res.id, label: res.label }))}
          selectedOption={settings.resolution}
          onChange={(option: { data: string }) =>
            change({ resolution: option.data }, "Resolução alterada")
          }
        />
      </PanelSectionRow>

      {models.map((m) => (
        <PanelSectionRow key={m.id}>
          <ButtonItem
            layout="below"
            onClick={() => change({ model: m.id, enabled: true }, "Crosshair " + m.label + " aplicado!")}
          >
            {(settings.enabled && settings.model === m.id ? "✓ " : "") + "Crosshair " + m.label}
          </ButtonItem>
        </PanelSectionRow>
      ))}

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => change({ enabled: false }, "Crosshair removido!")}>
          Remover Crosshair
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <DropdownItem
          label="Cor"
          rgOptions={colorOptions}
          selectedOption={settings.color}
          onChange={(option: { data: string }) => change({ color: option.data }, "Cor alterada")}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <SliderField
          label="Vermelho"
          value={r}
          min={0}
          max={255}
          step={5}
          showValue
          onChange={(v: number) => change({ color: rgbToHex(v, g, b) }, "Cor alterada")}
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
          onChange={(v: number) => change({ color: rgbToHex(r, v, b) }, "Cor alterada")}
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
          onChange={(v: number) => change({ color: rgbToHex(r, g, v) }, "Cor alterada")}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <SliderField
          label="Tamanho"
          value={settings.size}
          min={50}
          max={300}
          step={10}
          showValue
          valueSuffix="%"
          onChange={(v: number) => change({ size: v }, "Tamanho alterado")}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => run(() => nudge(0, -1), "Posição ajustada (cima)")}>
          Cima
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => run(() => nudge(-1, 0), "Posição ajustada (esquerda)")}>
          Esquerda
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => run(() => nudge(1, 0), "Posição ajustada (direita)")}>
          Direita
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => run(() => nudge(0, 1), "Posição ajustada (baixo)")}>
          Baixo
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => run(() => resetNudge(), "Ajuste zerado")}>
          Zerar ajuste de posição
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div>Status: {status}</div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>
          Posição atual: X = {state.offset_x}, Y = {state.offset_y} (ajuste: {settings.nudge_x},{" "}
          {settings.nudge_y})
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "Crosshair Plugin",
  titleView: <div className={staticClasses.Title}>Crosshair Plugin</div>,
  content: <Content />,
  icon: <FaCrosshairs />,
}));
