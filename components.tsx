import { ConfirmModal, Focusable, PanelSection, PanelSectionRow, TextField } from "@decky/ui";
import { useState } from "react";
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

// Estado atual em tabela (no estilo do Mako): ativa ou não, modelo, tamanho, cor, atalho e perfil
export function StatusTable(props: { settings: Settings; hotkey: HotkeyState; modelLabel: string; profile: string }) {
  const t = useTranslation();
  const { settings, hotkey, modelLabel, profile } = props;
  const combo = hotkey.buttons.length === 2
    ? buttonName(hotkey.buttons[0], t) + " + " + buttonName(hotkey.buttons[1], t)
    : "";
  const shortcut = !combo ? t("Sem combinação") : hotkey.enabled ? combo : combo + " · " + t("Desligado");
  return (
    <div className="xh-table">
      <div className={"xh-table-head" + (settings.enabled ? " xh-on" : "")}>
        <span className="xh-state-dot" />
        {settings.enabled ? t("Crosshair ativo") : t("Crosshair desligado")}
      </div>
      <div className="xh-trow"><span>{t("Modelo")}</span><b>{modelLabel}</b></div>
      <div className="xh-trow"><span>{t("Tamanho")}</span><b>{settings.size}%</b></div>
      <div className="xh-trow">
        <span>{t("Cor")}</span>
        <b><span className="xh-dot xh-tdot" style={{ background: "#" + settings.color }} />#{settings.color}</b>
      </div>
      <div className="xh-trow"><span>{t("Atalho")}</span><b>{shortcut}</b></div>
      <div className="xh-trow"><span>{t("Perfil")}</span><b>{profile}</b></div>
    </div>
  );
}

// Aviso flutuante do R1, como no Mako: mostra ou oculta as informações de apoio
export function DetailsBadge({ shown }: { shown: boolean }) {
  const t = useTranslation();
  return (
    <div className="xh-badge-anchor">
      <div className="xh-badge">
        <span className="xh-badge-key">R1</span>
        <span>{shown ? t("Ocultar informações") : t("Mostrar informações")}</span>
      </div>
    </div>
  );
}

// Janela para renomear um perfil. Fica fora da árvore do plugin, então recebe os textos já traduzidos.
export function RenameProfileModal(props: {
  initial: string;
  title: string;
  okText: string;
  cancelText: string;
  onSave: (name: string) => void;
  closeModal?: () => void;
}) {
  const [value, setValue] = useState(props.initial);
  return (
    <ConfirmModal
      strTitle={props.title}
      strOKButtonText={props.okText}
      strCancelButtonText={props.cancelText}
      onOK={() => {
        const name = value.trim();
        if (name) props.onSave(name);
      }}
      closeModal={props.closeModal}
    >
      <TextField value={value} onChange={(event) => setValue(event.target.value)} />
    </ConfirmModal>
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
  details: boolean;
}) {
  const t = useTranslation();
  const { hotkey, capturing, secondsLeft, message, details } = props;
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
      {details && hasCombo && hotkey.enabled && !capturing && <div className="xh-hint xh-diag">{readingNote(hotkey, t)}</div>}
      {details && hasCombo && hotkey.enabled && !capturing && hotkey.running && (
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
