import { ConfirmModal, DialogButton, Focusable, PanelSection, PanelSectionRow, TextField } from "@decky/ui";
import { useState } from "react";
import type { ReactNode } from "react";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import type { HotkeyState, ProfileInfo, Settings } from "./api";
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

// Seção que pode ser recolhida pela barra com seta (como no Mako). A escolha fica salva.
export function FoldSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const [folded, setFolded] = useState<boolean>(() => {
    try { return localStorage.getItem("crosshair-fold-" + id) === "1"; } catch { return false; }
  });
  const toggle = () => {
    const next = !folded;
    setFolded(next);
    try { localStorage.setItem("crosshair-fold-" + id, next ? "1" : "0"); } catch { /* Storage is optional. */ }
  };
  return (
    <PanelSection>
      <PanelSectionRow><div className="xh-section-title">{title}</div></PanelSectionRow>
      <PanelSectionRow>
        <DialogButton className="xh-fold" onClick={toggle} aria-expanded={!folded}>
          {folded ? <FaChevronDown /> : <FaChevronUp />}
        </DialogButton>
      </PanelSectionRow>
      {!folded && children}
    </PanelSection>
  );
}

// Tabela de resumo (no estilo do Mako): cabeçalho com o estado e linhas de rótulo e valor
function InfoTable(props: { head: string; on: boolean; rows: { label: string; value: ReactNode }[] }) {
  return (
    <div className="xh-table">
      <div className={"xh-table-head" + (props.on ? " xh-on" : "")}>
        <span className="xh-state-dot" />
        <span>{props.head}</span>
      </div>
      {props.rows.map((row) => (
        <div className="xh-trow" key={row.label}><span>{row.label}</span><b>{row.value}</b></div>
      ))}
    </div>
  );
}

function ColorValue({ hex }: { hex: string }) {
  return <><span className="xh-dot xh-tdot" style={{ background: "#" + hex }} />#{hex}</>;
}

// Aba Aparência: como a mira está agora (modelo, tamanho, cor, tela e posição final)
export function StatusTable(props: {
  settings: Settings;
  modelLabel: string;
  resolutionLabel: string;
  offsetX: number;
  offsetY: number;
}) {
  const t = useTranslation();
  const { settings } = props;
  return (
    <InfoTable
      head={settings.enabled ? t("Crosshair ativo") : t("Crosshair desligado")}
      on={settings.enabled}
      rows={[
        { label: t("Modelo"), value: props.modelLabel },
        { label: t("Tamanho"), value: settings.size + "%" },
        { label: t("Cor"), value: <ColorValue hex={settings.color} /> },
        { label: t("Resolução"), value: props.resolutionLabel },
        { label: t("Posição"), value: props.offsetX + ", " + props.offsetY },
      ]}
    />
  );
}

// Aba Perfis: o que está gravado no perfil escolhido e se ele bate com o ajuste atual
export function ProfileTable(props: {
  profile: ProfileInfo;
  settings: Settings;
  modelLabel: string;
  gameOpen: boolean;
}) {
  const t = useTranslation();
  const { profile, settings, gameOpen } = props;
  const same =
    profile.enabled === settings.enabled &&
    profile.model === settings.model &&
    profile.size === settings.size &&
    profile.color.toUpperCase() === settings.color.toUpperCase() &&
    profile.nudge_x === settings.nudge_x &&
    profile.nudge_y === settings.nudge_y;
  return (
    <InfoTable
      head={profile.name + (gameOpen ? " · " + t("Jogo aberto") : "")}
      on={gameOpen}
      rows={[
        { label: t("Modelo"), value: props.modelLabel },
        { label: t("Tamanho"), value: profile.size + "%" },
        { label: t("Cor"), value: <ColorValue hex={profile.color} /> },
        { label: t("Posição"), value: profile.nudge_x + ", " + profile.nudge_y },
        { label: t("Mira ao aplicar"), value: profile.enabled ? t("Ativo") : t("Desligado") },
        { label: t("Aplicação automática"), value: settings.auto_apply ? t("Ativo") : t("Desligado") },
        { label: t("Situação"), value: same ? t("Igual ao ajuste atual") : t("Diferente do ajuste atual") },
      ]}
    />
  );
}

const LANGUAGE_NAMES = { pt: "Português", en: "English", es: "Español" };

// Aba Config.: idioma e atalho de botões num relance
export function ShortcutTable(props: { settings: Settings; hotkey: HotkeyState }) {
  const t = useTranslation();
  const { settings, hotkey } = props;
  const hasCombo = hotkey.buttons.length === 2;
  const combo = hasCombo ? buttonName(hotkey.buttons[0], t) + " + " + buttonName(hotkey.buttons[1], t) : t("Sem combinação");
  const on = hasCombo && hotkey.enabled;
  return (
    <InfoTable
      head={on ? t("Atalho ativo") : t("Atalho desligado")}
      on={on}
      rows={[
        { label: t("Idioma"), value: LANGUAGE_NAMES[settings.language] },
        { label: t("Combinação"), value: combo },
        { label: t("Tempo segurando"), value: hotkey.hold_ms + " ms" },
        { label: t("Leitura em jogo"), value: hotkey.running ? t("Ativa") : t("Inativa") },
      ]}
    />
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
