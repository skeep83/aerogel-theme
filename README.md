# Aerogel Pro

Premium visual system for Home Assistant with glass surfaces, graphite depth, adaptive accents, and polished custom cards.

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1+-41BDF5?style=flat-square&logo=home-assistant)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange?style=flat-square)](https://hacs.xyz/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

![Aerogel Preview](images/preview.png)

## Three Core Modes

- **Aerogel Pro Graphite**: flagship dark mode with aurora depth and premium glass surfaces
- **Aerogel Pro Light**: bright daytime mode with lighter glass, softer contrast, and the same token system
- **Aerogel Pro AMOLED**: true-black mode for OLED panels and night dashboards

Legacy selectors stay available for compatibility:

- `Aerogel` and `Aerogel Dark` now point to Graphite
- `Aerogel Light` points to Pro Light
- `Aerogel AMOLED` points to Pro AMOLED
- `Aerogel Rose`, `Lavender`, `Mint`, `Amber`, and `Slate` remain available as accent-driven variants

## What Changed In v5

- Rebuilt `themes/aerogel.yaml` around shared card-mod anchors instead of repeated per-theme blocks
- Replaced the old clay-style neumorphism with elevation, glass, border, and semantic state tokens
- Switched the typography stack to Inter by default, while preserving `--aerogel-font` as an override point
- Refreshed the bundled Lovelace cards to match the new glass/elevation language
- Added a wall-panel variant and trimmed the card-mod snippet collection down to focused, reusable patterns

## Installation

### HACS

1. Add `https://github.com/skeep83/aerogel-theme` as a custom theme repository.
2. Install Aerogel Pro.
3. Reload themes in Home Assistant.
4. Pick `Aerogel Pro Graphite`, `Aerogel Pro Light`, or `Aerogel Pro AMOLED` from your profile.

### Manual

1. Copy [themes/aerogel.yaml](/Users/cashm/OneDrive/фото/Desktop/neumorphic-bliss/aerogel-theme/themes/aerogel.yaml) into `/config/themes/`.
2. Make sure Home Assistant loads themes with:

```yaml
frontend:
  themes: !include_dir_merge_named themes
```

3. Reload themes and select a mode.

## Custom Cards

Aerogel Pro currently ships nine bundled Lovelace cards in [dist/aerogel-cards.js](/Users/cashm/OneDrive/фото/Desktop/neumorphic-bliss/aerogel-theme/dist/aerogel-cards.js):

- `aerogel-glass-card`
- `aerogel-neon-card`
- `aerogel-entity-card`
- `aerogel-gradient-card`
- `aerogel-weather-card`
- `aerogel-tile-card`
- `aerogel-room-card`
- `aerogel-climate-card`
- `aerogel-energy-card`

Install them as a Lovelace resource:

1. Copy `dist/aerogel-cards.js` to `/config/www/aerogel-cards.js`.
2. Add `/local/aerogel-cards.js` as a JavaScript module resource.
3. Refresh the dashboard editor to see the cards in the picker.

## Card-Mod

Aerogel Pro is strongest with [card-mod](https://github.com/thomasloven/lovelace-card-mod).

- Shared theme-level styling is built into the theme file.
- Ready-to-paste examples live in [snippets/aerogel-card-mod.yaml](/Users/cashm/OneDrive/фото/Desktop/neumorphic-bliss/aerogel-theme/snippets/aerogel-card-mod.yaml).
- If backdrop blur is inconsistent in your setup, load card-mod as a frontend module as noted in the snippets file.

## Design Tokens

The theme now centers on a smaller, more systematic token set:

- Elevation: `--aerogel-elevation-0` through `--aerogel-elevation-glass`
- Glass: `--aerogel-glass-bg`, `--aerogel-glass-blur`, `--aerogel-glass-border`
- Radius: `--aerogel-radius-sm` through `--aerogel-radius-xl`
- Motion: `--aerogel-transition-fast`, `--aerogel-transition-normal`, `--aerogel-transition-slow`
- Semantic states: `--aerogel-state-on`, `--aerogel-state-heat`, `--aerogel-state-cool`, `--aerogel-state-eco`, `--aerogel-state-warning`, `--aerogel-state-alert`

Deprecated `--aerogel-convex-*` and `--aerogel-concave-*` tokens are still mapped for compatibility.

## Dashboard Starter Pack

Ready-to-customize examples now live in [dashboards](C:\Users\cashm\OneDrive\фото\Desktop\neumorphic-bliss\aerogel-theme\dashboards):

- [dashboards/aerogel-home.yaml](C:\Users\cashm\OneDrive\фото\Desktop\neumorphic-bliss\aerogel-theme\dashboards\aerogel-home.yaml)
- [dashboards/aerogel-climate.yaml](C:\Users\cashm\OneDrive\фото\Desktop\neumorphic-bliss\aerogel-theme\dashboards\aerogel-climate.yaml)
- [dashboards/aerogel-energy.yaml](C:\Users\cashm\OneDrive\фото\Desktop\neumorphic-bliss\aerogel-theme\dashboards\aerogel-energy.yaml)
- [dashboards/aerogel-wallpanel.yaml](C:\Users\cashm\OneDrive\фото\Desktop\neumorphic-bliss\aerogel-theme\dashboards\aerogel-wallpanel.yaml)

## Docs

- [docs/design-system.md](/Users/cashm/OneDrive/фото/Desktop/neumorphic-bliss/aerogel-theme/docs/design-system.md)
- [docs/color-tokens.md](/Users/cashm/OneDrive/фото/Desktop/neumorphic-bliss/aerogel-theme/docs/color-tokens.md)
- [docs/migration-v5.md](/Users/cashm/OneDrive/фото/Desktop/neumorphic-bliss/aerogel-theme/docs/migration-v5.md)

## Next Steps

This repo refresh lands the visual system foundation first. The next logical tranche is:

1. flagship room/climate/energy cards
2. starter dashboards
3. updated showcase screenshots
