import {
  ButtonItem,
  DropdownItem,
  Focusable,
  GamepadButton,
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
import { ColorStrip, HotkeyCard, SizeChips, StatusChips } from "./components";
import { applyHotkeyState, captureButtons } from "./hotkey";
import { STYLES } from "./styles";
import { LANGUAGES, translate, type Language } from "./i18n";
import { COLORS, getRunningGame, hexToRgb, rgbToHex } from "./utils";

const CAPTURE_SECONDS = 12;

export function Content() {
  const [state, setState] = useState<PluginState | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("crosshair-language");
    return saved === "en" || saved === "es" || saved === "pt-BR" ? saved : "pt-BR";
  });
  const [activeTab, setActiveTab] = useState(0);
  const tabNames = ["Crosshair", "Appearance", "Display & position", "Button shortcut", "Game profile"];
  const t = (value: string) => translate(language, value);
  const changeLanguage = (value: Language) => {
    setLanguage(value);
    localStorage.setItem("crosshair-language", value);
  };
  const [status, setStatus] = useState("");
  const [game] = useState<GameInfo | null>(() => getRunningGame());
  const [customColor, setCustomColor] = useState(false);
  const [calibrate, setCalibrate] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [captureMessage, setCaptureMessage] = useState("");
  const captureRef = useRef<{ cancel: () => void } | null>(null);

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
      await run(() => setHotkey(result.buttons), "Combinação gravada");
    } else if (result.reason === "count") {
      setCaptureMessage("Aperte exatamente 2 botões juntos. Tente de novo.");
    } else if (result.reason === "timeout") {
      setCaptureMessage("Tempo esgotado. Nenhuma combinação foi gravada.");
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
        setStatus("Falha ao aplicar: " + String(error));
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
          <div className="xh-hint">{status || "Carregando..."}</div>
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
    <>
      <style>{STYLES}</style>

      <PanelSection title="Settings">
        <PanelSectionRow>
          <DropdownItem
            label={t("Language")}
            rgOptions={LANGUAGES.map((item) => ({ data: item.data, label: item.label }))}
            selectedOption={language}
            onChange={(option: { data: Language }) => changeLanguage(option.data)}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <Focusable
            flow-children="row"
            onButtonDown={(event: any) => {
              const button = event.detail?.button;
              if (button === (GamepadButton as any).LB) {
                event.preventDefault();
                setActiveTab((tab) => (tab + tabNames.length - 1) % tabNames.length);
              } else if (button === (GamepadButton as any).RB) {
                event.preventDefault();
                setActiveTab((tab) => (tab + 1) % tabNames.length);
              }
            }}
            style={{ display: "flex", width: "100%", gap: "5px" }}
          >
            {tabNames.map((name, index) => (
              <Focusable
                key={name}
                onActivate={() => setActiveTab(index)}
                style={{
                  flex: 1, minWidth: 0, padding: "8px 3px", textAlign: "center",
                  borderRadius: "6px", fontSize: "10px",
                  background: activeTab === index ? "linear-gradient(135deg,#0a526b,#123b5b)" : "rgba(255,255,255,.07)",
                  border: activeTab === index ? "1px solid #52d5e8" : "1px solid rgba(255,255,255,.12)",
                  color: activeTab === index ? "#e7fbff" : "#b7c7ce",
                }}
              >
                {t(name)}
              </Focusable>
            ))}
          </Focusable>
        </PanelSectionRow>
      </PanelSection>

      {activeTab === 0 && <>
      <PanelSection title="Crosshair">
        <PanelSectionRow>
          <StatusChips settings={settings} modelLabel={currentModel.label} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Mostrar crosshair"
            description="Substitui o overlay de desempenho (MangoHud)."
            checked={settings.enabled}
            onChange={(value: boolean) => patchSettings({ enabled: value })}
          />
        </PanelSectionRow>
      </PanelSection>

      </>}
      {activeTab === 1 && <>
      <PanelSection title={t("Appearance")}>
        <PanelSectionRow>
          <DropdownItem
            label="Modelo"
            rgOptions={models.map((m) => ({ data: m.id, label: m.label }))}
            selectedOption={settings.model}
            onChange={(option: { data: string }) => patchSettings({ model: option.data })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ColorStrip value={settings.color} onSelect={(hex) => patchSettings({ color: hex })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            label="Cor"
            value={colorIndex}
            min={0}
            max={COLORS.length - 1}
            step={1}
            onChange={(index: number) => patchSettings({ color: COLORS[index].hex })}
          />
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
          <SizeChips value={settings.size} onSelect={(size) => patchSettings({ size })} />
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
            onChange={(v: number) => patchSettings({ size: v })}
          />
        </PanelSectionRow>
      </PanelSection>

      </>}
      {activeTab === 2 && <>
      <PanelSection title={t("Display & position")}>
        <PanelSectionRow>
          <DropdownItem
            label="Resolução da tela"
            rgOptions={resolutions.map((res) => ({ data: res.id, label: res.label }))}
            selectedOption={settings.resolution}
            onChange={(option: { data: string }) => patchSettings({ resolution: option.data })}
          />
        </PanelSectionRow>
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
          <ButtonItem layout="below" onClick={() => run(() => resetNudge(), "Ajuste zerado")}>
            Zerar ajuste de posição
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Calibrar escala (avançado)"
            description="A mira cresce a partir do centro. Use só se ela se mover ao mudar o tamanho."
            checked={calibrate}
            onChange={(value: boolean) => setCalibrate(value)}
          />
        </PanelSectionRow>
        {calibrate && (
          <>
            <PanelSectionRow>
              <div className="xh-card">
                <div className="xh-card-title">Como calibrar</div>
                <div className="xh-hint">
                  1) Deixe o tamanho em 100% e centralize a mira com Horizontal e Vertical. 2) Suba o tamanho
                  para 300%. 3) Se a mira saiu do centro, ajuste a compensação até ela voltar. Se ao crescer
                  ela sobe ou vai para a esquerda, aumente. Se desce ou vai para a direita, diminua. A
                  calibração vale para o modelo atual.
                </div>
              </div>
            </PanelSectionRow>
            <PanelSectionRow>
              <SliderField
                label="Compensação horizontal"
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
                label="Compensação vertical"
                value={settings.comp_y}
                min={-60}
                max={60}
                step={1}
                showValue
                onChange={(v: number) => patchSettings({ comp_y: v })}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={() => run(() => resetComp(), "Compensação restaurada")}>
                Restaurar compensação padrão
              </ButtonItem>
            </PanelSectionRow>
          </>
        )}
        <PanelSectionRow>
          <div className="xh-offsets">
            Posição final: {state.offset_x}, {state.offset_y}
          </div>
        </PanelSectionRow>
      </PanelSection>

      </>}
      {activeTab === 3 && <>
      <PanelSection title={t("Button shortcut")}>
        <PanelSectionRow>
          <ToggleField
            label="Ligar/desligar com 2 botões"
            description="Segure os 2 botões gravados para mostrar ou esconder a mira."
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
              ? "Cancelar gravação"
              : hotkey.buttons.length === 2
                ? "Gravar outra combinação"
                : "Gravar combinação"}
          </ButtonItem>
        </PanelSectionRow>
        {hotkey.buttons.length === 2 && (
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={() => run(() => clearHotkey(), "Combinação removida")}>
              Remover combinação
            </ButtonItem>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <SliderField
            label="Tempo segurando"
            value={hotkey.hold_ms}
            min={0}
            max={1000}
            step={50}
            showValue
            valueSuffix=" ms"
            onChange={(v: number) => patchHotkey({ hotkey_hold: v })}
          />
        </PanelSectionRow>
      </PanelSection>

      </>}
      {activeTab === 4 && <>
      <PanelSection title={t("Game profile")}>
        <PanelSectionRow>
          <div className="xh-card">
            {game ? (
              <>
                <div className="xh-card-title">
                  <FaGamepad /> {game.name}
                </div>
                <span className={"xh-pill" + (hasProfile ? " xh-blue" : "")}>
                  {hasProfile ? "Perfil salvo" : "Sem perfil"}
                </span>
              </>
            ) : (
              <div className="xh-hint">
                Abra este menu com um jogo rodando para salvar um perfil só para ele (modelo, cor, tamanho e
                posição).
              </div>
            )}
          </div>
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

      </>}
      <PanelSection>
        {status && (
          <PanelSectionRow>
            <div className="xh-hint">{status}</div>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <div className="xh-hint">
            {t("Created by Havok")} · O plugin usa o texto do MangoHud como mira, então não dá para ter o overlay de desempenho ao mesmo
            tempo. Para voltar o overlay, mude o nível de desempenho no menu rápido. Depois, ligue o crosshair
            de novo aqui.
          </div>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
}
