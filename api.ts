import { callable } from "@decky/api";

// ---------------------------------------------------------------------------
// Tipos compartilhados com o backend (main.py)
// ---------------------------------------------------------------------------
export interface Settings {
  language: "pt" | "en" | "es";
  enabled: boolean;
  model: string;
  resolution: string;
  color: string; // RRGGBB, sem "#"
  size: number; // porcentagem (50 a 300)
  nudge_x: number;
  nudge_y: number;
  comp_x: number; // compensação de escala (calibração)
  comp_y: number;
  auto_apply: boolean;
}

export interface ModelInfo {
  id: string;
  label: string;
  lines: string[];
}

// Estado do atalho de botões (liga/desliga a mira)
export interface HotkeyState {
  enabled: boolean;
  buttons: number[]; // IDs de botão do Steam (2 botões) ou vazio
  hold_ms: number; // quanto tempo segurar (ms)
  running: boolean; // o backend está lendo o controle em jogo
  devices: number; // controles que o backend está lendo
  denied: number; // controles sem permissão de leitura
  covered: boolean; // o backend cobre esta combinação (a interface se cala)
  supported: boolean; // o backend sabe ler os botões desta combinação em jogo
  last_seen: number[]; // último grupo de botões que o backend leu em jogo (IDs do Steam)
  last_seen_age: number | null; // há quantos segundos
}

export interface PluginState {
  settings: Settings;
  models: ModelInfo[];
  resolutions: { id: string; label: string }[];
  profiles: { appid: string; name: string }[];
  hotkey: HotkeyState;
  offset_x: number;
  offset_y: number;
}

export interface GameInfo {
  appid: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Chamadas ao backend
// ---------------------------------------------------------------------------
export const getState = callable<[], PluginState>("get_state");
export const updateSettings = callable<[Record<string, unknown>], PluginState>("update_settings");
export const resetNudge = callable<[], PluginState>("reset_nudge");
export const resetComp = callable<[], PluginState>("reset_comp");
export const saveProfile = callable<[string, string], PluginState>("save_profile");
export const deleteProfile = callable<[string], PluginState>("delete_profile");
export const renameProfile = callable<[string, string], PluginState>("rename_profile");
export const gameStarted = callable<[string], PluginState>("game_started");
export const hotkeyToggle = callable<[string], PluginState>("hotkey_toggle");
export const setHotkey = callable<[number[]], PluginState>("set_hotkey");
export const clearHotkey = callable<[], PluginState>("clear_hotkey");
