# 🫧 Aerogel — Premium Neumorphic Theme for Home Assistant

> Inspired by [Smartphone Car Control UI](https://www.figma.com/community/file/1076934576179162030) by Shivanshu Mathur

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2023.1+-41BDF5?style=flat-square&logo=home-assistant)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange?style=flat-square)](https://hacs.xyz/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A soft-UI neumorphic theme with **300+ CSS variables**, built-in **hover/press animations**, sky-blue accent, and 24px rounded cards. Install it — and your entire Home Assistant transforms.

---

## ✨ Features

- **300+ CSS variables** — every HA element covered (light & dark modes)
- **Built-in animations** — hover lift, press effect, pulse glow (via card-mod)
- **24px card radius** — ultra-modern rounded aesthetic
- **Sky-blue accent** `#6CB4EE` — fresh & clean
- **Nunito font** — friendly rounded typography from Google Fonts
- **Full card-mod integration** — animations auto-apply via `card-mod-card-yaml`
- **Deep coverage** — states, toggles, sliders, dialogs, inputs, chips, energy, code editor
- **Custom `--aerogel-*` variables** — for advanced card-mod styling

---

## 🎨 Design Tokens

| Token | Light | Dark |
|-------|-------|------|
| Base | `#E3E6EC` | `#1A1D2E` |
| Shadow Dark | `#C8CBD3` | `#12141F` |
| Shadow Light | `#FFFFFF` | `#222640` |
| Accent | `#6CB4EE` | `#6CB4EE` |
| Text | `#2C3345` | `#E8EAF0` |
| Text Secondary | `#8A90A0` | `#6A7090` |
| Warning | `#F07B3F` | `#F9A06C` |
| Success | `#27AE60` | `#2ECC71` |
| Error | `#E74C3C` | `#E74C3C` |

---

## 📋 Requirements

| Component | Required | Notes |
|-----------|----------|-------|
| Home Assistant | 2023.1+ | Core requirement |
| [HACS](https://hacs.xyz/) | Recommended | For easy installation |
| [card-mod](https://github.com/thomasloven/lovelace-card-mod) | Recommended | Enables hover/press animations |

---

## 🚀 Installation

### Option A: HACS (Recommended)

1. Open HACS → ⋮ → **Custom repositories**
2. Add repository URL:
   ```
   https://github.com/skeep83/aerogel-theme
   ```
3. Select category: **Theme**
4. Click **Add** → Find **"Aerogel"** → **Download**
5. Go to Developer Tools → YAML → **Reload Themes**
6. Profile → Theme → **Aerogel**

### Option B: Manual

1. Download [`themes/aerogel.yaml`](themes/aerogel.yaml)
2. Copy to `/config/themes/` in Home Assistant
3. Ensure `configuration.yaml` includes:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
4. Reload themes → Select **"Aerogel"**

---

## 🔧 Card-Mod Integration

The theme **automatically applies** hover and press animations to all cards when card-mod is installed. No extra config needed!

### What happens automatically:
- 🏂 **Hover** → card lifts 2px with enhanced shadow
- 👆 **Press** → card scales down with inset shadow
- 🎨 **Font** → Nunito applied globally
- 💬 **Dialogs** → 24px rounded corners

### Custom CSS Variables

For advanced styling, use these `--aerogel-*` variables in card-mod:

| Variable | Description |
|----------|-------------|
| `--aerogel-convex-{xs,sm,md,lg,xl}` | Raised shadow (5 sizes) |
| `--aerogel-concave-{xs,sm,md,lg}` | Inset shadow (4 sizes) |
| `--aerogel-hover` | Enhanced hover shadow |
| `--aerogel-active` | Press/active shadow |
| `--aerogel-flat` | Subtle flat shadow |
| `--aerogel-glow` | Sky-blue glow effect |
| `--aerogel-glow-warning` | Orange glow effect |
| `--aerogel-radius-{xs,sm,md,lg,xl,full}` | Border radius (6 sizes) |
| `--aerogel-base` | Base surface color |
| `--aerogel-base-alt` | Alternate surface |
| `--aerogel-transition` | Smooth cubic-bezier 0.3s |
| `--aerogel-transition-fast` | Quick 0.15s |

### Example: Neumorphic Tile Card

```yaml
type: tile
entity: light.living_room
card_mod:
  style: |
    ha-card {
      box-shadow: var(--aerogel-convex-md) !important;
    }
    ha-card:hover {
      box-shadow: var(--aerogel-hover) !important;
    }
    ha-card:active {
      box-shadow: var(--aerogel-active) !important;
    }
```

### Example: Pulse Glow Animation

```yaml
type: button
entity: binary_sensor.door
card_mod:
  style: |
    @keyframes aerogel-pulse {
      0%, 100% { box-shadow: var(--aerogel-convex-md); }
      50% { box-shadow: var(--aerogel-convex-md), var(--aerogel-glow); }
    }
    ha-card {
      animation: aerogel-pulse 3s ease-in-out infinite;
    }
```

> 📎 More snippets in [`snippets/aerogel-card-mod.yaml`](snippets/aerogel-card-mod.yaml)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR.

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<p align="center">
  🫧 Made with care for the Home Assistant community
</p>
