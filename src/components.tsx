import { Focusable, PanelSection, PanelSectionRow } from "@decky/ui";
import type { ReactNode } from "react";
import { FaCheck } from "react-icons/fa";
import type { HotkeyState, Settings } from "./api";
import { buttonName } from "./hotkey";
import { useTranslation } from "./i18n";
import type { MessageKey, Translate } from "./i18n";
import { COLORS, SIZE_PRESETS } from "./utils";

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PanelSection>
      <PanelSectionRow><div className="xh-section-title">{title}</div></PanelSectionRow>
      {children}
    </PanelSection>
  );
}

// Resumo do estado da mira (sem prévia): ativa ou não, modelo, tamanho e cor
export function StatusChips(props: { settings: Settings; modelLabel: string }) {
  const t = useTranslation();
  const { settings, modelLabel } = props;
  return (
    <div className="xh-chips">
      <span className={"xh-pill" + (settings.enabled ? " xh-on" : "")}>
        {settings.enabled ? t("Ativo") : t("Desligado")}
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
  const t = useTranslation();
  const total = COLORS.length;
  const index = COLORS.findIndex((c) => c.hex === props.value);
  const center = index >= 0 ? index : 0;
  const slots = [-2, -1, 0, 1, 2].map((offset) => COLORS[(center + offset + total) % total]);
  const name = index >= 0 ? t(COLORS[index].name as MessageKey) : t("Personalizada");
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
function readingNote(hotkey: HotkeyState, t: Translate): string {
  if (hotkey.covered) return t("reading_both", { count: hotkey.devices });
  if (!hotkey.supported) return t("reading_unsupported");
  if (hotkey.devices === 0) return t("reading_search");
  return t("reading_missing");
}

// Cartão do atalho de botões: combinação gravada, gravação em andamento e situação da leitura
export function HotkeyCard(props: {
  hotkey: HotkeyState;
  capturing: boolean;
  secondsLeft: number;
  message: string;
}) {
  const t = useTranslation();
  const { hotkey, capturing, secondsLeft, message } = props;
  const hasCombo = hotkey.buttons.length === 2;
  return (
    <div className={"xh-card" + (capturing ? " xh-recording" : "")}>
      {capturing ? (
        <>
          <div className="xh-rec">
            <span className="xh-rec-dot" />
            {t("Gravando...")} {secondsLeft}s
          </div>
          <div className="xh-hint">
            {t("Aperte os 2 botões juntos e depois solte. Pode fazer com este menu aberto.")}
          </div>
        </>
      ) : hasCombo ? (
        <>
          <div className="xh-card-title">{t("Combinação")}</div>
          <div className="xh-keys">
            <span className="xh-key">{buttonName(hotkey.buttons[0], t)}</span>
            <span className="xh-plus">+</span>
            <span className="xh-key">{buttonName(hotkey.buttons[1], t)}</span>
          </div>
        </>
      ) : (
        <div className="xh-hint">{t("empty_shortcut")}</div>
      )}
      {message && !capturing && <div className="xh-warn">{message}</div>}
      {hasCombo && hotkey.enabled && !capturing && <div className="xh-hint xh-diag">{readingNote(hotkey, t)}</div>}
      {hasCombo && hotkey.enabled && !capturing && hotkey.running && (
        <div className="xh-hint xh-diag">
          {hotkey.last_seen.length > 0
            ? t("Último botão lido em jogo: ") +
              hotkey.last_seen.map((id) => buttonName(id, t) + "(" + id + ")").join(" + ") +
              (hotkey.last_seen_age !== null ? t("age_seconds", { count: hotkey.last_seen_age }) : "")
            : t("Nenhum botão lido em jogo ainda.")}
        </div>
      )}
      {hasCombo && hotkey.enabled && !capturing && hotkey.denied > 0 && (
        <div className="xh-warn">{t("permission_denied", { count: hotkey.denied })}</div>
      )}
    </div>
  );
}
