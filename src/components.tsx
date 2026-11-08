import { Focusable } from "@decky/ui";
import { FaCheck } from "react-icons/fa";
import type { Settings } from "./api";
import { COLORS, SIZE_PRESETS } from "./utils";

// Prévia da mira, com guias no centro do "palco"
export function Preview(props: { settings: Settings; lines: string[]; modelLabel: string }) {
  const { settings, lines, modelLabel } = props;
  return (
    <div className="xh-hero">
      <div className="xh-stage">
        <div className="xh-guide-h" />
        <div className="xh-guide-v" />
        <div
          className="xh-preview-text"
          style={{
            color: "#" + settings.color,
            fontSize: Math.round((24 * settings.size) / 100) + "px",
            opacity: settings.enabled ? 1 : 0.3,
          }}
        >
          {lines.join("\n")}
        </div>
      </div>
      <div className="xh-chips">
        <span className={"xh-pill" + (settings.enabled ? " xh-on" : "")}>
          {settings.enabled ? "Ativo" : "Desligado"}
        </span>
        <span className="xh-chip">{modelLabel}</span>
        <span className="xh-chip">{settings.size}%</span>
        <span className="xh-chip">
          <span className="xh-dot" style={{ background: "#" + settings.color }} />#{settings.color}
        </span>
      </div>
    </div>
  );
}

// Bolinhas de cor navegáveis com o controle
export function ColorSwatches(props: { value: string; onSelect: (hex: string) => void }) {
  return (
    <div className="xh-swatches">
      {COLORS.map((c) => {
        const active = c.hex === props.value;
        return (
          <Focusable
            key={c.hex}
            className={"xh-swatch" + (active ? " xh-active" : "")}
            style={{ background: "#" + c.hex }}
            onActivate={() => props.onSelect(c.hex)}
          >
            {active && <FaCheck size={13} color="#000000" />}
          </Focusable>
        );
      })}
    </div>
  );
}

// Atalhos de tamanho (50%, 100%, ...)
export function SizeChips(props: { value: number; onSelect: (size: number) => void }) {
  return (
    <div className="xh-sizes">
      {SIZE_PRESETS.map((size) => (
        <Focusable
          key={size}
          className={"xh-size" + (props.value === size ? " xh-active" : "")}
          onActivate={() => props.onSelect(size)}
        >
          {size}%
        </Focusable>
      ))}
    </div>
  );
}
