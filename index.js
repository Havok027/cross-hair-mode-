// Decky Loader will pass this api in, it's versioned to allow for backwards compatibility.
// @ts-ignore

// Prevents it from being duplicated in output.
const manifest = {"name":"Crosshair","author":"JSON Derulo","flags":[],"api_version":1,"publish":{"tags":["crosshair","aim","overlay","HUD"],"description":"Repurpose the performance overlay into a customizable crosshair.","image":"https://steamuserimages-a.akamaihd.net/ugc/25432209482234967/83EC67A8B25603F81A57F5C72715001021AC8484/"}};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
// Initialize
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
// Version 1 throws on version mismatch so we have to account for that here.
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const definePlugin = (fn) => {
    return (...args) => {
        // TODO: Maybe wrap this
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaCheck (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"},"child":[]}]})(props);
}function FaCrosshairs (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M500 224h-30.364C455.724 130.325 381.675 56.276 288 42.364V12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v30.364C130.325 56.276 56.276 130.325 42.364 224H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h30.364C56.276 381.675 130.325 455.724 224 469.636V500c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-30.364C381.675 455.724 455.724 381.675 469.636 288H500c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zM288 404.634V364c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40.634C165.826 392.232 119.783 346.243 107.366 288H148c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40.634C119.768 165.826 165.757 119.783 224 107.366V148c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40.634C346.174 119.768 392.217 165.757 404.634 224H364c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40.634C392.232 346.174 346.243 392.217 288 404.634zM288 256c0 17.673-14.327 32-32 32s-32-14.327-32-32c0-17.673 14.327-32 32-32s32 14.327 32 32z"},"child":[]}]})(props);
}function FaGamepad (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"},"child":[]}]})(props);
}

// ---------------------------------------------------------------------------
// Chamadas ao backend
// ---------------------------------------------------------------------------
const getState = callable("get_state");
const updateSettings = callable("update_settings");
const resetNudge = callable("reset_nudge");
const resetComp = callable("reset_comp");
const saveProfile = callable("save_profile");
const deleteProfile = callable("delete_profile");
const gameStarted = callable("game_started");
const hotkeyToggle = callable("hotkey_toggle");
const setHotkey = callable("set_hotkey");
const clearHotkey = callable("clear_hotkey");

// Atalho de botões do controle (liga/desliga a mira): lado da interface.
//
// Modelo validado no projeto Steamcord (Necrosiak, BSD-3-Clause,
// https://github.com/Necrosiak/Steamcord):
//   * GRAVAR: a interface do Steam recebe os botões do controle enquanto o menu
//     está aberto (SteamClient.Input). A combinação fica salva como IDs de
//     botão do Steam.
//   * USAR: a interface escuta o controle e liga/desliga a mira. Em jogo, alguns
//     builds do Steam não entregam botões à interface; por isso o backend também
//     lê o controle direto. Os dois caminhos ficam sempre ativos: se a mesma
//     apertada chegar pelos dois, o backend conta como uma só (deduplicação).
// Nomes do enum de botões do Steam (extraídos do bundle do Steam pelo Steamcord).
// Os não listados aparecem como "BTN<n>".
const BUTTON_NAMES = {
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
function buttonName(id) {
    return BUTTON_NAMES[id] ?? "BTN" + id;
}
// O "A" que toca em "Gravar" gera os eventos de apertar/soltar DEPOIS que a
// gravação começa. Sem esta folga, ele entraria na combinação sozinho.
const CAPTURE_GRACE_MS = 250;
const held = new Set(); // botões apertados agora
let cfg = { enabled: false, buttons: [], holdMs: 0 };
let comboActive = false;
let holdTimer;
let capture = null;
let inputReg = null;
let resumeTimer;
function fire() {
    hotkeyToggle("ui").catch((error) => console.warn("[Crosshair] falha ao alternar a mira:", error));
}
function evaluate() {
    const active = cfg.enabled && cfg.buttons.length === 2 && cfg.buttons.every((b) => held.has(b));
    if (active && !comboActive) {
        comboActive = true;
        holdTimer = window.setTimeout(() => {
            holdTimer = undefined;
            if (comboActive)
                fire();
        }, cfg.holdMs);
    }
    else if (!active && comboActive) {
        comboActive = false;
        if (holdTimer !== undefined) {
            window.clearTimeout(holdTimer);
            holdTimer = undefined;
        }
    }
}
// Atualiza a configuração vinda do backend (chamado ao abrir o painel e a cada mudança)
function applyHotkeyState(state) {
    cfg = { enabled: state.enabled, buttons: state.buttons, holdMs: state.hold_ms };
    evaluate();
}
function onButton(button, down) {
    if (down)
        held.add(button);
    else
        held.delete(button);
    const session = capture;
    if (session) {
        if (down) {
            if (Date.now() - session.startedAt < CAPTURE_GRACE_MS || session.preHeld.has(button)) {
                session.preHeld.add(button);
            }
            else {
                session.acc.add(button);
            }
        }
        else {
            session.preHeld.delete(button);
            // a combinação vale quando todos os botões foram soltos
            if (session.acc.size > 0 && held.size === 0) {
                const buttons = Array.from(session.acc).sort((a, b) => a - b);
                if (buttons.length === 2) {
                    session.finish({ ok: true, buttons: [buttons[0], buttons[1]] });
                }
                else if (buttons.length > 2) {
                    session.finish({ ok: false, reason: "count" });
                }
                else {
                    session.acc.clear(); // só 1 botão: continua esperando até o tempo acabar
                }
            }
        }
        return;
    }
    evaluate();
}
// Grava uma combinação de exatamente 2 botões (a interface precisa estar aberta)
function captureButtons(timeoutMs = 12000) {
    const ref = { session: null };
    let timer;
    let settled = false;
    const promise = new Promise((resolve) => {
        const finish = (result) => {
            if (settled)
                return;
            settled = true;
            if (timer !== undefined)
                window.clearTimeout(timer);
            if (capture === ref.session)
                capture = null;
            resolve(result);
        };
        ref.session = { acc: new Set(), preHeld: new Set(held), startedAt: Date.now(), finish };
        capture = ref.session;
        if (!inputReg)
            registerControllerListener();
        timer = window.setTimeout(() => finish({ ok: false, reason: "timeout" }), timeoutMs);
    });
    return { promise, cancel: () => ref.session?.finish({ ok: false, reason: "cancel" }) };
}
function unregisterController() {
    if (!inputReg)
        return;
    try {
        if (typeof inputReg === "function")
            inputReg();
        else if (typeof inputReg.unregister === "function")
            inputReg.unregister();
    }
    catch (error) {
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
    const input = window.SteamClient?.Input;
    try {
        if (typeof input?.RegisterForControllerInputMessages === "function") {
            inputReg = input.RegisterForControllerInputMessages((...args) => {
                try {
                    const first = args[0];
                    if (Array.isArray(first)) {
                        for (const event of first) {
                            if (typeof event?.nA === "number")
                                onButton(event.nA, !!event.bS);
                        }
                    }
                    else if (typeof args[1] === "number") {
                        onButton(args[1], !!args[2]);
                    }
                }
                catch (error) {
                    console.warn("[Crosshair] falha ao tratar um botão:", error);
                }
            });
        }
        else if (typeof input?.RegisterForControllerStateChanges === "function") {
            inputReg = input.RegisterForControllerStateChanges((changes) => {
                try {
                    const next = new Set();
                    for (const change of changes) {
                        const low = change.ulButtons >>> 0;
                        const high = change.ulUpperButtons >>> 0;
                        for (let bit = 0; bit < 32; bit++) {
                            if (low & (1 << bit))
                                next.add(bit);
                            if (high & (1 << bit))
                                next.add(bit + 32);
                        }
                    }
                    for (const id of Array.from(held))
                        if (!next.has(id))
                            onButton(id, false);
                    for (const id of Array.from(next))
                        if (!held.has(id))
                            onButton(id, true);
                }
                catch (error) {
                    console.warn("[Crosshair] falha ao tratar o estado do controle:", error);
                }
            });
        }
        else {
            console.warn("[Crosshair] nenhuma API de entrada do controle disponível");
        }
    }
    catch (error) {
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
        if (gap < RESUME_GAP_MS)
            return;
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
function initHotkey() {
    getState()
        .then((state) => applyHotkeyState(state.hotkey))
        .catch((error) => console.warn("[Crosshair] falha ao ler o atalho:", error));
    registerControllerListener();
    watchForResume();
}
function disposeHotkey() {
    unregisterController();
    if (resumeTimer !== undefined) {
        window.clearInterval(resumeTimer);
        resumeTimer = undefined;
    }
    if (holdTimer !== undefined) {
        window.clearTimeout(holdTimer);
        holdTimer = undefined;
    }
    held.clear();
    comboActive = false;
    capture = null;
}

const COLORS = [
    { name: "Rosa", hex: "FF007B" },
    { name: "Verde", hex: "00FF66" },
    { name: "Vermelho", hex: "FF2D2D" },
    { name: "Amarelo", hex: "FFE600" },
    { name: "Ciano", hex: "00E5FF" },
    { name: "Roxo", hex: "9B5CFF" },
    { name: "Laranja", hex: "FF8A00" },
    { name: "Branco", hex: "FFFFFF" },
];
const SIZE_PRESETS = [50, 100, 150, 200, 300];
function hexToRgb(hex) {
    const n = parseInt(hex, 16);
    if (Number.isNaN(n))
        return [255, 0, 123];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
    const p = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    return (p(r) + p(g) + p(b)).toUpperCase();
}
// Jogo que está rodando agora (null se estiver só no menu)
function getRunningGame() {
    try {
        const app = DFL.Router.MainRunningApp;
        if (app && app.appid) {
            return { appid: String(app.appid), name: app.display_name || "Jogo " + app.appid };
        }
    }
    catch (error) {
        console.error(error);
    }
    return null;
}

// Resumo do estado da mira (sem prévia): ativa ou não, modelo, tamanho e cor
function StatusChips(props) {
    const { settings, modelLabel } = props;
    return (window.SP_REACT.createElement("div", { className: "xh-chips" },
        window.SP_REACT.createElement("span", { className: "xh-pill" + (settings.enabled ? " xh-on" : "") }, settings.enabled ? "Ativo" : "Desligado"),
        window.SP_REACT.createElement("span", { className: "xh-chip" }, modelLabel),
        window.SP_REACT.createElement("span", { className: "xh-chip" },
            settings.size,
            "%"),
        window.SP_REACT.createElement("span", { className: "xh-chip" },
            window.SP_REACT.createElement("span", { className: "xh-dot", style: { background: "#" + settings.color } }),
            "#",
            settings.color)));
}
// Carrossel de cores: a cor escolhida fica sempre no centro. Quem muda a cor é o
// slider logo abaixo (esquerda/direita), então aqui é só visual e também aceita toque.
function ColorStrip(props) {
    const total = COLORS.length;
    const index = COLORS.findIndex((c) => c.hex === props.value);
    const center = index >= 0 ? index : 0;
    const slots = [-2, -1, 0, 1, 2].map((offset) => COLORS[(center + offset + total) % total]);
    const name = index >= 0 ? COLORS[index].name : "Personalizada";
    return (window.SP_REACT.createElement("div", { className: "xh-strip-wrap" },
        window.SP_REACT.createElement("div", { className: "xh-strip" }, slots.map((c, i) => {
            const isCenter = i === 2;
            const isNear = i === 1 || i === 3;
            return (window.SP_REACT.createElement("div", { key: i, className: "xh-strip-swatch" + (isCenter ? " xh-center" : isNear ? " xh-near" : ""), style: {
                    background: "#" + (isCenter ? props.value : c.hex),
                    boxShadow: isCenter ? "0 0 16px #" + props.value + "cc" : "none",
                }, onClick: () => props.onSelect(c.hex) }, isCenter && window.SP_REACT.createElement(FaCheck, { size: 16, color: "#000000" })));
        })),
        window.SP_REACT.createElement("div", { className: "xh-strip-name" },
            name,
            " \u00B7 #",
            props.value)));
}
// Atalhos de tamanho (50%, 100%, ...). O "flow-children" faz esquerda/direita
// andarem entre os botões da fileira.
function SizeChips(props) {
    return (window.SP_REACT.createElement(DFL.Focusable, { className: "xh-sizes", "flow-children": "row" }, SIZE_PRESETS.map((size) => (window.SP_REACT.createElement(DFL.Focusable, { key: size, className: "xh-size" + (props.value === size ? " xh-active" : ""), onActivate: () => props.onSelect(size) },
        size,
        "%")))));
}
// Explica de onde o atalho está sendo lido e, se for o caso, por que só funciona com o menu aberto
function readingNote(hotkey) {
    if (hotkey.covered)
        return "Lendo pela interface do Steam e em jogo (" + hotkey.devices + " controle(s)).";
    if (!hotkey.supported) {
        return "Esta combinação só funciona com o menu do Steam em foco. Para usar em jogo, grave outra com A, B, X, Y, direcional, LB, RB, LT, RT, Menu ou View.";
    }
    if (hotkey.devices === 0) {
        return "Procurando controles para ler em jogo. O Steam cria o controle virtual quando um jogo abre.";
    }
    return "Estes botões não chegam pelo controle virtual do Steam. Para usar em jogo, grave A, B, X, Y, direcional, LB, RB, LT, RT, Menu ou View.";
}
// Cartão do atalho de botões: combinação gravada, gravação em andamento e situação da leitura
function HotkeyCard(props) {
    const { hotkey, capturing, secondsLeft, message } = props;
    const hasCombo = hotkey.buttons.length === 2;
    return (window.SP_REACT.createElement("div", { className: "xh-card" + (capturing ? " xh-recording" : "") },
        capturing ? (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: "xh-rec" },
                window.SP_REACT.createElement("span", { className: "xh-rec-dot" }),
                "Gravando... ",
                secondsLeft,
                "s"),
            window.SP_REACT.createElement("div", { className: "xh-hint" }, "Aperte os 2 bot\u00F5es juntos e depois solte. Pode fazer com este menu aberto."))) : hasCombo ? (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: "xh-card-title" }, "Combina\u00E7\u00E3o"),
            window.SP_REACT.createElement("div", { className: "xh-keys" },
                window.SP_REACT.createElement("span", { className: "xh-key" }, buttonName(hotkey.buttons[0])),
                window.SP_REACT.createElement("span", { className: "xh-plus" }, "+"),
                window.SP_REACT.createElement("span", { className: "xh-key" }, buttonName(hotkey.buttons[1]))))) : (window.SP_REACT.createElement("div", { className: "xh-hint" }, "Nenhuma combina\u00E7\u00E3o gravada. Toque em \"Gravar combina\u00E7\u00E3o\".")),
        message && !capturing && window.SP_REACT.createElement("div", { className: "xh-warn" }, message),
        hasCombo && hotkey.enabled && !capturing && window.SP_REACT.createElement("div", { className: "xh-hint xh-diag" }, readingNote(hotkey)),
        hasCombo && hotkey.enabled && !capturing && hotkey.running && (window.SP_REACT.createElement("div", { className: "xh-hint xh-diag" }, hotkey.last_seen.length > 0
            ? "Último botão lido em jogo: " +
                hotkey.last_seen.map((id) => buttonName(id) + "(" + id + ")").join(" + ") +
                (hotkey.last_seen_age !== null ? ", há " + hotkey.last_seen_age + " s" : "")
            : "Nenhum botão lido em jogo ainda.")),
        hasCombo && hotkey.enabled && !capturing && hotkey.denied > 0 && (window.SP_REACT.createElement("div", { className: "xh-warn" },
            "Sem permiss\u00E3o para ler ",
            hotkey.denied,
            " controle(s)."))));
}

// Estilos do painel. As classes "gpfocus" são aplicadas pelo Steam ao item
// que está com o foco do controle.
const STYLES = `
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

const CAPTURE_SECONDS = 12;
function Content() {
    const [state, setState] = SP_REACT.useState(null);
    const [status, setStatus] = SP_REACT.useState("");
    const [game] = SP_REACT.useState(() => getRunningGame());
    const [customColor, setCustomColor] = SP_REACT.useState(false);
    const [calibrate, setCalibrate] = SP_REACT.useState(false);
    const [capturing, setCapturing] = SP_REACT.useState(false);
    const [secondsLeft, setSecondsLeft] = SP_REACT.useState(0);
    const [captureMessage, setCaptureMessage] = SP_REACT.useState("");
    const captureRef = SP_REACT.useRef(null);
    // Junta alterações rápidas (sliders) e envia ao backend de uma vez
    const pending = SP_REACT.useRef({});
    const timer = SP_REACT.useRef(undefined);
    SP_REACT.useEffect(() => {
        getState()
            .then(setState)
            .catch((error) => {
            console.error(error);
            setStatus("Falha ao carregar: " + String(error));
        });
        return () => {
            if (timer.current !== undefined)
                window.clearTimeout(timer.current);
        };
    }, []);
    const run = async (action, okMessage) => {
        try {
            setState(await action());
            setStatus(okMessage);
        }
        catch (error) {
            console.error(error);
            setStatus("Falhou: " + String(error));
        }
    };
    // Mantém o ouvinte global do atalho em dia com o que está salvo no backend
    SP_REACT.useEffect(() => {
        if (state)
            applyHotkeyState(state.hotkey);
    }, [state]);
    // Contagem regressiva da gravação; ao sair do painel, cancela a gravação
    SP_REACT.useEffect(() => {
        if (!capturing)
            return undefined;
        const id = window.setInterval(() => setSecondsLeft((left) => Math.max(0, left - 1)), 1000);
        return () => window.clearInterval(id);
    }, [capturing]);
    SP_REACT.useEffect(() => () => {
        captureRef.current?.cancel();
    }, []);
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
        }
        else if (result.reason === "count") {
            setCaptureMessage("Aperte exatamente 2 botões juntos. Tente de novo.");
        }
        else if (result.reason === "timeout") {
            setCaptureMessage("Tempo esgotado. Nenhuma combinação foi gravada.");
        }
    };
    const queue = (patch) => {
        pending.current = { ...pending.current, ...patch };
        if (timer.current !== undefined)
            window.clearTimeout(timer.current);
        timer.current = window.setTimeout(async () => {
            const toSend = pending.current;
            pending.current = {};
            try {
                setState(await updateSettings(toSend));
                setStatus("");
            }
            catch (error) {
                console.error(error);
                setStatus("Falha ao aplicar: " + String(error));
            }
        }, 150);
    };
    const patchSettings = (patch) => {
        setState((prev) => (prev ? { ...prev, settings: { ...prev.settings, ...patch } } : prev));
        queue(patch);
    };
    const patchHotkey = (patch) => {
        setState((prev) => prev
            ? {
                ...prev,
                hotkey: {
                    ...prev.hotkey,
                    ...(patch.hotkey_enabled !== undefined ? { enabled: patch.hotkey_enabled } : {}),
                    ...(patch.hotkey_hold !== undefined ? { hold_ms: patch.hotkey_hold } : {}),
                },
            }
            : prev);
        queue(patch);
    };
    if (!state) {
        return (window.SP_REACT.createElement(DFL.PanelSection, { title: "Crosshair" },
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement("div", { className: "xh-hint" }, status || "Carregando..."))));
    }
    const { settings, models, resolutions, profiles, hotkey } = state;
    const currentModel = models.find((m) => m.id === settings.model) ?? models[0];
    const [r, g, b] = hexToRgb(settings.color);
    const hasProfile = game !== null && profiles.some((p) => p.appid === game.appid);
    const colorIndex = Math.max(0, COLORS.findIndex((c) => c.hex === settings.color));
    return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
        window.SP_REACT.createElement("style", null, STYLES),
        window.SP_REACT.createElement(DFL.PanelSection, { title: "Crosshair" },
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(StatusChips, { settings: settings, modelLabel: currentModel.label })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ToggleField, { label: "Mostrar crosshair", description: "Substitui o overlay de desempenho (MangoHud).", checked: settings.enabled, onChange: (value) => patchSettings({ enabled: value }) }))),
        window.SP_REACT.createElement(DFL.PanelSection, { title: "Apar\u00EAncia" },
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.DropdownItem, { label: "Modelo", rgOptions: models.map((m) => ({ data: m.id, label: m.label })), selectedOption: settings.model, onChange: (option) => patchSettings({ model: option.data }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(ColorStrip, { value: settings.color, onSelect: (hex) => patchSettings({ color: hex }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.SliderField, { label: "Cor", value: colorIndex, min: 0, max: COLORS.length - 1, step: 1, onChange: (index) => patchSettings({ color: COLORS[index].hex }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ToggleField, { label: "Cor personalizada (RGB)", checked: customColor, onChange: (value) => setCustomColor(value) })),
            customColor && (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement(DFL.SliderField, { label: "Vermelho", value: r, min: 0, max: 255, step: 5, showValue: true, onChange: (v) => patchSettings({ color: rgbToHex(v, g, b) }) })),
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement(DFL.SliderField, { label: "Verde", value: g, min: 0, max: 255, step: 5, showValue: true, onChange: (v) => patchSettings({ color: rgbToHex(r, v, b) }) })),
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement(DFL.SliderField, { label: "Azul", value: b, min: 0, max: 255, step: 5, showValue: true, onChange: (v) => patchSettings({ color: rgbToHex(r, g, v) }) })))),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(SizeChips, { value: settings.size, onSelect: (size) => patchSettings({ size }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.SliderField, { label: "Tamanho", value: settings.size, min: 50, max: 300, step: 10, showValue: true, valueSuffix: "%", onChange: (v) => patchSettings({ size: v }) }))),
        window.SP_REACT.createElement(DFL.PanelSection, { title: "Tela e posi\u00E7\u00E3o" },
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.DropdownItem, { label: "Resolu\u00E7\u00E3o da tela", rgOptions: resolutions.map((res) => ({ data: res.id, label: res.label })), selectedOption: settings.resolution, onChange: (option) => patchSettings({ resolution: option.data }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.SliderField, { label: "Horizontal (X)", value: settings.nudge_x, min: -200, max: 200, step: 1, showValue: true, onChange: (v) => patchSettings({ nudge_x: v }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.SliderField, { label: "Vertical (Y)", value: settings.nudge_y, min: -200, max: 200, step: 1, showValue: true, onChange: (v) => patchSettings({ nudge_y: v }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => run(() => resetNudge(), "Ajuste zerado") }, "Zerar ajuste de posi\u00E7\u00E3o")),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ToggleField, { label: "Calibrar escala (avan\u00E7ado)", description: "A mira cresce a partir do centro. Use s\u00F3 se ela se mover ao mudar o tamanho.", checked: calibrate, onChange: (value) => setCalibrate(value) })),
            calibrate && (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement("div", { className: "xh-card" },
                        window.SP_REACT.createElement("div", { className: "xh-card-title" }, "Como calibrar"),
                        window.SP_REACT.createElement("div", { className: "xh-hint" }, "1) Deixe o tamanho em 100% e centralize a mira com Horizontal e Vertical. 2) Suba o tamanho para 300%. 3) Se a mira saiu do centro, ajuste a compensa\u00E7\u00E3o at\u00E9 ela voltar. Se ao crescer ela sobe ou vai para a esquerda, aumente. Se desce ou vai para a direita, diminua. A calibra\u00E7\u00E3o vale para o modelo atual."))),
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement(DFL.SliderField, { label: "Compensa\u00E7\u00E3o horizontal", value: settings.comp_x, min: -60, max: 60, step: 1, showValue: true, onChange: (v) => patchSettings({ comp_x: v }) })),
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement(DFL.SliderField, { label: "Compensa\u00E7\u00E3o vertical", value: settings.comp_y, min: -60, max: 60, step: 1, showValue: true, onChange: (v) => patchSettings({ comp_y: v }) })),
                window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                    window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => run(() => resetComp(), "Compensação restaurada") }, "Restaurar compensa\u00E7\u00E3o padr\u00E3o")))),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement("div", { className: "xh-offsets" },
                    "Posi\u00E7\u00E3o final: ",
                    state.offset_x,
                    ", ",
                    state.offset_y))),
        window.SP_REACT.createElement(DFL.PanelSection, { title: "Atalho de bot\u00F5es" },
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ToggleField, { label: "Ligar/desligar com 2 bot\u00F5es", description: "Segure os 2 bot\u00F5es gravados para mostrar ou esconder a mira.", checked: hotkey.enabled, onChange: (value) => patchHotkey({ hotkey_enabled: value }) })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(HotkeyCard, { hotkey: hotkey, capturing: capturing, secondsLeft: secondsLeft, message: captureMessage })),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => toggleCapture() }, capturing
                    ? "Cancelar gravação"
                    : hotkey.buttons.length === 2
                        ? "Gravar outra combinação"
                        : "Gravar combinação")),
            hotkey.buttons.length === 2 && (window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => run(() => clearHotkey(), "Combinação removida") }, "Remover combina\u00E7\u00E3o"))),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.SliderField, { label: "Tempo segurando", value: hotkey.hold_ms, min: 0, max: 1000, step: 50, showValue: true, valueSuffix: " ms", onChange: (v) => patchHotkey({ hotkey_hold: v }) }))),
        window.SP_REACT.createElement(DFL.PanelSection, { title: "Perfil do jogo" },
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement("div", { className: "xh-card" }, game ? (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    window.SP_REACT.createElement("div", { className: "xh-card-title" },
                        window.SP_REACT.createElement(FaGamepad, null),
                        " ",
                        game.name),
                    window.SP_REACT.createElement("span", { className: "xh-pill" + (hasProfile ? " xh-blue" : "") }, hasProfile ? "Perfil salvo" : "Sem perfil"))) : (window.SP_REACT.createElement("div", { className: "xh-hint" }, "Abra este menu com um jogo rodando para salvar um perfil s\u00F3 para ele (modelo, cor, tamanho e posi\u00E7\u00E3o).")))),
            game && (window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => run(() => saveProfile(game.appid, game.name), "Perfil salvo para " + game.name) }, hasProfile ? "Atualizar perfil deste jogo" : "Salvar perfil deste jogo"))),
            game && hasProfile && (window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => run(() => deleteProfile(game.appid), "Perfil removido de " + game.name) }, "Excluir perfil deste jogo"))),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement(DFL.ToggleField, { label: "Aplicar perfil ao abrir o jogo", checked: settings.auto_apply, onChange: (value) => patchSettings({ auto_apply: value }) })),
            profiles
                .filter((p) => !game || p.appid !== game.appid)
                .map((p) => (window.SP_REACT.createElement(DFL.PanelSectionRow, { key: p.appid },
                window.SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => run(() => deleteProfile(p.appid), "Perfil removido de " + p.name) },
                    "Excluir perfil: ",
                    p.name))))),
        window.SP_REACT.createElement(DFL.PanelSection, null,
            status && (window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement("div", { className: "xh-hint" }, status))),
            window.SP_REACT.createElement(DFL.PanelSectionRow, null,
                window.SP_REACT.createElement("div", { className: "xh-hint" }, "O plugin usa o texto do MangoHud como mira, ent\u00E3o n\u00E3o d\u00E1 para ter o overlay de desempenho ao mesmo tempo. Para voltar o overlay, mude o n\u00EDvel de desempenho no menu r\u00E1pido. Depois, ligue o crosshair de novo aqui.")))));
}

var index = definePlugin(() => {
    // Ao abrir um jogo, aplica o perfil salvo dele (se houver)
    let unregister;
    try {
        const steamClient = window.SteamClient;
        unregister = steamClient?.GameSessions?.RegisterForAppLifetimeNotifications?.((update) => {
            if (update.bRunning) {
                gameStarted(String(update.unAppID)).catch((error) => console.error(error));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
    // Atalho de botões (liga/desliga a mira); se falhar, o resto do plugin segue normal
    try {
        initHotkey();
    }
    catch (error) {
        console.error(error);
    }
    return {
        name: "Crosshair Plugin",
        titleView: window.SP_REACT.createElement("div", { className: DFL.staticClasses.Title }, "Crosshair"),
        content: window.SP_REACT.createElement(Content, null),
        icon: window.SP_REACT.createElement(FaCrosshairs, null),
        onDismount() {
            try {
                unregister?.unregister?.();
            }
            catch (error) {
                console.error(error);
            }
            try {
                disposeHotkey();
            }
            catch (error) {
                console.error(error);
            }
        },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
