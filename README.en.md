<h1 align="center">🎯 Crosshair Plugin</h1>

<p align="center"><b>Language:</b> <a href="README.md">Português</a> · English · <a href="README.es.md">Español</a></p>

<p align="center"><b>A customizable crosshair for Decky Loader, built for Steam Deck, Legion Go and other handhelds.</b></p>

<p align="center">
  <a href="https://github.com/Havok027/crosshair-plugin/releases/latest"><img src="https://img.shields.io/github/v/release/Havok027/crosshair-plugin?label=version&color=2ea44f&style=for-the-badge" alt="Version" /></a>
  <a href="https://github.com/Havok027/crosshair-plugin/releases"><img src="https://img.shields.io/github/downloads/Havok027/crosshair-plugin/total?label=downloads&color=1a9fff&style=for-the-badge" alt="Downloads" /></a>
  <a href="https://decky.xyz"><img src="https://img.shields.io/badge/Decky%20Loader-plugin-9b5cff?style=for-the-badge" alt="Decky Loader" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-BSD--3-ff007b?style=for-the-badge" alt="License" /></a>
</p>

<p align="center"><img src="https://github.com/user-attachments/assets/2a8a1378-ad2d-41a8-b484-789cc49682d4" alt="Crosshair Plugin interface (previous version)" width="100%" /></p>

[📦 Download](https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip) · [Getting started](#getting-started) · [Controller shortcut](#controller-shortcut) · [Troubleshooting](#troubleshooting) · [Roadmap](#roadmap)

## Contents

[Features](#features) · [Installation](#installation) · [Getting started](#getting-started) · [Controller shortcut](#controller-shortcut) · [Styles and colors](#styles-and-colors) · [Resolutions](#resolutions) · [How it works](#how-it-works) · [Troubleshooting](#troubleshooting) · [Roadmap](#roadmap) · [Version history](#version-history) · [Contributing](#contributing) · [Credits](#credits)

## Features

| Feature | What it does |
|---|---|
| **7 crosshair styles** | Box, Dot, Ring, X, Star, Brackets and Dashes, selected from a dropdown |
| **Colors and size** | 8 presets, custom RGB and scaling from 50% to 300% |
| **Scaling from the center** | The crosshair grows around its center, with optional calibration |
| **Controller shortcut** | Record 2 buttons to toggle the crosshair without opening the menu |
| **Per-game profiles** | Save style, color, size and position for each game and apply them on launch |
| **MangoHud preserved** | Turning off the crosshair restores the previous performance overlay |
| **Fine positioning** | Horizontal and vertical sliders from -200 to +200, saved per style |
| **Multiple displays** | Steam Deck, Legion Go S, Legion Go, 1080p and 4K |
| **Languages** | Portuguese, English and Spanish, with a saved language dropdown |
| **Tabbed interface** | Mako-inspired panels; switch tabs using L1/R1 or touch |
| **Updates** | Automated releases and Direct Updater compatibility |

## Installation

1. Download [`Crosshair.zip`](https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip) from [Releases](https://github.com/Havok027/crosshair-plugin/releases).
2. Open **Decky Loader Settings** and enable **Developer Mode**.
3. Under **Developer**, choose **Install Plugin from ZIP** and select `Crosshair.zip`.
4. Restart Decky or the device if the plugin does not appear.

> [!TIP]
> After the first installation, **Direct Updater** can recognize the plugin. If it cannot find its source, select **?** next to Crosshair, choose **Find source** and enter `Havok027/crosshair-plugin`.

> **Switching from the previous repository?** In Direct Updater, choose **Find source**, enter `Havok027/crosshair-plugin` and confirm **Use this source** once to receive future releases from this repository.

> **“GitHub asset checksum mismatch”:** the download differs from the hash saved by the updater. Check that the source is `Havok027/crosshair-plugin`, leave the details page and refresh the list. This distribution does not replace ZIPs from published versions.

## Getting started

1. Open **Crosshair Plugin** in Decky Loader.
2. In the **Language** dropdown, select **Português**, **English** or **Español**. Your choice is saved.
3. In **Display**, select your screen resolution.
4. In **Appearance**, choose the style, color and size.
5. Enable **Show crosshair**.
6. If necessary, center it using **Horizontal (X)** and **Vertical (Y)** in **Display**.
7. With a game running, optionally use **Save this game's profile** in **Profiles**.

Use **L1/R1** to cycle through **Appearance**, **Display**, **Shortcut** and **Profiles**. You can also select tabs by touch. The plugin remembers the last tab. While recording a shortcut, L1/R1 can be included in the combination and do not switch tabs.

| Area | Controls |
|---|---|
| **Crosshair** | Language, status summary and Show crosshair toggle |
| **Appearance** | Style, color carousel and slider, RGB controls, size presets and slider |
| **Display** | Resolution, X/Y sliders, position reset and advanced scaling calibration |
| **Shortcut** | Record, remove, hold duration and input diagnostics |
| **Profiles** | Save, update, delete and automatically apply game profiles |

> [!NOTE]
> The color slider changes colors immediately with left/right. The selected color stays in the center of the carousel. Use up/down to move between controls.

## Controller shortcut

Toggle the crosshair with **2 controller buttons**, without opening the menu.

1. In **Shortcut**, select **Record shortcut**.
2. Press the 2 buttons **together**, then release them within 12 seconds. You can keep the menu open.
3. The crosshair flashes twice when saved. Combinations such as **Select + X** are accepted.
4. Press the combination to show or hide the crosshair.

The input reader preserves press and release events that arrive together, including quick A/B/X/Y taps. **Hold duration** ranges from 0 to 1000 ms; the default is 0 for immediate activation. Increase it to reduce accidental activation.

| Buttons | Menu open | In game |
|---|:---:|:---:|
| A, B, X, Y and D-pad | ✅ | ✅ |
| L4, L5, R4, R5 on Steam Deck and Steam Controller | ✅ | ✅ |
| LB, RB, LT, RT, Menu and View | ✅ | 🧪 Being validated |
| L3, R3 and extra buttons on other controllers | ✅ | ⚠️ Depends on Steam |

> [!NOTE]
> Recording uses Steam's interface. In game, the plugin also reads controller input directly from the system. When both paths report the same press, the plugin counts it once. In-game availability depends on the buttons exposed by Steam Input and the device.

> [!TIP]
> The shortcut card shows the **last buttons read in game**, including names and IDs. Press your combination in game, then reopen the menu to check it.

## Styles and colors

| Style | Appearance | Description |
|---|:---:|---|
| Box | <code>&#124; + &#124;</code> | A frame around the center |
| Dot | `+` | The classic style |
| Ring | `O` | An open crosshair |
| X | `x` | Subtle |
| Star | `*` | A small mark |
| Brackets | `[ + ]` | Highlights the center |
| Dashes | `- + -` | Lines on each side |

| Color | Hex | Color | Hex |
|---|---|---|---|
| Pink | `#FF007B` | Cyan | `#00E5FF` |
| Green | `#00FF66` | Purple | `#9B5CFF` |
| Red | `#FF2D2D` | Orange | `#FF8A00` |
| Yellow | `#FFE600` | White | `#FFFFFF` |

Use **Custom color (RGB)** to create any other color.

## Resolutions

| Display | Resolution |
|---|---|
| Steam Deck | 1280 × 800 |
| Legion Go S | 1920 × 1200 |
| External monitor, 1080p | 1920 × 1080 |
| Legion Go | 2560 × 1600 |
| External monitor, 4K | 3840 × 2160 |

> [!NOTE]
> Centering for Ring, X, Star, Brackets and Dashes is estimated. Adjust X/Y if necessary; position is saved per style.

## How it works

The plugin writes a **MangoHud** configuration that draws text (`custom_text`) with a chosen color (`text_color`), size (`font_size`) and position (`offset_x`, `offset_y`).

| Action | Result |
|---|---|
| Enable crosshair | Back up the existing MangoHud configuration and write the crosshair |
| Disable crosshair | Restore the previous configuration exactly |
| Steam replaces the file | Preserve Steam's new performance overlay configuration |
| Restart Decky | Start with the crosshair off and restore the overlay |
| Change size | Recalculate position to scale around the center |

| Limitation | Details |
|---|---|
| Performance overlay | Cannot appear alongside the crosshair; both use MangoHud |
| Other plugins | May conflict with plugins that also modify MangoHud, such as MangoPeel |
| Automatic profiles | Depend on Steam notifying the plugin that a game has started |
| In-game shortcuts | Depend on the input exposed by Steam and the device |

## Troubleshooting

| Problem | Likely cause | What to do |
|---|---|---|
| Crosshair is off-center | Estimated style positioning | Adjust X/Y; use Calibrate scaling if resizing also moves it |
| Crosshair moves when resized | Internal MangoHud margins | Follow the 3 steps under Calibrate scaling |
| Shortcut fails outside the menu | Buttons are not exposed to the game | Check the last buttons read, review the Steam Input layout or record another combination |
| Shortcut fails even in the menu | Old recording or excessive hold duration | Record it again and set Hold duration to 0 |
| Performance overlay disappeared | Crosshair is enabled | Disable the crosshair to restore MangoHud |
| Profile does not apply on launch | Steam did not notify the plugin | Open the plugin and check Apply profile when the game starts |
| Failed to fetch dynamically imported module | Source code installed without `dist` | Install `Crosshair.zip` from Releases |
| Direct Updater cannot find the source | Older installation | **?** → **Find source** → `Havok027/crosshair-plugin` |

Logs: `~/homebrew/logs/Crosshair/`.

## Roadmap

| Status | Item |
|:---:|---|
| ✅ | Legion Go S support, colors, size and 7 styles |
| ✅ | Per-game profiles and scaling from the center |
| ✅ | Controller recording, in-game input and MangoHud restoration |
| ✅ | Automated releases and Direct Updater |
| ✅ | Portuguese, English and Spanish documentation and interface |
| ✅ | Mako-inspired tabs with L1/R1 navigation |
| 🔄 | Validate in-game LB, RB, LT, RT, Menu and View |
| 🧭 | L3/R3 and rear buttons on non-Valve controllers |
| 🧭 | Automatic centering calibration |
| 💡 | Opacity and outline |
| 💡 | Automatic display resolution detection |
| 💡 | More crosshair styles |
| 💡 | Publication in the official Decky store |

✅ Complete · 🔄 In progress · 🧭 Planned · 💡 Idea. This roadmap expresses intentions without dates.

## Version history

| Version | Highlights |
|:---:|---|
| **1.7.2** | Portuguese, English and Spanish; tabs with L1/R1; quick A/B/X/Y tap fixes |
| **1.7** | Restore previous MangoHud; expanded in-game input; QAM shortcuts; input diagnostics |
| **1.6** | Reworked recording through Steam UI; left/right color carousel; preview removed |
| **1.5** | First controller shortcut implementation and refreshed interface |
| **1.4** | Centered scaling, modular code and Direct Updater compatibility |
| **1.3** | Style dropdown, position sliders and per-game profiles |
| **1.2** | Legion Go S, colors, size and new styles |

Full notes are available in [Releases](https://github.com/Havok027/crosshair-plugin/releases).

## Contributing

Report bugs or ideas in [Issues](https://github.com/Havok027/crosshair-plugin/issues). Include your device, display resolution, plugin version, a panel screenshot (or shortcut diagnostics for input issues) and recent log lines from `~/homebrew/logs/Crosshair/`.

| File | Purpose |
|---|---|
| `main.py` | Settings, positioning, MangoHud and controller input |
| `src/index.tsx` | Plugin entry point |
| `src/Content.tsx` | Main panel |
| `src/components.tsx` | Shared panel components |
| `src/hotkey.ts` | Frontend shortcut handling |
| `src/i18n.tsx` | PT/EN/ES interface translations |
| `src/SettingsTabs.tsx` | Tabs and L1/R1 navigation |
| `src/api.ts` | Backend calls and shared types |
| `src/utils.ts` | Colors, sizes and helpers |
| `src/styles.ts` | Panel CSS |
| `tests/` | Frontend and controller input regressions |
| `plugin.json`, `package.json` | Plugin identity and version |
| `.github/workflows/build.yml` | Build and release automation |
| `RELEASE_NOTES.md` | Release description |

Build with `pnpm install` followed by `pnpm build`. Run `pnpm typecheck`, `pnpm test` and `pnpm test:backend` (Python 3.7+). Tests simulate input; also verify Select + A/B/X/Y, Select + RT, QAM open/closed and L1/R1 navigation on the device.

## Credits

| Project | Author | Contribution |
|---|---|---|
| [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) | [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx) | Original project |
| [Steamcord](https://github.com/Necrosiak/Steamcord) | [Necrosiak](https://github.com/Necrosiak) | Controller input reference (BSD-3-Clause) |
| [MAKO](https://github.com/eugeniosegala/MAKO) | [Eugenio Segala](https://github.com/eugeniosegala) | Visual reference for panels and tabs |

Thanks to the **Decky Loader** community for its support and handheld tools.

## License

Distributed under the **BSD 3-Clause** license. See [LICENSE](LICENSE).
