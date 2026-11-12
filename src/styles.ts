// Estilos do painel. As classes "gpfocus" são aplicadas pelo Steam ao item
// que está com o foco do controle.
export const STYLES = `
.xh-plugin { color: #edf8fb; }
.xh-section-title { width: 100%; margin: 8px 0 6px; padding-bottom: 8px; text-align: center; border-bottom: 4px solid #553878; font-size: 14px; font-weight: 600; }
.xh-tabs { display: flex; gap: 5px; width: 100%; padding: 4px 0; }
.xh-tab {
  flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 7px; padding: 10px 2px; border-radius: 6px;
  border: 1px solid rgba(77,170,190,0.28); border-bottom: 3px solid transparent;
  background: rgba(7,31,49,0.68); color: #aebfc5; font-size: 10px; cursor: pointer;
}
.xh-tab svg { font-size: 17px; }
.xh-tab span { max-width: 100%; overflow-wrap: anywhere; text-align: center; }
.xh-tab.xh-selected { color: #edf8fb; background: #124457; border-bottom-color: #83bff0; }
.xh-tab.gpfocus, .xh-tab:focus-visible { outline: 2px solid #52d5e8; outline-offset: 1px; background: #145669; }
.xh-tab[aria-disabled="true"] { opacity: 0.5; }
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
.xh-size.xh-active { background: #124457; border-color: #83bff0; }
.xh-size.gpfocus { background: rgba(255,255,255,0.22); transform: scale(1.07); }

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
