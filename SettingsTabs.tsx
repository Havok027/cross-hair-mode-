import { Focusable, GamepadButton, PanelSection, PanelSectionRow } from "@decky/ui";
import { useRef, useState } from "react";
import type { ComponentProps, ComponentType, ReactNode, Ref } from "react";
import { FaBullseye, FaCog, FaLayerGroup } from "react-icons/fa";
import { useTranslation } from "./i18n";

const tabs = ["appearance", "profiles", "settings"] as const;
export type TabId = typeof tabs[number];
type NavigationHandle = { TakeFocus: () => boolean };
const TabFocus = Focusable as ComponentType<ComponentProps<typeof Focusable> & { navRef?: Ref<NavigationHandle> }>;

export function TabbedSettings({ children, capturing, header }: { children: (tab: TabId) => ReactNode; capturing: boolean; header?: (tab: TabId) => ReactNode }) {
  const t = useTranslation();
  const [active, setActive] = useState<TabId>(() => {
    try {
      const saved = localStorage.getItem("crosshair-active-tab");
      return tabs.find((id) => id === saved) ?? "appearance";
    } catch { return "appearance"; }
  });
  const navigation = useRef<Partial<Record<TabId, NavigationHandle | null>>>({});
  const select = (tab: TabId, focus = false) => {
    if (capturing) return;
    setActive(tab);
    try { localStorage.setItem("crosshair-active-tab", tab); } catch { /* Storage is optional. */ }
    if (focus) navigation.current[tab]?.TakeFocus();
  };
  const labels = [t("Aparência"), t("Perfis"), t("Config.")];
  const icons = [FaBullseye, FaLayerGroup, FaCog];
  return (
    <Focusable
      className="xh-settings"
      flow-children="column"
      onButtonDown={(event) => {
        if (capturing) return;
        const button = event.detail.button;
        if (button !== GamepadButton.BUMPER_LEFT && button !== GamepadButton.BUMPER_RIGHT) return;
        event.stopPropagation();
        event.preventDefault();
        if (event.detail.is_repeat) return;
        const direction = button === GamepadButton.BUMPER_LEFT ? -1 : 1;
        select(tabs[(tabs.indexOf(active) + direction + tabs.length) % tabs.length], true);
      }}
    >
      <PanelSection>
        <PanelSectionRow>
          <Focusable className="xh-tabs" flow-children="row" role="tablist" aria-label="Crosshair">
            {tabs.map((id, index) => {
              const Icon = icons[index];
              return (
                <TabFocus
                  key={id}
                  id={`xh-tab-${id}`}
                  navRef={(handle) => { navigation.current[id] = handle; }}
                  role="tab"
                  aria-selected={active === id}
                  aria-controls={`xh-panel-${id}`}
                  aria-disabled={capturing}
                  className={"xh-tab" + (active === id ? " xh-selected" : "")}
                  onActivate={() => select(id)}
                  onClick={() => select(id)}
                >
                  <Icon aria-hidden="true" /><span>{labels[index]}</span>
                </TabFocus>
              );
            })}
          </Focusable>
        </PanelSectionRow>
        <PanelSectionRow><div className="xh-tab-hint">{t("L1 / R1 · trocar guia")}</div></PanelSectionRow>
      </PanelSection>
      {header?.(active)}
      <div key={active} id={`xh-panel-${active}`} role="tabpanel" aria-labelledby={`xh-tab-${active}`} className="xh-tab-panel">
        {children(active)}
      </div>
    </Focusable>
  );
}
