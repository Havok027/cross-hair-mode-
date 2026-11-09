import { Focusable } from "@decky/ui";
import { FaCheck } from "react-icons/fa";
import type { HotkeyState, Settings } from "./api";
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
            textShadow: "0 0 10px #" + settings.color + "99, 0 0 3px #000000",
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
            style={{
              background: "#" + c.hex,
              boxShadow: active ? "0 0 12px #" + c.hex + "aa" : "none",
            }}
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

// Cartão do atalho de botões: combinação gravada, gravação em andamento e diagnóstico
export function HotkeyCard(props: { hotkey: HotkeyState }) {
  const h = props.hotkey;
  const hasCombo = h.buttons.length === 2;
  return (
    <div className={"xh-card" + (h.learning ? " xh-recording" : "")}>
      {h.learning ? (
        <>
          <div className="xh-rec">
            <span className="xh-rec-dot" />
            Gravando... {h.learn_left}s
          </div>
          <div className="xh-hint">
            Feche este menu e aperte os 2 botões juntos. A mira pisca quando a combinação for gravada.
          </div>
        </>
      ) : hasCombo ? (
        <>
          <div className="xh-card-title">Combinação</div>
          <div className="xh-keys">
            <span className="xh-key">{h.buttons[0]}</span>
            <span className="xh-plus">+</span>
            <span className="xh-key">{h.buttons[1]}</span>
          </div>
        </>
      ) : (
        <div className="xh-hint">Nenhuma combinação gravada. Toque em "Gravar combinação".</div>
      )}
      {h.message && !h.learning && <div className="xh-warn">{h.message}</div>}
      {h.running && (
        <div className="xh-hint xh-diag">
          Controles detectados: {h.devices}
          {h.last_button ? " · último botão: " + h.last_button : ""}
        </div>
      )}
      {h.running && h.denied > 0 && (
        <div className="xh-warn">Sem permissão para ler {h.denied} controle(s).</div>
      )}
    </div>
  );
}
