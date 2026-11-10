import { Focusable } from "@decky/ui";
import { FaCheck } from "react-icons/fa";
import type { HotkeyState, Settings } from "./api";
import { buttonName } from "./hotkey";
import { COLORS, SIZE_PRESETS } from "./utils";

// Resumo do estado da mira (sem prévia): ativa ou não, modelo, tamanho e cor
export function StatusChips(props: { settings: Settings; modelLabel: string }) {
  const { settings, modelLabel } = props;
  return (
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
  );
}

// Carrossel de cores: a cor escolhida fica sempre no centro. Quem muda a cor é o
// slider logo abaixo (esquerda/direita), então aqui é só visual e também aceita toque.
export function ColorStrip(props: { value: string; onSelect: (hex: string) => void }) {
  const total = COLORS.length;
  const index = COLORS.findIndex((c) => c.hex === props.value);
  const center = index >= 0 ? index : 0;
  const slots = [-2, -1, 0, 1, 2].map((offset) => COLORS[(center + offset + total) % total]);
  const name = index >= 0 ? COLORS[index].name : "Personalizada";
  return (
    <div className="xh-strip-wrap">
      <div className="xh-strip">
        {slots.map((c, i) => {
          const isCenter = i === 2;
          const isNear = i === 1 || i === 3;
          return (
            <div
              key={i}
              className={"xh-strip-swatch" + (isCenter ? " xh-center" : isNear ? " xh-near" : "")}
              style={{
                background: "#" + (isCenter ? props.value : c.hex),
                boxShadow: isCenter ? "0 0 16px #" + props.value + "cc" : "none",
              }}
              onClick={() => props.onSelect(c.hex)}
            >
              {isCenter && <FaCheck size={16} color="#000000" />}
            </div>
          );
        })}
      </div>
      <div className="xh-strip-name">
        {name} · #{props.value}
      </div>
    </div>
  );
}

// Atalhos de tamanho (50%, 100%, ...). O "flow-children" faz esquerda/direita
// andarem entre os botões da fileira.
export function SizeChips(props: { value: number; onSelect: (size: number) => void }) {
  return (
    <Focusable className="xh-sizes" flow-children="row">
      {SIZE_PRESETS.map((size) => (
        <Focusable
          key={size}
          className={"xh-size" + (props.value === size ? " xh-active" : "")}
          onActivate={() => props.onSelect(size)}
        >
          {size}%
        </Focusable>
      ))}
    </Focusable>
  );
}

// Explica de onde o atalho está sendo lido e, se for o caso, por que só funciona com o menu aberto
function readingNote(hotkey: HotkeyState): string {
  if (hotkey.covered) return "Leitura em jogo ativa (" + hotkey.devices + " controle(s)).";
  if (!hotkey.supported) {
    return "Esta combinação só funciona com o menu do Steam em foco. Para usar em jogo, grave outra com A, B, X, Y, direcional, LB, RB, LT, RT, Menu ou View.";
  }
  if (hotkey.devices === 0) {
    return "Procurando controles para ler em jogo. O Steam cria o controle virtual quando um jogo abre.";
  }
  return "Estes botões não chegam pelo controle virtual do Steam. Para usar em jogo, grave A, B, X, Y, direcional, LB, RB, LT, RT, Menu ou View.";
}

// Cartão do atalho de botões: combinação gravada, gravação em andamento e situação da leitura
export function HotkeyCard(props: {
  hotkey: HotkeyState;
  capturing: boolean;
  secondsLeft: number;
  message: string;
}) {
  const { hotkey, capturing, secondsLeft, message } = props;
  const hasCombo = hotkey.buttons.length === 2;
  return (
    <div className={"xh-card" + (capturing ? " xh-recording" : "")}>
      {capturing ? (
        <>
          <div className="xh-rec">
            <span className="xh-rec-dot" />
            Gravando... {secondsLeft}s
          </div>
          <div className="xh-hint">
            Aperte os 2 botões juntos e depois solte. Pode fazer com este menu aberto.
          </div>
        </>
      ) : hasCombo ? (
        <>
          <div className="xh-card-title">Combinação</div>
          <div className="xh-keys">
            <span className="xh-key">{buttonName(hotkey.buttons[0])}</span>
            <span className="xh-plus">+</span>
            <span className="xh-key">{buttonName(hotkey.buttons[1])}</span>
          </div>
        </>
      ) : (
        <div className="xh-hint">Nenhuma combinação gravada. Toque em "Gravar combinação".</div>
      )}
      {message && !capturing && <div className="xh-warn">{message}</div>}
      {hasCombo && hotkey.enabled && !capturing && <div className="xh-hint xh-diag">{readingNote(hotkey)}</div>}
      {hasCombo && hotkey.enabled && !capturing && hotkey.denied > 0 && (
        <div className="xh-warn">Sem permissão para ler {hotkey.denied} controle(s).</div>
      )}
    </div>
  );
}
