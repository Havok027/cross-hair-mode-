// Estilos do painel. As classes "gpfocus" são aplicadas pelo Steam ao item
// que está com o foco do controle.
export const STYLES = `
@keyframes xh-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.8); } }
@keyframes xh-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,80,80,0.0); } 50% { box-shadow: 0 0 14px 2px rgba(255,80,80,0.45); } }
@keyframes xh-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }

.xh-hero { width: 100%; }
.xh-stage {
  position: relative; display: flex; align-items: center; justify-content: center;
  height: 132px; width: 100%; border-radius: 18px; overflow: hidden; box-sizing: border-box;
  background-color: #11142a;
  background-image:
    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
    radial-gradient(circle at 50% 30%, #3a4778 0%, #181b2e 62%, #0d0f1a 100%);
  background-size: 22px 22px, 22px 22px, 100% 100%;
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: inset 0 0 34px rgba(0,0,0,0.55), 0 8px 22px rgba(0,0,0,0.4);
}
.xh-stage::after {
  content: ""; position: absolute; left: 0; right: 0; top: 0; height: 3px;
  background: linear-gradient(90deg, #1a9fff, #9b5cff, #ff007b, #1a9fff);
  background-size: 200% 100%; animation: xh-shimmer 6s linear infinite; opacity: 0.85;
}
.xh-guide-h, .xh-guide-v { position: absolute; background: rgba(255,255,255,0.10); }
.xh-guide-h { left: 0; right: 0; top: 50%; height: 1px; }
.xh-guide-v { top: 0; bottom: 0; left: 50%; width: 1px; }
.xh-preview-text {
  position: relative; font-family: monospace; white-space: pre; text-align: center; line-height: 1.15;
  transition: opacity 0.15s;
}
.xh-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; align-items: center; }
.xh-chip, .xh-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 3px 11px; border-radius: 999px;
  font-size: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
}
.xh-pill.xh-on { background: rgba(60,200,120,0.22); border-color: rgba(60,200,120,0.75); }
.xh-pill.xh-on::before {
  content: ""; width: 7px; height: 7px; border-radius: 50%; background: #3cc878; animation: xh-pulse 1.8s ease-in-out infinite;
}
.xh-pill.xh-blue { background: rgba(26,159,255,0.22); border-color: rgba(26,159,255,0.65); }
.xh-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

.xh-swatches { display: flex; flex-wrap: wrap; gap: 12px; padding: 6px 2px; }
.xh-swatch {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 50%; box-sizing: border-box;
  border: 3px solid rgba(255,255,255,0.20); transition: transform 0.12s, border-color 0.12s, box-shadow 0.12s;
}
.xh-swatch.xh-active { border-color: #ffffff; }
.xh-swatch.gpfocus { transform: scale(1.2); box-shadow: 0 0 0 3px #1a9fff; }

.xh-sizes { display: flex; gap: 6px; width: 100%; }
.xh-size {
  flex: 1; display: flex; align-items: center; justify-content: center; height: 36px;
  border-radius: 12px; font-size: 12px; background: rgba(255,255,255,0.08);
  border: 2px solid transparent; transition: background 0.12s, transform 0.12s, border-color 0.12s;
}
.xh-size.xh-active { background: linear-gradient(135deg, rgba(26,159,255,0.40), rgba(155,92,255,0.30)); border-color: #1a9fff; }
.xh-size.gpfocus { background: rgba(255,255,255,0.22); transform: scale(1.07); }

.xh-card {
  position: relative; width: 100%; box-sizing: border-box; padding: 12px 14px 12px 18px; border-radius: 14px; overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.13);
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
}
.xh-card::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(180deg, #1a9fff, #9b5cff);
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
