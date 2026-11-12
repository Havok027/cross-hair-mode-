import { Router } from "@decky/ui";
import type { GameInfo } from "./api";

export const COLORS = [
  { name: "Rosa", hex: "FF007B" },
  { name: "Verde", hex: "00FF66" },
  { name: "Vermelho", hex: "FF2D2D" },
  { name: "Amarelo", hex: "FFE600" },
  { name: "Ciano", hex: "00E5FF" },
  { name: "Roxo", hex: "9B5CFF" },
  { name: "Laranja", hex: "FF8A00" },
  { name: "Branco", hex: "FFFFFF" },
];

export const SIZE_PRESETS = [50, 100, 150, 200, 300];

export function hexToRgb(hex: string): number[] {
  const n = parseInt(hex, 16);
  if (Number.isNaN(n)) return [255, 0, 123];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const p = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return (p(r) + p(g) + p(b)).toUpperCase();
}

// Jogo que está rodando agora (null se estiver só no menu)
export function getRunningGame(): GameInfo | null {
  try {
    const app = (Router as unknown as {
      MainRunningApp?: { appid: string | number; display_name?: string };
    }).MainRunningApp;
    if (app && app.appid) {
      return { appid: String(app.appid), name: app.display_name || String(app.appid) };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}
