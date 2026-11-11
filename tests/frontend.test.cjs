const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(name, mocks, globals = {}) {
  const filename = path.join(__dirname, "..", "src", name);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React, jsxFactory: "window.SP_REACT.createElement" },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, console, ...globals,
    require: (id) => {
      assert.ok(id in mocks, `Unexpected import: ${id}`);
      return mocks[id];
    } }, { filename });
  return module.exports;
}

async function controller() {
  let listener, now = 1000, nextId = 0, fires = 0;
  const timers = new Map();
  const window = {
    SteamClient: { Input: { RegisterForControllerInputMessages: (fn) => {
      listener = fn; return { unregister() {} };
    } } },
    setTimeout: (fn, delay) => { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: (id) => timers.delete(id), setInterval: () => ++nextId, clearInterval() {},
  };
  const hotkey = load("hotkey.ts", { "./api": {
    getState: async () => ({ hotkey: { enabled: false, buttons: [], hold_ms: 0 } }),
    hotkeyToggle: async () => { fires++; },
  } }, { window, Date: { now: () => now } });
  hotkey.initHotkey();
  await Promise.resolve();
  return {
    hotkey, fires: () => fires,
    configure: (buttons, hold_ms = 0) => hotkey.applyHotkeyState({ enabled: true, buttons, hold_ms }),
    batch: (events) => listener(events.map(([nA, bS]) => ({ nA, bS }))),
    positional: (id, down) => listener(0, id, down),
    advance: (ms) => {
      now += ms;
      for (const [id, timer] of timers) if (timer.at <= now) { timers.delete(id); timer.fn(); }
    },
  };
}

test("QAM: quick Select + A/B/X/Y taps in one callback toggle exactly once", async () => {
  for (const face of [0, 1, 2, 3]) {
    const input = await controller();
    input.configure([35, face]);
    input.batch([[35, true], [face, true], [face, false], [35, false]]);
    assert.equal(input.fires(), 1, `face ${face}`);
    input.advance(100);
    assert.equal(input.fires(), 1);
    input.hotkey.disposeHotkey();
  }
});

test("positional events preserve hold duration, fire once, and rearm on release", async () => {
  const input = await controller();
  input.configure([35, 2], 200);
  input.positional(35, true); input.positional(2, true);
  input.advance(199); assert.equal(input.fires(), 0);
  input.advance(1); assert.equal(input.fires(), 1);
  input.positional(2, true); input.advance(400); assert.equal(input.fires(), 1);
  input.positional(2, false); input.positional(2, true);
  input.advance(200); assert.equal(input.fires(), 2);
  input.hotkey.disposeHotkey();
});

test("a short tap cannot fire a shortcut with a nonzero hold duration", async () => {
  const input = await controller();
  input.configure([35, 2], 200);
  input.batch([[35, true], [2, true], [2, false], [35, false]]);
  input.advance(300); assert.equal(input.fires(), 0);
  input.hotkey.disposeHotkey();
});

test("recording ignores the activating A and captures Select + X without toggling", async () => {
  const input = await controller();
  input.configure([35, 2]);
  const capture = input.hotkey.captureButtons();
  input.batch([[0, true], [0, false]]);
  input.advance(251);
  input.batch([[35, true], [2, true], [2, false], [35, false]]);
  const result = await capture.promise;
  assert.equal(result.ok, true);
  assert.deepEqual(Array.from(result.buttons), [2, 35]);
  assert.equal(input.fires(), 0);
  input.hotkey.disposeHotkey();
});

const i18n = load("i18n.tsx", { react: { createContext: (value) => ({ value }), useContext: (ctx) => ctx.value } });
test("all three languages have complete messages with matching placeholders", () => {
  for (const key of Object.keys(i18n.messages)) {
    const translated = ["pt", "en", "es"].map((lang) => i18n.translator(lang)(key));
    for (const text of translated) {
      assert.ok(text.length > 0);
      assert.doesNotMatch(text, /undefined/);
    }
    const variables = (text) => Array.from(text.matchAll(/\{(\w+)\}/g), (m) => m[1]).sort();
    assert.deepEqual(variables(translated[0]), variables(translated[1]), key);
    assert.deepEqual(variables(translated[0]), variables(translated[2]), key);
  }
  assert.equal(i18n.translator("es")("permission_denied", { count: 2 }), "Sin permiso para leer 2 mando(s).");
  assert.equal(i18n.modelLabel("box", i18n.translator("en")), "Box");
});

test("L1/R1 cycle tabs, retain focus, persist selection, and stay idle during capture", () => {
  let active, saved, focused, capturing = false;
  const nav = { current: {} };
  const createElement = (type, props, ...children) => ({ type, props: { ...props, children } });
  const tabs = load("SettingsTabs.tsx", {
    react: { useRef: () => nav, useState: (initial) => {
      active ??= initial(); return [active, (value) => { active = value; }];
    } },
    "@decky/ui": { Focusable: "Focusable", PanelSection: "Section", PanelSectionRow: "Row",
      GamepadButton: { BUMPER_LEFT: 5, BUMPER_RIGHT: 6 } },
    "react-icons/fa": { FaBullseye: "Icon", FaDesktop: "Icon", FaGamepad: "Icon", FaLayerGroup: "Icon" },
    "./i18n": { useTranslation: () => i18n.translator("en") },
  }, { window: { SP_REACT: { createElement } }, localStorage: {
    getItem: () => saved, setItem: (_, value) => { saved = value; },
  } });
  function render() {
    const tree = tabs.TabbedSettings({ capturing, children: () => null });
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node?.props) return;
      if (node.props.role === "tab") node.props.navRef({ TakeFocus: () => { focused = node.props.id; return true; } });
      visit(node.props.children);
    }
    visit(tree);
    return tree;
  }
  function press(button) {
    render().props.onButtonDown({ detail: { button }, stopPropagation() {}, preventDefault() {} });
  }
  press(5); assert.equal(saved, "profiles"); assert.equal(focused, "xh-tab-profiles");
  press(6); assert.equal(saved, "appearance");
  press(6); assert.equal(saved, "display");
  capturing = true;
  press(6); assert.equal(saved, "display");
});

test("language dropdown is localized and its pending choice is saved when QAM closes", async () => {
  let state = { settings: { language: "en", model: "box", color: "FF007B", size: 100 },
    models: [{ id: "box" }], resolutions: [], profiles: [], hotkey: { buttons: [] } };
  const cleanups = [], updates = [];
  let hook = 0;
  const createElement = (type, props, ...children) => ({ type, props: { ...props, children } });
  const content = load("Content.tsx", {
    react: {
      useState: (initial) => ++hook === 1
        ? [state, (next) => { state = typeof next === "function" ? next(state) : next; }]
        : [typeof initial === "function" ? initial() : initial, () => {}],
      useRef: (value) => ({ current: value }),
      useEffect: (effect) => { cleanups.push(effect()); },
    },
    "@decky/ui": Object.fromEntries(["ButtonItem", "DropdownItem", "PanelSection", "PanelSectionRow", "SliderField", "ToggleField"].map((id) => [id, id])),
    "react-icons/fa": { FaGamepad: "Icon" },
    "./api": { getState: async () => state, updateSettings: async (patch) => { updates.push(patch); return state; } },
    "./components": { ColorStrip: "ColorStrip", HotkeyCard: "HotkeyCard", SettingsSection: "Section", SizeChips: "SizeChips", StatusChips: "StatusChips" },
    "./hotkey": { applyHotkeyState() {} }, "./i18n": i18n, "./SettingsTabs": { TabbedSettings: "Tabs" },
    "./styles": { STYLES: "" }, "./utils": { COLORS: [{ hex: "FF007B" }], getRunningGame: () => null, hexToRgb: () => [255, 0, 123] },
  }, { window: { SP_REACT: { createElement }, setTimeout: () => 1, clearTimeout() {} } });
  const tree = content.Content();
  await Promise.resolve();
  let dropdown;
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node?.props) return;
    if (node.props.label === "Language") dropdown = node;
    visit(node.props.header); visit(node.props.children);
  }
  visit(tree);
  assert.ok(dropdown);
  assert.equal(dropdown.props.selectedOption, "en");
  dropdown.props.onChange({ data: "es" });
  assert.equal(state.settings.language, "es");
  assert.equal(updates.length, 0);
  for (const cleanup of cleanups) cleanup?.();
  assert.equal(updates.length, 1);
  assert.equal(updates[0].language, "es");
});
