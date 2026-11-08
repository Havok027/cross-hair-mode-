// Estilos do painel. As classes "gpfocus" são aplicadas pelo Steam ao item
// que está com o foco do controle.
export const STYLES = `
.xh-hero { width: 100%; }
.xh-stage {
  position: relative; display: flex; align-items: center; justify-content: center;
  height: 128px; width: 100%; border-radius: 18px; overflow: hidden;
  background: radial-gradient(circle at 50% 28%, #3a4778 0%, #181b2e 62%, #0d0f1a 100%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: inset 0 0 30px rgba(0,0,0,0.5), 0 6px 18px rgba(0,0,0,0.35);
}
.xh-guide-h, .xh-guide-v { position: absolute; background: rgba(255,255,255,0.08); }
.xh-guide-h { left: 0; right: 0; top: 50%; height: 1px; }
.xh-guide-v { top: 0; bottom: 0; left: 50%; width: 1px; }
.xh-preview-text {
  position: relative; font-family: monospace; white-space: pre; text-align: center; line-height: 1.15;
  text-shadow: 0 0 10px rgba(0,0,0,0.9); transition: opacity 0.15s;
}
.xh-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; align-items: center; }
.xh-chip, .xh-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px;
  font-size: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
}
.xh-pill.xh-on { background: rgba(60,200,120,0.22); border-color: rgba(60,200,120,0.7); }
.xh-pill.xh-blue { background: rgba(26,159,255,0.22); border-color: rgba(26,159,255,0.65); }
.xh-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.xh-swatches { display: flex; flex-wrap: wrap; gap: 12px; padding: 6px 2px; }
.xh-swatch {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 50%; box-sizing: border-box;
  border: 3px solid rgba(255,255,255,0.20); transition: transform 0.12s, border-color 0.12s;
}
.xh-swatch.xh-active { border-color: #ffffff; }
.xh-swatch.gpfocus { transform: scale(1.2); box-shadow: 0 0 0 3px #1a9fff; }
.xh-sizes { display: flex; gap: 6px; width: 100%; }
.xh-size {
  flex: 1; display: flex; align-items: center; justify-content: center; height: 34px;
  border-radius: 10px; font-size: 12px; background: rgba(255,255,255,0.08);
  border: 2px solid transparent; transition: background 0.12s, transform 0.12s;
}
.xh-size.xh-active { background: rgba(26,159,255,0.25); border-color: #1a9fff; }
.xh-size.gpfocus { background: rgba(255,255,255,0.20); transform: scale(1.06); }
.xh-card {
  width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.12);
}
.xh-card-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.xh-hint { font-size: 12px; line-height: 1.45; opacity: 0.62; }
.xh-offsets { font-size: 12px; opacity: 0.75; text-align: center; width: 100%; }
`;
