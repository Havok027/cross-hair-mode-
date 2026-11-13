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
      jsx: ts.JsxEmit.React, jsxFactory: "window.SP_REACT.createElement",
      jsxFragmentFactory: "window.SP_REACT.Fragment" },
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
    raw: (...args) => listener(...args),
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

test("alternate Steam event fields preserve textual and numeric press/release states", async () => {
  const formats = [
    ["nA", "bS", true, false],
    ["unButton", "isPressed", 1, 0],
    ["buttonId", "pressed", "1", "0"],
    ["button", "down", "pressed", "released"],
    ["button", "down", "down", "up"],
  ];
  for (const [id, state, down, up] of formats) {
    const input = await controller();
    input.configure([35, 2]);
    input.raw([{ [id]: 35, [state]: down }, { [id]: 2, [state]: up }]);
    assert.equal(input.fires(), 0);
    input.raw({ [id]: 2, [state]: down });
    assert.equal(input.fires(), 1);
    input.raw({ [id]: 2, [state]: up });
    input.raw({ [id]: 2, [state]: "unknown" });
    assert.equal(input.fires(), 1);
    input.raw({ [id]: 2, [state]: down });
    assert.equal(input.fires(), 2);
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

test("L1/R1 cycle the three tabs, retain focus, persist selection, and stay idle during capture", () => {
  let active, saved, focused, capturing = false;
  const nav = { current: {} };
  const createElement = (type, props, ...children) => ({ type, props: { ...props, children } });
  const tabs = load("SettingsTabs.tsx", {
    react: { useRef: () => nav, useState: (initial) => {
      active ??= initial(); return [active, (value) => { active = value; }];
    } },
    "@decky/ui": { Focusable: "Focusable", PanelSection: "Section", PanelSectionRow: "Row",
      GamepadButton: { BUMPER_LEFT: 5, BUMPER_RIGHT: 6 } },
    "react-icons/fa": { FaBullseye: "Icon", FaLayerGroup: "Icon", FaCog: "Icon" },
    "./i18n": { useTranslation: () => i18n.translator("en") },
  }, { window: { SP_REACT: { createElement } }, localStorage: {
    getItem: () => saved, setItem: (_, value) => { saved = value; },
  } });
  function render() {
    const tree = tabs.TabbedSettings({ capturing, children: () => null });
    const ids = [];
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node?.props) return;
      if (node.props.role === "tab") {
        ids.push(node.props.id);
        node.props.navRef({ TakeFocus: () => { focused = node.props.id; return true; } });
      }
      visit(node.props.children);
    }
    visit(tree);
    render.ids = ids;
    return tree;
  }
  function press(button) {
    render().props.onButtonDown({ detail: { button }, stopPropagation() {}, preventDefault() {} });
  }
  press(6); assert.equal(saved, "profiles"); assert.equal(focused, "xh-tab-profiles");
  assert.deepEqual(render.ids, ["xh-tab-appearance", "xh-tab-profiles", "xh-tab-settings"]);
  press(6); assert.equal(saved, "settings");
  press(6); assert.equal(saved, "appearance");
  press(5); assert.equal(saved, "settings"); assert.equal(focused, "xh-tab-settings");
  capturing = true;
  press(5); assert.equal(saved, "settings");
  press(6); assert.equal(saved, "settings");
});

function mountContent({ game = null, profiles = [], language = "en" } = {}) {
  let state = { settings: { language, model: "box", color: "FF007B", size: 100, resolution: "deck" },
    models: [{ id: "box" }], resolutions: [{ id: "deck", label: "Deck" }], profiles, hotkey: { buttons: [] }, offset_x: 1, offset_y: 2 };
  const cleanups = [], updates = [], calls = [], modals = [];
  let hook = 0;
  const createElement = (type, props, ...children) => ({ type, props: { ...props, children } });
  const api = (name) => async (...args) => { calls.push([name, ...args]); return state; };
  const content = load("Content.tsx", {
    react: {
      useState: (initial) => ++hook === 1
        ? [state, (next) => { state = typeof next === "function" ? next(state) : next; }]
        : [typeof initial === "function" ? initial() : initial, () => {}],
      useRef: (value) => ({ current: value }),
      useEffect: (effect) => { cleanups.push(effect()); },
    },
    "@decky/ui": { ...Object.fromEntries(["ButtonItem", "DialogButton", "DropdownItem", "PanelSection", "PanelSectionRow", "SliderField", "ToggleField"].map((id) => [id, id])),
      showModal: (element) => modals.push(element) },
    "react-icons/fa": { FaGamepad: "Icon", FaPen: "Icon", FaPlus: "Icon", FaTrash: "Icon" },
    "./api": { getState: async () => state, updateSettings: async (patch) => { updates.push(patch); return state; },
      renameProfile: api("rename"), saveProfile: api("save"), deleteProfile: api("delete"), resetNudge: api("x"), resetComp: api("x"),
      setHotkey: api("x"), clearHotkey: api("x") },
    "./components": { ColorStrip: "ColorStrip", FoldSection: "FoldSection", HotkeyCard: "HotkeyCard", ProfileTable: "ProfileTable",
      RenameProfileModal: "RenameProfileModal", SettingsSection: "Section", ShortcutTable: "ShortcutTable", SizeChips: "SizeChips",
      StatusTable: "StatusTable" },
    "./hotkey": { applyHotkeyState() {} }, "./i18n": i18n, "./SettingsTabs": { TabbedSettings: "Tabs" },
    "./styles": { STYLES: "" }, "./utils": { COLORS: [{ hex: "FF007B" }], getRunningGame: () => game, hexToRgb: () => [255, 0, 123] },
  }, { window: { SP_REACT: { createElement, Fragment: "Fragment" }, setTimeout: () => 1, clearTimeout() {} },
    localStorage: { getItem: () => null, setItem() {} } });
  return { content, cleanups, updates, calls, modals, get state() { return state; } };
}

function collect(tree, tab, match) {
  const found = [];
  (function visit(node) {
    if (typeof node === "function") return visit(node(tab));
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node?.props) return;
    if (match(node)) found.push(node);
    visit(node.props.header); visit(node.props.children);
  })(tree);
  return found;
}

test("language dropdown is localized and its pending choice is saved when QAM closes", async () => {
  const app = mountContent();
  const tree = app.content.Content();
  await Promise.resolve();
  const isLanguage = (node) => node.props.label === "Language";
  for (const tab of ["appearance", "profiles"]) {
    assert.equal(collect(tree, tab, isLanguage).length, 0, `language must not appear in ${tab}`);
  }
  const [dropdown] = collect(tree, "settings", isLanguage);
  assert.ok(dropdown);
  assert.equal(dropdown.props.selectedOption, "en");
  dropdown.props.onChange({ data: "es" });
  assert.equal(app.state.settings.language, "es");
  assert.equal(app.updates.length, 0);
  for (const cleanup of app.cleanups) cleanup?.();
  assert.equal(app.updates.length, 1);
  assert.equal(app.updates[0].language, "es");
});

test("shortcut settings live in the Settings tab only", async () => {
  const app = mountContent();
  const tree = app.content.Content();
  await Promise.resolve();
  const isCard = (node) => node.type === "HotkeyCard";
  for (const tab of ["appearance", "profiles"]) assert.equal(collect(tree, tab, isCard).length, 0, tab);
  assert.equal(collect(tree, "settings", isCard).length, 1);
});

const PROFILE_A = { appid: "10", name: "Mine", enabled: true, model: "box", color: "FF007B", size: 100, nudge_x: 0, nudge_y: 0 };
const PROFILE_B = { appid: "20", name: "Other", enabled: false, model: "box", color: "00FF00", size: 150, nudge_x: 3, nudge_y: -2 };

test("profile buttons create, rename and delete the selected game profile", async () => {
  const game = { appid: "10", name: "Game" };
  const app = mountContent({ game, profiles: [PROFILE_A, PROFILE_B] });
  const tree = app.content.Content();
  await Promise.resolve();
  const buttons = collect(tree, "profiles", (node) => node.type === "DialogButton");
  const [create, rename, remove] = buttons;
  assert.equal(buttons.length, 3);
  assert.equal(create.props.disabled, false);
  // An existing profile keeps its custom name when it is updated.
  create.props.onClick();
  assert.deepEqual(app.calls.pop(), ["save", "10", "Mine"]);
  rename.props.onClick();
  assert.equal(app.modals.length, 1);
  assert.equal(app.modals[0].props.initial, "Mine");
  app.modals[0].props.onSave("Renamed");
  assert.deepEqual(app.calls.pop(), ["rename", "10", "Renamed"]);
  remove.props.onClick();
  assert.deepEqual(app.calls.pop(), ["delete", "10"]);
});

test("without a running game profiles can be renamed or deleted but not created", async () => {
  const none = mountContent();
  let tree = none.content.Content(); await Promise.resolve();
  let buttons = collect(tree, "profiles", (node) => node.type === "DialogButton");
  assert.deepEqual(buttons.map((b) => b.props.disabled), [true, true, true]);
  const saved = mountContent({ profiles: [PROFILE_B] });
  tree = saved.content.Content(); await Promise.resolve();
  buttons = collect(tree, "profiles", (node) => node.type === "DialogButton");
  assert.deepEqual(buttons.map((b) => b.props.disabled), [true, false, false]);
  buttons[2].props.onClick();
  assert.deepEqual(saved.calls.pop(), ["delete", "20"]);
});

test("each tab shows its own preview table", async () => {
  const game = { appid: "10", name: "Game" };
  const app = mountContent({ game, profiles: [PROFILE_A, PROFILE_B] });
  const tree = app.content.Content();
  await Promise.resolve();
  const tables = (tab) => collect(tree, tab, (node) => ["StatusTable", "ProfileTable", "ShortcutTable"].includes(node.type)).map((n) => n.type);
  assert.deepEqual(tables("appearance"), ["StatusTable"]);
  assert.deepEqual(tables("profiles"), ["ProfileTable"]);
  assert.deepEqual(tables("settings"), ["ShortcutTable"]);
  const [status] = collect(tree, "appearance", (node) => node.type === "StatusTable");
  assert.equal(status.props.resolutionLabel, "Deck");
  assert.equal(status.props.offsetX, 1); assert.equal(status.props.offsetY, 2);
  // The table follows the profile of the running game, which is selected by default.
  const [profile] = collect(tree, "profiles", (node) => node.type === "ProfileTable");
  assert.equal(profile.props.profile.appid, "10");
  assert.equal(profile.props.gameOpen, true);
  const other = mountContent({ profiles: [PROFILE_B] });
  const otherTree = other.content.Content(); await Promise.resolve();
  const [shown] = collect(otherTree, "profiles", (node) => node.type === "ProfileTable");
  assert.equal(shown.props.profile.appid, "20"); assert.equal(shown.props.gameOpen, false);
});

test("sections can be folded and keep their saved state", () => {
  let folded = "no-state";
  const store = { "crosshair-fold-demo": "1" };
  const createElement = (type, props, ...children) => ({ type, props: { ...props, children } });
  const components = load("components.tsx", {
    react: { useState: (initial) => { const value = typeof initial === "function" ? initial() : initial;
      folded = value; return [value, (next) => { folded = next; }]; } },
    "@decky/ui": { ConfirmModal: "ConfirmModal", DialogButton: "DialogButton", Focusable: "Focusable", PanelSection: "Section",
      PanelSectionRow: "Row", TextField: "TextField" },
    "react-icons/fa": { FaCheck: "Check", FaChevronDown: "Down", FaChevronUp: "Up" },
    "./hotkey": { buttonName: () => "?" }, "./i18n": { useTranslation: () => (key) => key }, "./utils": { COLORS: [], SIZE_PRESETS: [] },
  }, { window: { SP_REACT: { createElement, Fragment: "Fragment" } },
    localStorage: { getItem: (key) => store[key] ?? null, setItem: (key, value) => { store[key] = value; } } });
  let tree = components.FoldSection({ id: "demo", title: "Demo", children: "BODY" });
  assert.equal(folded, true);
  assert.ok(!JSON.stringify(tree).includes("BODY"));
  tree = components.FoldSection({ id: "other", title: "Other", children: "BODY" });
  assert.equal(folded, false);
  assert.ok(JSON.stringify(tree).includes("BODY"));
  const button = collect(tree, null, (node) => node.type === "DialogButton")[0];
  button.props.onClick();
  assert.equal(store["crosshair-fold-other"], "1");
});

test("profile table compares the saved profile with the current settings", () => {
  const createElement = (type, props, ...children) => ({ type, props: { ...props, children } });
  const components = load("components.tsx", {
    react: { useState: (initial) => [initial, () => {}] },
    "@decky/ui": { ConfirmModal: "ConfirmModal", DialogButton: "DialogButton", Focusable: "Focusable", PanelSection: "Section",
      PanelSectionRow: "Row", TextField: "TextField" },
    "react-icons/fa": { FaCheck: "Check", FaChevronDown: "Down", FaChevronUp: "Up" },
    "./hotkey": { buttonName: (id) => "B" + id }, "./i18n": { useTranslation: () => i18n.translator("en") },
    "./utils": { COLORS: [], SIZE_PRESETS: [] },
  }, { window: { SP_REACT: { createElement, Fragment: "Fragment" } } });
  const text = (node) => JSON.stringify(node);
  const settings = { enabled: true, model: "box", color: "ff007b", size: 100, nudge_x: 0, nudge_y: 0, auto_apply: true, language: "en" };
  const same = components.ProfileTable({ profile: PROFILE_A, settings, modelLabel: "Box", gameOpen: true });
  assert.match(text(same), /Same as current settings/);
  assert.match(text(same), /Game open/);
  const different = components.ProfileTable({ profile: PROFILE_B, settings, modelLabel: "Box", gameOpen: false });
  assert.match(text(different), /Differs from current settings/);
  assert.match(text(different), /3, -2/);
  const shortcut = components.ShortcutTable({ settings, hotkey: { buttons: [35, 2], enabled: true, hold_ms: 150, running: true } });
  assert.match(text(shortcut), /B35 \+ B2/);
  assert.match(text(shortcut), /150 ms/);
  assert.match(text(shortcut), /Shortcut on/);
});
