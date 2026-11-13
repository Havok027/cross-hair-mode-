// Estilos do painel. As classes "gpfocus" são aplicadas pelo Steam ao item
// que está com o foco do controle.
export const STYLES = `
.xh-plugin { color: #edf8fb; }
.xh-section-title { width: 100%; margin: 8px 0 6px; padding-bottom: 8px; text-align: center; border-bottom: 4px solid #553878; font-size: 14px; font-weight: 600; }
.xh-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; width: 100%; padding: 4px 0; }
.xh-tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; min-width: 0; padding: 9px 1px 7px; border-radius: 6px; box-sizing: border-box;
  border: 1px solid rgba(77,170,190,0.28); border-bottom: 4px solid transparent;
  background: rgba(7,31,49,0.68); color: #aebfc5; cursor: pointer;
}
.xh-tab svg { display: block; flex: none; width: 20px; height: 20px; }
.xh-tab span { display: block; max-width: 100%; font-size: 10px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
.xh-tab { position: relative; }
.xh-tab.xh-selected { color: #ffffff; font-weight: 700; background: linear-gradient(180deg, #1b76c6, #124457); border-color: #83bff0; border-bottom: 4px solid #52d5e8; box-shadow: inset 0 0 0 1px rgba(131,191,240,0.55); }
.xh-tab.xh-selected::after { content: "✓"; position: absolute; top: 3px; right: 6px; font-size: 11px; line-height: 1; color: #52d5e8; }
.xh-tab.gpfocus, .xh-tab:focus-visible { outline: 3px solid #ffffff; outline-offset: 1px; filter: brightness(1.3); }
.xh-tab[aria-disabled="true"] { opacity: 0.5; }
.xh-table { width: 100%; box-sizing: border-box; border: 1px solid rgba(77,170,190,0.6); border-radius: 8px; background: rgba(7,31,49,0.68); overflow: hidden; }
.xh-table-head { display: flex; align-items: center; justify-content: flex-end; gap: 7px; text-align: right; padding: 7px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #8fb6c4; border-bottom: 1px solid rgba(77,170,190,0.4); }
.xh-table-head.xh-on { color: #5ee6a0; }
.xh-state-dot { width: 9px; height: 9px; border-radius: 50%; background: #6b7f88; flex: none; }
.xh-table-head.xh-on .xh-state-dot { background: #3ddc84; box-shadow: 0 0 6px #3ddc84; }
.xh-trow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 12px; font-size: 13px; border-bottom: 1px solid rgba(77,170,190,0.18); }
.xh-trow:last-child { border-bottom: 0; }
.xh-trow > span { color: #8fa5ad; flex: none; }
.xh-trow > b { color: #edf8fb; font-weight: 600; text-align: right; min-width: 0; overflow-wrap: anywhere; }
.xh-tdot { margin-right: 6px; vertical-align: -1px; }
.xh-plugin .xh-act { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-width: 0; padding: 10px 12px; color: #fff; border: 1px solid rgba(255,255,255,0.18); }
.xh-plugin .xh-act svg { flex: none; }
.xh-plugin .xh-act-create { background: linear-gradient(90deg, #1b76c6, #22a6c9) !important; }
.xh-plugin .xh-act-rename { background: linear-gradient(90deg, #17506f, #1d8fb0) !important; }
.xh-plugin .xh-act-delete { background: linear-gradient(90deg, #7d2540, #cf4068) !important; }
.xh-plugin .xh-act[disabled], .xh-plugin .xh-act:disabled { opacity: 0.4; }
.xh-plugin .xh-fold { display: flex; align-items: center; justify-content: center; width: 100%; min-width: 0; padding: 6px 12px; border-radius: 14px; border: 1px solid rgba(131,170,255,0.45); background: linear-gradient(90deg, #3a3ee6, #5a4cff) !important; color: #fff; }
.xh-plugin .xh-fold svg { width: 14px; height: 14px; }
.xh-plugin .xh-fold.xh-open { border-color: #83bff0; }
.xh-plugin .xh-fold.xh-closed { background: linear-gradient(90deg, #232a5a, #2d3270) !important; border-color: rgba(131,170,255,0.25); opacity: 0.85; }
.xh-plugin .xh-act.gpfocus, .xh-plugin .xh-fold.gpfocus, .xh-plugin button.gpfocus, .xh-plugin .DialogButton.gpfocus,
.xh-plugin .xh-act:focus-visible, .xh-plugin .xh-fold:focus-visible {
  outline: 3px solid #ffffff; outline-offset: 2px; filter: brightness(1.3);
  box-shadow: 0 0 0 3px #ffffff, 0 0 14px 3px rgba(82,213,232,0.8);
}
.xh-tab-hint { width: 100%; text-align: center; font-size: 10px; color: #a8bdc2; }
.xh-tab-panel { animation: xh-enter 150ms ease-out; }
@keyframes xh-enter { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
.xh-plugin button {
  color: #eefbfe; border: 1px solid rgba(65,158,178,0.62); border-radius: 4px;
  background: linear-gradient(135deg, #071f31, #0b5967); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}
.xh-plugin button:focus-visible { outline: 2px solid #52d5e8; outline-offset: 2px; }
.xh-footer { margin: 18px 16px 8px; padding: 14px 0; text-align: center; border-top: 1px solid rgba(77,170,190,0.28); color: #83bff0; font-size: 11px; }
@keyframes xh-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.8); } }
@keyframes xh-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,80,80,0.0); } 50% { box-shadow: 0 0 14px 2px rgba(255,80,80,0.45); } }

.xh-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; width: 100%; }
.xh-chip, .xh-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px;
  font-size: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
}
.xh-pill.xh-on { background: rgba(60,200,120,0.22); border-color: rgba(60,200,120,0.75); }
.xh-pill.xh-on::before {
  content: ""; width: 7px; height: 7px; border-radius: 50%; background: #3cc878; animation: xh-pulse 1.8s ease-in-out infinite;
}
.xh-pill.xh-blue { background: rgba(26,159,255,0.22); border-color: rgba(26,159,255,0.65); }
.xh-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

.xh-strip-wrap { width: 100%; padding: 4px 0 2px 0; }
.xh-strip { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; min-height: 54px; }
.xh-strip-swatch {
  display: flex; align-items: center; justify-content: center; box-sizing: border-box;
  width: 24px; height: 24px; border-radius: 50%; opacity: 0.5;
  border: 2px solid rgba(255,255,255,0.18); transition: all 0.15s;
}
.xh-strip-swatch.xh-near { width: 32px; height: 32px; opacity: 0.8; }
.xh-strip-swatch.xh-center { width: 48px; height: 48px; opacity: 1; border: 3px solid #ffffff; }
.xh-strip-name { text-align: center; font-size: 13px; font-weight: 600; margin-top: 6px; opacity: 0.9; }

.xh-sizes { display: flex; gap: 6px; width: 100%; }
.xh-size {
  flex: 1; display: flex; align-items: center; justify-content: center; height: 36px;
  border-radius: 6px; font-size: 12px; background: rgba(7,31,49,0.68);
  border: 2px solid transparent; transition: background 0.12s, transform 0.12s, border-color 0.12s;
}
.xh-size.xh-active { color: #ffffff; font-weight: 700; background: linear-gradient(135deg, #1b76c6, #22a6c9); border-color: #ffffff; }
.xh-size.xh-active::before { content: "✓"; margin-right: 4px; font-size: 11px; }
.xh-size.gpfocus { transform: scale(1.07); outline: 3px solid #ffffff; outline-offset: 1px; filter: brightness(1.3); }
.xh-size.gpfocus:not(.xh-active) { background: rgba(255,255,255,0.22); }

.xh-card {
  position: relative; width: 100%; box-sizing: border-box; padding: 12px 14px 12px 18px; border-radius: 8px; overflow: hidden;
  background: linear-gradient(135deg, rgba(7,31,49,0.68), rgba(8,55,68,0.38));
  border: 1px solid rgba(77,170,190,0.28);
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
}
.xh-card::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: #83bff0;
}
.xh-card.xh-recording { border-color: rgba(255,80,80,0.7); animation: xh-glow 1.6s ease-in-out infinite; }
.xh-card.xh-recording::before { background: linear-gradient(180deg, #ff5050, #ff9b50); }
.xh-card-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin-bottom: 8px; }

.xh-keys { display: flex; align-items: center; gap: 10px; margin-top: 2px; flex-wrap: wrap; }
.xh-key {
  display: inline-flex; align-items: center; justify-content: center; min-width: 40px; padding: 7px 14px;
  border-radius: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.5px;
  background: linear-gradient(180deg, #4a5578, #2c3452); color: #ffffff;
  border: 1px solid rgba(255,255,255,0.25); border-bottom: 4px solid #151a30;
  box-shadow: 0 3px 8px rgba(0,0,0,0.4);
}
.xh-plus { font-size: 18px; font-weight: 700; opacity: 0.7; }
.xh-rec { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; margin-bottom: 6px; color: #ff8080; }
.xh-rec-dot { width: 12px; height: 12px; border-radius: 50%; background: #ff4040; animation: xh-pulse 1s ease-in-out infinite; }
.xh-warn { margin-top: 8px; font-size: 12px; line-height: 1.4; color: #ffb454; }
.xh-diag { margin-top: 8px; }

.xh-hint { font-size: 12px; line-height: 1.45; opacity: 0.65; }
.xh-offsets { font-size: 12px; opacity: 0.75; text-align: center; width: 100%; }
`;
