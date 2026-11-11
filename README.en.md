<h1 align="center">🎯 Crosshair Plugin</h1>

<p align="center"><b>A customizable crosshair for Decky Loader, designed for Steam Deck, Legion Go and other handheld PCs.</b></p>

<p align="center">
  <a href="https://github.com/Havok027/crosshair-plugin/releases/latest"><img src="https://img.shields.io/github/v/release/Havok027/crosshair-plugin?label=version&color=2ea44f&style=for-the-badge" alt="Version" /></a>
  <a href="https://github.com/Havok027/crosshair-plugin/releases"><img src="https://img.shields.io/github/downloads/Havok027/crosshair-plugin/total?label=downloads&color=1a9fff&style=for-the-badge" alt="Downloads" /></a>
  <a href="https://decky.xyz"><img src="https://img.shields.io/badge/Decky%20Loader-plugin-9b5cff?style=for-the-badge" alt="Decky Loader" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-BSD--3-ff007b?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">🇧🇷 <a href="README.md">Português</a> · 🇺🇸 <a href="README.en.md">English</a> · 🇪🇸 <a href="README.es.md">Español</a></p>

<p align="center"><img src="https://github.com/user-attachments/assets/2a8a1378-ad2d-41a8-b484-789cc49682d4" alt="Crosshair Plugin interface" width="100%" /></p>

<p align="center"><a href="https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip">📦 Download</a> · <a href="#-how-to-use">🚀 How to use</a> · <a href="#-controller-button-shortcut">🎮 Shortcut</a> · <a href="#-troubleshooting">🩺 Troubleshooting</a> · <a href="#-roadmap">📍 Roadmap</a></p>

---

## 📑 Contents

[✨ Highlights](#-highlights) · [📦 Installation](#-installation) · [🚀 How to use](#-how-to-use) · [🎮 Controller button shortcut](#-controller-button-shortcut) · [🎨 Shapes and colors](#-shapes-and-colors) · [📺 Resolutions](#-resolutions) · [🔧 How it works](#-how-it-works) · [🩺 Troubleshooting](#-troubleshooting) · [📍 Roadmap](#-roadmap) · [📜 Version history](#-version-history) · [🤝 Contributing](#-contributing) · [💡 Credits](#-credits)

## ✨ Highlights

| Feature | Description |
|---|---|
| 🎯 **7 crosshair shapes** | Box, Dot, Ring, X, Star, Brackets and Lines, selected from a list |
| 🎨 **Colors and size** | 8 presets, custom RGB and scaling from 50% to 300% |
| 📐 **Center-based scaling** | The crosshair grows from its center without shifting (optional calibration) |
| 🕹️ **Controller shortcut** | Record 2 controller buttons to toggle the crosshair without opening the menu |
| 🕶️ **Per-game profiles** | Shape, color, size and position saved for each game and applied on launch |
| ♻️ **MangoHud preserved** | The previous performance overlay is restored when the crosshair is disabled |
| 🧭 **Fine positioning** | X and Y sliders (-200 to +200), saved per shape |
| 📺 **Multiple screens** | Steam Deck, Legion Go S, Legion Go, 1080p and 4K |
| 🔄 **Easy updates** | Automatic releases and Direct Updater compatibility |

## 📦 Installation

1. Download [`Crosshair.zip`](https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip) from the [Releases page](https://github.com/Havok027/crosshair-plugin/releases).
2. In **Decky Loader**, open **Settings** and enable **Developer Mode**.
3. Under **Developer**, choose **Install Plugin from ZIP** and select `Crosshair.zip`.
4. If the plugin does not appear, restart Decky or the device.

> [!TIP]
> **Updates:** after the first installation, the plugin is recognized by **Direct Updater**. If the source is not found, tap the **?** next to Crosshair, choose **Find source**, and enter `Havok027/crosshair-plugin`.

## 🚀 How to use

1. Open the **Decky Loader** menu and select **Crosshair Plugin**.
2. Choose your screen **resolution**.
3. Choose the **shape**, **color** and **size**.
4. Enable **Show crosshair**.
5. If the crosshair is not centered, use the **Horizontal (X)** and **Vertical (Y)** sliders.
6. *(Optional)* With a game running, select **Save profile for this game**.

**Panel sections:**

| Section | Contents |
|---|---|
| **Crosshair** | Status summary (enabled, shape, size, color) and the *Show crosshair* toggle |
| **Appearance** | Shape, color (carousel and slider or RGB), size shortcuts and size slider |
| **Display & position** | Resolution, X/Y sliders, reset adjustment and advanced *Scale calibration* |
| **Button shortcut** | Record, remove, hold duration and diagnostics |
| **Game profile** | Save, update and delete profiles, and apply them when a game starts |

> [!NOTE]
> In the **Color** section, use left and right to change the color immediately; the selected color stays in the center of the carousel. Up and down change sections.

## 🎮 Controller button shortcut

Toggle the crosshair using a combination of **2 controller buttons**, without opening the menu.

**Recording a combination:**

1. In **Button shortcut**, select **Record combination**.
2. Press the 2 buttons **together**, then release them (within 12 seconds). The menu may remain open.
3. The crosshair flashes twice when the combination is recorded.
4. Pressing both buttons again toggles the crosshair.

**Hold duration** ranges from 0 to 1000 ms. The default is 0 (instant). Increase it to prevent accidental activation.

**Where each button is read:**

| Buttons | Menu open | In game |
|---|:---:|:---:|
| A, B, X, Y and D-pad | ✅ | ✅ |
| L4, L5, R4, R5 (Steam Deck and Steam Controller) | ✅ | ✅ |
| LB, RB, LT, RT, Menu and View | ✅ | 🧪 under validation |
| L3, R3 and extra buttons on other controllers | ✅ | ⚠️ depends on Steam |

> [!NOTE]
> **How it works:** the combination is recorded through the Steam interface. Outside the menu, the plugin reads the controller directly from the system. If the same press arrives through both paths, it is counted only once.

> [!TIP]
> **Diagnostics:** the shortcut card shows the **last group of buttons read in game**, including their names and numbers. Press the combination in game, open the menu and check whether it appears.

## 🎨 Shapes and colors

**Crosshair shapes:**

| Shape | Preview | Description |
|---|:---:|---|
| Box | <code>&#124; + &#124;</code> | Frame around the center |
| Dot | <code>+</code> | Classic crosshair |
| Ring | <code>O</code> | Open circular sight |
| X | <code>x</code> | Minimal |
| Star | <code>*</code> | Small marker |
| Brackets | <code>[ + ]</code> | Highlights the center |
| Lines | <code>- + -</code> | Side lines |

**Preset colors:**

| Color | Code | Color | Code |
|---|---|---|---|
| 🩷 Pink | `#FF007B` | 🩵 Cyan | `#00E5FF` |
| 💚 Green | `#00FF66` | 💜 Purple | `#9B5CFF` |
| ❤️ Red | `#FF2D2D` | 🧡 Orange | `#FF8A00` |
| 💛 Yellow | `#FFE600` | 🤍 White | `#FFFFFF` |

You can also create any color using **Custom RGB color**.

## 📺 Resolutions

| Display | Resolution |
|---|---|
| Steam Deck | 1280 x 800 |
| Legion Go S | 1920 x 1200 |
| External 1080p monitor | 1920 x 1080 |
| Legion Go | 2560 x 1600 |
| External 4K monitor | 3840 x 2160 |

> [!NOTE]
> The newer shapes (Ring, X, Star, Brackets and Lines) use **estimated** centering. If a shape is slightly off-center, adjust it with the X and Y sliders. Adjustments are saved per shape.

## 🔧 How it works

The plugin writes a **MangoHud** configuration that draws the crosshair as text (`custom_text`), using its color (`text_color`), size (`font_size`) and position (`offset_x` and `offset_y`).

| Step | What happens |
|---|---|
| **Enable crosshair** | The plugin saves the existing MangoHud configuration and writes the crosshair settings |
| **Disable crosshair** | The previous MangoHud configuration is restored exactly |
| **Steam changes the file** | When you change performance settings, the plugin avoids overwriting Steam's changes |
| **Restart Decky** | The crosshair starts disabled and the overlay is restored |
| **Change size** | Position is recalculated so the crosshair grows from its center |

**Limitations:**

| Limitation | Details |
|---|---|
| Performance overlay | It cannot be used together with the crosshair; both use the same MangoHud configuration |
| Other plugins | May conflict with plugins that also modify MangoHud (such as *MangoPeel*) |
| Automatic profiles | Depend on Steam notifying the plugin when a game starts |
| In-game shortcut | Depends on which controller inputs Steam forwards to the device's virtual controller |

## 🩺 Troubleshooting

| Issue | Likely cause | What to do |
|---|---|---|
| Crosshair is off-center | Estimated centering for the shape | Adjust X and Y. For both axes, use *Scale calibration* |
| Crosshair moves when changing size | MangoHud internal margins | Follow the 3 steps in the *Scale calibration* card |
| Shortcut does not work outside the menu | Steam did not forward the buttons to the game | Check *last button read in game* on the card and record another combination (A, B, X, Y or D-pad) |
| Shortcut does not work even in the menu | Old combination or hold duration too high | Record again and set *Hold duration* to 0 |
| Performance overlay disappeared | Crosshair is enabled | Disable the crosshair to restore MangoHud |
| Profile is not applied when a game starts | Steam did not notify the plugin | Open the plugin and check *Apply profile when game starts* |
| *Failed to fetch dynamically imported module* | Source code was installed without the `dist` folder | Install `Crosshair.zip` from the Releases page |
| Direct Updater says *Source not found* | Older installation | **?** > **Find source** > `Havok027/crosshair-plugin` |

Plugin logs are located at `~/homebrew/logs/Crosshair/`.

## 📍 Roadmap

| Status | Item | Details |
|:---:|---|---|
| ✅ | Legion Go S support | 1920 x 1200 resolution |
| ✅ | Colors, size and new shapes | RGB, 50%–300% scaling and 7 shapes |
| ✅ | Per-game profiles | Applied when a game starts |
| ✅ | Center-based scaling | With optional per-shape calibration |
| ✅ | Controller shortcut | Recording through the interface and in-game input reading |
| ✅ | MangoHud preserved | Previous overlay returns when the crosshair is disabled |
| ✅ | Releases and Direct Updater | Automatic build and publishing |
| 🔄 | Validate in-game input | LB, RB, LT, RT, Menu and View |
| 🧭 | L3, R3 and rear buttons | In-game reading for non-Valve controllers |
| 🧭 | Automatic calibration | Center each shape without manual adjustment |
| 💡 | Opacity and outline | Better visibility in bright scenes |
| 💡 | Automatic resolution | Detect the display without manual selection |
| 💡 | More shapes | New crosshair arms and designs |
| 💡 | English translation | README and interface |
| 💡 | Decky Store | Publish the plugin in the official store |

> [!NOTE]
> Legend: ✅ completed · 🔄 in progress · 🧭 planned · 💡 idea. The roadmap is a list of intentions, without dates.

## 📜 Version history

| Version | Highlights |
|:---:|---|
| **1.7** | Previous MangoHud configuration restored when disabling the crosshair · expanded in-game input reading (LB, RB, LT, RT, Menu and View) · shortcut works with the menu open · last-button diagnostics |
| **1.6** | Shortcut redesigned (recording through the interface) · color carousel controlled with left and right · preview removed |
| **1.5** | First controller shortcut version · refreshed interface |
| **1.4** | Center-based scaling · modular code and folders · Direct Updater compatibility |
| **1.3** | Dropdown shape selector · position sliders · per-game profiles |
| **1.2** | Legion Go S support · colors, size and new shapes |

Full release notes are available on the [Releases page](https://github.com/Havok027/crosshair-plugin/releases).

## 🤝 Contributing

Found a problem or have an idea? Open an [issue](https://github.com/Havok027/crosshair-plugin/issues). It helps to include:

- your device and screen resolution;
- the plugin version;
- a photo of the panel, or of the shortcut card for controller issues;
- the last lines from `~/homebrew/logs/Crosshair/`.

<details>
<summary><b>📂 Project structure</b></summary>

| File | Purpose |
|---|---|
| `main.py` | Python backend: settings, positioning, MangoHud and controller input |
| `src/index.tsx` | Plugin entry point |
| `src/Content.tsx` | Main panel |
| `src/components.tsx` | Panel UI components |
| `src/hotkey.ts` | Controller shortcut (frontend) |
| `src/api.ts` | Types and backend calls |
| `src/utils.ts` | Colors, sizes and helper functions |
| `src/styles.ts` | Panel CSS |
| `plugin.json` and `package.json` | Identity, version and repository metadata |
| `.github/workflows/build.yml` | Builds and publishes the release |
| `RELEASE_NOTES.md` | Release description |

To build locally: `pnpm install`, then `pnpm build`.
</details>

## 💡 Credits

| Project | Author | Contribution |
|---|---|---|
| [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) | [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx) | Original project and foundation for this plugin |
| [Steamcord](https://github.com/Necrosiak/Steamcord) | [Necrosiak](https://github.com/Necrosiak) | Controller button input reading (BSD-3-Clause) |

Thanks to the **Decky Loader** community for its support and tools for handheld PCs.

## 📄 License

Distributed under the **BSD 3-Clause** license. See the [LICENSE](LICENSE) file.
