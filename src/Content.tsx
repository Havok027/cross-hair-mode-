import {
  ButtonItem,
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  SliderField,
  ToggleField,
} from "@decky/ui";
import { useEffect, useRef, useState } from "react";
import { FaGamepad } from "react-icons/fa";
import {
  clearHotkey,
  deleteProfile,
  getState,
  resetComp,
  resetNudge,
  saveProfile,
  setHotkey,
  updateSettings,
} from "./api";
import type { GameInfo, PluginState, Settings } from "./api";
import { ColorStrip, HotkeyCard, SettingsSection, SizeChips, StatusChips } from "./components";
import { applyHotkeyState, captureButtons } from "./hotkey";
import { LanguageContext, modelLabel, translator } from "./i18n";
import { TabbedSettings } from "./SettingsTabs";
import { STYLES } from "./styles";
import { COLORS, getRunningGame, hexToRgb, rgbToHex } from "./utils";

const CAPTURE_SECONDS = 12;

export function Content() {
  const [state, setState] = useState<PluginState | null>(null);
  const [status, setStatus] = useState("");
  const [game] = useState<GameInfo | null>(() => getRunningGame());
  const [customColor, setCustomColor] = useState(false);
  const [calibrate, setCalibrate] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [captureMessage, setCaptureMessage] = useState("");
  const captureRef = useRef<{ cancel: () => void } | null>(null);

  const t = translator(state?.settings.language ?? "pt");

  // Junta alterações rápidas (sliders) e envia ao backend de uma vez
  const pending = useRef<Record<string, unknown>>({});
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    getState()
      .then(setState)
      .catch((error) => {
        console.error(error);
        setStatus(t("Falha ao carregar: ") + String(error));
      });
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
      // Closing the QAM must not discard the last language/slider change.
      if (Object.keys(pending.current).length > 0) {
        const patch = pending.current;
        pending.current = {};
        updateSettings(patch).catch(console.error);
      }
    };
  }, []);

  const run = async (action: () => Promise<PluginState>, okMessage: string) => {
    try {
      setState(await action());
      setStatus(okMessage);
    } catch (error) {
      console.error(error);
      setStatus(t("Falhou: ") + String(error));
    }
  };

  // Mantém o ouvinte global do atalho em dia com o que está salvo no backend
  useEffect(() => {
    if (state) applyHotkeyState(state.hotkey);
  }, [state]);

  // Contagem regressiva da gravação; ao sair do painel, cancela a gravação
  useEffect(() => {
    if (!capturing) return undefined;
    const id = window.setInterval(() => setSecondsLeft((left) => Math.max(0, left - 1)), 1000);
    return () => window.clearInterval(id);
  }, [capturing]);
  useEffect(
    () => () => {
      captureRef.current?.cancel();
    },
    [],
  );

  // Grava a combinação pela interface (o Steam entrega os botões com o menu aberto)
  const toggleCapture = async () => {
    if (captureRef.current) {
      captureRef.current.cancel();
      return;
    }
    setCaptureMessage("");
    setSecondsLeft(CAPTURE_SECONDS);
    setCapturing(true);
    const handle = captureButtons(CAPTURE_SECONDS * 1000);
    captureRef.current = handle;
    const result = await handle.promise;
    captureRef.current = null;
    setCapturing(false);
    if (result.ok) {
      await run(() => setHotkey(result.buttons), t("Combinação gravada"));
    } else if (result.reason === "count") {
      setCaptureMessage(t("Aperte exatamente 2 botões juntos. Tente de novo."));
    } else if (result.reason === "timeout") {
      setCaptureMessage(t("Tempo esgotado. Nenhuma combinação foi gravada."));
    }
  };

  const queue = (patch: Record<string, unknown>) => {
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
        setStatus(t("Falha ao aplicar: ") + String(error));
      }
    }, 150);
  };

  const patchSettings = (patch: Partial<Settings>) => {
    setState((prev) => (prev ? { ...prev, settings: { ...prev.settings, ...patch } } : prev));
    queue(patch);
  };

  const patchHotkey = (patch: { hotkey_enabled?: boolean; hotkey_hold?: number }) => {
    setState((prev) =>
      prev
        ? {
          ...prev,
          hotkey: {
            ...prev.hotkey,
            ...(patch.hotkey_enabled !== undefined ? { enabled: patch.hotkey_enabled } : {}),
            ...(patch.hotkey_hold !== undefined ? { hold_ms: patch.hotkey_hold } : {}),
          },
        }
        : prev,
    );
    queue(patch);
  };

  if (!state) {
    return (
      <PanelSection title="Crosshair">
        <PanelSectionRow>
          <div className="xh-hint">{status || t("Carregando...")}</div>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const { settings, models, resolutions, profiles, hotkey } = state;
  const currentModel = models.find((m) => m.id === settings.model) ?? models[0];
  const [r, g, b] = hexToRgb(settings.color);
  const hasProfile = game !== null && profiles.some((p) => p.appid === game.appid);
  const colorIndex = Math.max(
    0,
    COLORS.findIndex((c) => c.hex === settings.color),
  );

  return (
    <LanguageContext.Provider value={settings.language}>
      <div className="xh-plugin">
        <style>{STYLES}</style>

        <TabbedSettings capturing={capturing} header={
          <PanelSection title="Crosshair">
            <PanelSectionRow>
              <DropdownItem
                label={t("Idioma")}
                rgOptions={[{ data: "pt", label: "Português" }, { data: "en", label: "English" }, { data: "es", label: "Español" }]}
                selectedOption={settings.language}
                onChange={(option: { data: Settings["language"] }) => patchSettings({ language: option.data })}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <StatusChips settings={settings} modelLabel={modelLabel(currentModel.id, t)} />
            </PanelSectionRow>
            <PanelSectionRow>
              <ToggleField
                label={t("Mostrar crosshair")}
                description={t("Substitui o overlay de desempenho (MangoHud).")}
                checked={settings.enabled}
                onChange={(value: boolean) => patchSettings({ enabled: value })}
              />
            </PanelSectionRow>
          </PanelSection>
        }>{(tab) => (<>
          {tab === "appearance" && (
            <SettingsSection title={t("Aparência")}>
              <PanelSectionRow>
                <DropdownItem
                  label={t("Modelo")}
                  rgOptions={models.map((m) => ({ data: m.id, label: modelLabel(m.id, t) }))}
                  selectedOption={settings.model}
                  onChange={(option: { data: string }) => patchSettings({ model: option.data })}
                />
              </PanelSectionRow>
              <PanelSectionRow>
                <ColorStrip value={settings.color} onSelect={(hex) => patchSettings({ color: hex })} />
              </PanelSectionRow>
              <PanelSectionRow>
                <SliderField
                  label={t("Cor")}
                  value={colorIndex}
                  min={0}
                  max={COLORS.length - 1}
                  step={1}
                  onChange={(index: number) => patchSettings({ color: COLORS[index].hex })}
                />
              </PanelSectionRow>
              <PanelSectionRow>
                <ToggleField
                  label={t("Cor personalizada (RGB)")}
                  checked={customColor}
                  onChange={(value: boolean) => setCustomColor(value)}
                />
              </PanelSectionRow>
              {customColor && (
                <>
                  <PanelSectionRow>
                    <SliderField
                      label={t("Vermelho")}
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
                      label={t("Verde")}
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
                      label={t("Azul")}
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
                <SizeChips value={settings.size} onSelect={(size) => patchSettings({ size })} />
              </PanelSectionRow>
              <PanelSectionRow>
                <SliderField
                  label={t("Tamanho")}
                  value={settings.size}
                  min={50}
                  max={300}
                  step={10}
                  showValue
                  valueSuffix="%"
                  onChange={(v: number) => patchSettings({ size: v })}
                />
              </PanelSectionRow>
            </SettingsSection>
          )}

          {tab === "display" && (
            <SettingsSection title={t("Tela e posição")}>
              <PanelSectionRow>
                <DropdownItem
                  label={t("Resolução da tela")}
                  rgOptions={resolutions.map((res) => ({ data: res.id, label: res.label.replace("Monitor externo", t("Monitor externo")) }))}
                  selectedOption={settings.resolution}
                  onChange={(option: { data: string }) => patchSettings({ resolution: option.data })}
                />
              </PanelSectionRow>
              <PanelSectionRow>
                <SliderField
                  label={t("Horizontal (X)")}
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
                  label={t("Vertical (Y)")}
                  value={settings.nudge_y}
                  min={-200}
                  max={200}
                  step={1}
                  showValue
                  onChange={(v: number) => patchSettings({ nudge_y: v })}
                />
              </PanelSectionRow>
              <PanelSectionRow>
                <ButtonItem layout="below" onClick={() => run(() => resetNudge(), t("Ajuste zerado"))}>
                  {t("Zerar ajuste de posição")}
                </ButtonItem>
              </PanelSectionRow>
              <PanelSectionRow>
                <ToggleField
                  label={t("Calibrar escala (avançado)")}
                  description={t("A mira cresce a partir do centro. Use só se ela se mover ao mudar o tamanho.")}
                  checked={calibrate}
                  onChange={(value: boolean) => setCalibrate(value)}
                />
              </PanelSectionRow>
              {calibrate && (
                <>
                  <PanelSectionRow>
                    <div className="xh-card">
                      <div className="xh-card-title">{t("Como calibrar")}</div>
                      <div className="xh-hint">
                        {t("calibration_steps")}
                      </div>
                    </div>
                  </PanelSectionRow>
                  <PanelSectionRow>
                    <SliderField
                      label={t("Compensação horizontal")}
                      value={settings.comp_x}
                      min={-60}
                      max={60}
                      step={1}
                      showValue
                      onChange={(v: number) => patchSettings({ comp_x: v })}
                    />
                  </PanelSectionRow>
                  <PanelSectionRow>
                    <SliderField
                      label={t("Compensação vertical")}
                      value={settings.comp_y}
                      min={-60}
                      max={60}
                      step={1}
                      showValue
                      onChange={(v: number) => patchSettings({ comp_y: v })}
                    />
                  </PanelSectionRow>
                  <PanelSectionRow>
                    <ButtonItem layout="below" onClick={() => run(() => resetComp(), t("Compensação restaurada"))}>
                      {t("Restaurar compensação padrão")}
                    </ButtonItem>
                  </PanelSectionRow>
                </>
              )}
              <PanelSectionRow>
                <div className="xh-offsets">
                  {t("Posição final:")} {state.offset_x}, {state.offset_y}
                </div>
              </PanelSectionRow>
            </SettingsSection>
          )}

          {tab === "shortcut" && (
            <SettingsSection title={t("Atalho de botões")}>
              <PanelSectionRow>
                <ToggleField
                  label={t("Ligar/desligar com 2 botões")}
                  description={t("Segure os 2 botões gravados para mostrar ou esconder a mira.")}
                  checked={hotkey.enabled}
                  onChange={(value: boolean) => patchHotkey({ hotkey_enabled: value })}
                />
              </PanelSectionRow>
              <PanelSectionRow>
                <HotkeyCard
                  hotkey={hotkey}
                  capturing={capturing}
                  secondsLeft={secondsLeft}
                  message={captureMessage}
                />
              </PanelSectionRow>
              <PanelSectionRow>
                <ButtonItem layout="below" onClick={() => toggleCapture()}>
                  {capturing
                    ? t("Cancelar gravação")
                    : hotkey.buttons.length === 2
                      ? t("Gravar outra combinação")
                      : t("Gravar combinação")}
                </ButtonItem>
              </PanelSectionRow>
              {hotkey.buttons.length === 2 && (
                <PanelSectionRow>
                  <ButtonItem layout="below" onClick={() => run(() => clearHotkey(), t("Combinação removida"))}>
                    {t("Remover combinação")}
                  </ButtonItem>
                </PanelSectionRow>
              )}
              <PanelSectionRow>
                <SliderField
                  label={t("Tempo segurando")}
                  value={hotkey.hold_ms}
                  min={0}
                  max={1000}
                  step={50}
                  showValue
                  valueSuffix=" ms"
                  onChange={(v: number) => patchHotkey({ hotkey_hold: v })}
                />
              </PanelSectionRow>
            </SettingsSection>
          )}

          {tab === "profiles" && (
            <SettingsSection title={t("Perfil do jogo")}>
              <PanelSectionRow>
                <div className="xh-card">
                  {game ? (
                    <>
                      <div className="xh-card-title">
                        <FaGamepad /> {game.name}
                      </div>
                      <span className={"xh-pill" + (hasProfile ? " xh-blue" : "")}>
                        {hasProfile ? t("Perfil salvo") : t("Sem perfil")}
                      </span>
                    </>
                  ) : (
                    <div className="xh-hint">
                      {t("profile_hint")}
                    </div>
                  )}
                </div>
              </PanelSectionRow>
              {game && (
                <PanelSectionRow>
                  <ButtonItem
                    layout="below"
                    onClick={() => run(() => saveProfile(game.appid, game.name), t("Perfil salvo para ") + game.name)}
                  >
                    {hasProfile ? t("Atualizar perfil deste jogo") : t("Salvar perfil deste jogo")}
                  </ButtonItem>
                </PanelSectionRow>
              )}
              {game && hasProfile && (
                <PanelSectionRow>
                  <ButtonItem
                    layout="below"
                    onClick={() => run(() => deleteProfile(game.appid), t("Perfil removido de ") + game.name)}
                  >
                    {t("Excluir perfil deste jogo")}
                  </ButtonItem>
                </PanelSectionRow>
              )}
              <PanelSectionRow>
                <ToggleField
                  label={t("Aplicar perfil ao abrir o jogo")}
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
                      onClick={() => run(() => deleteProfile(p.appid), t("Perfil removido de ") + p.name)}
                    >
                      {t("Excluir perfil:")} {p.name}
                    </ButtonItem>
                  </PanelSectionRow>
                ))}
            </SettingsSection>
          )}

        </>)}</TabbedSettings>

        <PanelSection>
          {status && (
            <PanelSectionRow>
              <div className="xh-hint">{status}</div>
            </PanelSectionRow>
          )}
          <PanelSectionRow>
            <div className="xh-hint">
              {t("overlay_hint")}
            </div>
          </PanelSectionRow>
        </PanelSection>
        <footer className="xh-footer">{t("Criado por Havok")}</footer>
      </div>
    </LanguageContext.Provider>
  );
}
