// Atalho de botões do controle (liga/desliga a mira): lado da interface.
//
// Modelo validado no projeto Steamcord (Necrosiak, BSD-3-Clause,
// https://github.com/Necrosiak/Steamcord):
//   * GRAVAR: a interface do Steam recebe os botões do controle enquanto o menu
//     está aberto (SteamClient.Input). A combinação fica salva como IDs de
//     botão do Steam.
//   * USAR: a interface escuta o controle e liga/desliga a mira. Em jogo, alguns
//     builds do Steam não entregam botões à interface; por isso o backend também
//     lê o controle direto. Quando o backend cobre a combinação, a interface se
//     cala para não alternar duas vezes.
import { addEventListener, removeEventListener } from "@decky/api";
import { getState, hotkeyToggle } from "./api";
import type { HotkeyState } from "./api";

// Nomes do enum de botões do Steam (extraídos do bundle do Steam pelo Steamcord).
// Os não listados aparecem como "BTN<n>".
const BUTTON_NAMES: Record<number, string> = {
  0: "A",
  1: "B",
  2: "X",
  3: "Y",
  4: "D-Cima",
  5: "D-Direita",
  6: "D-Baixo",
  7: "D-Esquerda",
  20: "D-Cima",
  21: "D-Baixo",
  22: "D-Esquerda",
  23: "D-Direita",
  8: "Menu",
  9: "View",
  28: "LT",
  29: "RT",
  30: "LB",
  31: "RB",
  32: "L5",
  33: "R5",
  34: "Guia",
  35: "Select",
  36: "Start",
  37: "L-Pad",
  39: "R-Pad",
  44: "L4",
  45: "R4",
};

export function buttonName(id: number): string {
  return BUTTON_NAMES[id] ?? "BTN" + id;
}

export type CaptureResult =
  | { ok: true; buttons: [number, number] }
  | { ok: false; reason: "count" | "timeout" | "cancel" };

interface CaptureSession {
  acc: Set<number>; // botões apertados durante a gravação
  preHeld: Set<number>; // já apertados ao começar (o "A" que tocou em Gravar)
  startedAt: number;
  finish: (result: CaptureResult) => void;
}

// O "A" que toca em "Gravar" gera os eventos de apertar/soltar DEPOIS que a
// gravação começa. Sem esta folga, ele entraria na combinação sozinho.
const CAPTURE_GRACE_MS = 250;

const held = new Set<number>(); // botões apertados agora
let cfg = { enabled: false, buttons: [] as number[], holdMs: 0 };
let backendCovers = false; // o backend já lê esta combinação em jogo
let comboActive = false;
let holdTimer: number | undefined;
let capture: CaptureSession | null = null;
let inputReg: any = null;
let coveredListener: any = null;
let resumeTimer: number | undefined;

function fire() {
  hotkeyToggle().catch((error) => console.warn("[Crosshair] falha ao alternar a mira:", error));
}

function evaluate() {
  const active = cfg.enabled && cfg.buttons.length === 2 && cfg.buttons.every((b) => held.has(b));
  if (active && !comboActive) {
    comboActive = true;
    if (!backendCovers) {
      holdTimer = window.setTimeout(() => {
        holdTimer = undefined;
        if (comboActive && !backendCovers) fire();
      }, cfg.holdMs);
    }
  } else if (!active && comboActive) {
    comboActive = false;
    if (holdTimer !== undefined) {
      window.clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  }
}

// Atualiza a configuração vinda do backend (chamado ao abrir o painel e a cada mudança)
export function applyHotkeyState(state: HotkeyState) {
  cfg = { enabled: state.enabled, buttons: state.buttons, holdMs: state.hold_ms };
  backendCovers = state.covered;
  evaluate();
}

function onButton(button: number, down: boolean) {
  if (down) held.add(button);
  else held.delete(button);

  const session = capture;
  if (session) {
    if (down) {
      if (Date.now() - session.startedAt < CAPTURE_GRACE_MS || session.preHeld.has(button)) {
        session.preHeld.add(button);
      } else {
        session.acc.add(button);
      }
    } else {
      session.preHeld.delete(button);
      // a combinação vale quando todos os botões foram soltos
      if (session.acc.size > 0 && held.size === 0) {
        const buttons = Array.from(session.acc).sort((a, b) => a - b);
        if (buttons.length === 2) {
          session.finish({ ok: true, buttons: [buttons[0], buttons[1]] });
        } else if (buttons.length > 2) {
          session.finish({ ok: false, reason: "count" });
        } else {
          session.acc.clear(); // só 1 botão: continua esperando até o tempo acabar
        }
      }
    }
    return;
  }
  evaluate();
}

// Grava uma combinação de exatamente 2 botões (a interface precisa estar aberta)
export function captureButtons(timeoutMs = 12000): { promise: Promise<CaptureResult>; cancel: () => void } {
  const ref: { session: CaptureSession | null } = { session: null };
  let timer: number | undefined;
  let settled = false;

  const promise = new Promise<CaptureResult>((resolve) => {
    const finish = (result: CaptureResult) => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      if (capture === ref.session) capture = null;
      resolve(result);
    };
    ref.session = { acc: new Set<number>(), preHeld: new Set<number>(held), startedAt: Date.now(), finish };
    capture = ref.session;
    if (!inputReg) registerControllerListener();
    timer = window.setTimeout(() => finish({ ok: false, reason: "timeout" }), timeoutMs);
  });

  return { promise, cancel: () => ref.session?.finish({ ok: false, reason: "cancel" }) };
}

function unregisterController() {
  if (!inputReg) return;
  try {
    if (typeof inputReg === "function") inputReg();
    else if (typeof inputReg.unregister === "function") inputReg.unregister();
  } catch (error) {
    console.warn("[Crosshair] falha ao remover o ouvinte do controle:", error);
  }
  inputReg = null;
}

// A API de mensagens do controle mudou entre builds do Steam:
//  * builds antigos: callback([{ nA: id do botão, bS: apertado }])
//  * builds novos: callback(controllerIdx, buttonId, apertado, ...)
// Tratamos as duas formas; RegisterForControllerStateChanges é o último recurso.
function registerControllerListener() {
  unregisterController();
  const input = (window as any).SteamClient?.Input;
  try {
    if (typeof input?.RegisterForControllerInputMessages === "function") {
      inputReg = input.RegisterForControllerInputMessages((...args: any[]) => {
        try {
          const first = args[0];
          if (Array.isArray(first)) {
            for (const event of first) {
              if (typeof event?.nA === "number") onButton(event.nA, !!event.bS);
            }
          } else if (typeof args[1] === "number") {
            onButton(args[1], !!args[2]);
          }
        } catch (error) {
          console.warn("[Crosshair] falha ao tratar um botão:", error);
        }
      });
    } else if (typeof input?.RegisterForControllerStateChanges === "function") {
      inputReg = input.RegisterForControllerStateChanges((changes: any[]) => {
        try {
          const next = new Set<number>();
          for (const change of changes) {
            const low = change.ulButtons >>> 0;
            const high = change.ulUpperButtons >>> 0;
            for (let bit = 0; bit < 32; bit++) {
              if (low & (1 << bit)) next.add(bit);
              if (high & (1 << bit)) next.add(bit + 32);
            }
          }
          for (const id of Array.from(held)) if (!next.has(id)) onButton(id, false);
          for (const id of Array.from(next)) if (!held.has(id)) onButton(id, true);
        } catch (error) {
          console.warn("[Crosshair] falha ao tratar o estado do controle:", error);
        }
      });
    } else {
      console.warn("[Crosshair] nenhuma API de entrada do controle disponível");
    }
  } catch (error) {
    console.warn("[Crosshair] falha ao registrar o ouvinte do controle:", error);
  }
}

// O fluxo de mensagens do controle PARA depois de suspender o aparelho. Sem API
// de "retomada", detectamos o salto do relógio (um intervalo de 10 s que demora
// muito mais) e registramos o ouvinte de novo.
const RESUME_TICK_MS = 10000;
const RESUME_GAP_MS = 30000;

function watchForResume() {
  let lastTick = Date.now();
  resumeTimer = window.setInterval(() => {
    const now = Date.now();
    const gap = now - lastTick;
    lastTick = now;
    if (gap < RESUME_GAP_MS) return;
    // botões "apertados" antes da suspensão não estão mais: recomeça limpo
    held.clear();
    comboActive = false;
    if (holdTimer !== undefined) {
      window.clearTimeout(holdTimer);
      holdTimer = undefined;
    }
    registerControllerListener();
  }, RESUME_TICK_MS);
}

export function initHotkey() {
  getState()
    .then((state) => applyHotkeyState(state.hotkey))
    .catch((error) => console.warn("[Crosshair] falha ao ler o atalho:", error));
  try {
    coveredListener = (addEventListener as any)("hotkey_covered", (value: boolean) => {
      backendCovers = !!value;
      evaluate();
    });
  } catch (error) {
    console.warn("[Crosshair] falha ao ouvir o aviso do backend:", error);
  }
  registerControllerListener();
  watchForResume();
}

export function disposeHotkey() {
  unregisterController();
  if (resumeTimer !== undefined) {
    window.clearInterval(resumeTimer);
    resumeTimer = undefined;
  }
  if (holdTimer !== undefined) {
    window.clearTimeout(holdTimer);
    holdTimer = undefined;
  }
  if (coveredListener) {
    try {
      (removeEventListener as any)("hotkey_covered", coveredListener);
    } catch (error) {
      console.warn("[Crosshair] falha ao remover o aviso do backend:", error);
    }
    coveredListener = null;
  }
  held.clear();
  comboActive = false;
  capture = null;
}
