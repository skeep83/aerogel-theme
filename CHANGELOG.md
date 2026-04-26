# Changelog

## v6.1.2 — Altal Neumorphism Alignment

This release aligns Aerogel Theme with the visual language of `skeep83/altal_heater_card` while keeping the existing theme names intact.

### Changed

- Applied Altal-style neumorphic surface system to the main Home Assistant theme.
- Kept the existing themes: `Aerogel Pearl`, `Aerogel Graphite`, and `Aerogel Obsidian`.
- Added Altal-compatible tokens:
  - `--aerogel-base`
  - `--aerogel-base-alt`
  - `--aerogel-text`
  - `--aerogel-text-secondary`
  - `--aerogel-accent`
  - `--aerogel-warning`
  - `--aerogel-convex-lg`
  - `--aerogel-convex-sm`
  - `--aerogel-concave-lg`
  - `--aerogel-concave-sm`
  - `--aerogel-flat`
  - `--aerogel-active`
- Reworked `ha-card`, Mushroom cards, tile cards, buttons, chips, header, sidebar and dialogs to use solid neumorphic surfaces.
- Replaced destructive transparency on readable UI surfaces with solid backgrounds.
- Added convex effect for cards and buttons.
- Added concave/inset effect for active, pressed and inner elements.
- Improved more-info dialog readability by removing glass/blur from the dialog body.

### Fixed

- Fixed unreadable translucent cards and pop-up windows.
- Fixed washed-out glass surfaces on standard Home Assistant cards.
- Fixed loss of 3D depth after the previous NeoSurface redesign.
- Fixed theme mismatch between Aerogel Theme and Altal Heater Card.

### Upgrade notes

After updating through HACS or Git, reload Home Assistant themes and clear browser cache if old CSS is still visible.
