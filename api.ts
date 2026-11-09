import { callable } from "@decky/api";

// ---------------------------------------------------------------------------
// Tipos compartilhados com o backend (main.py)
// ---------------------------------------------------------------------------
export interface Settings {
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
  buttons: string[]; // nomes amigáveis, ex.: ["LB", "RB"]
  hold_ms: number; // quanto tempo segurar (ms)
  running: boolean; // monitor de controles ativo
  devices: number; // controles que estão sendo monitorados
  denied: number; // controles sem permissão de leitura
  learning: boolean; // gravando uma combinação
  learn_left: number; // segundos restantes da gravação
  message: string; // aviso da última gravação
  last_button: string; // último botão detectado
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
export const gameStarted = callable<[string], PluginState>("game_started");
export const startHotkeyLearning = callable<[], PluginState>("start_hotkey_learning");
export const cancelHotkeyLearning = callable<[], PluginState>("cancel_hotkey_learning");
export const clearHotkey = callable<[], PluginState>("clear_hotkey");
