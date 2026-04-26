# Aerogel Pro Design System

## Principles

- One flagship dark mode, not a diluted collection of near-duplicates
- Glass plus elevation instead of convex/concave clay shadows
- Semantic state color roles instead of ad hoc per-card colors
- Reusable tokens first, overrides second

## Core Structure

- **Base modes**: Graphite, Light, AMOLED
- **Accent packs**: Rose, Lavender, Mint, Amber, Slate
- **Specialized variants**: Neon, High Contrast, Morning, Day, Evening, Night, Wall Panel

## Token Groups

### Elevation

- `--aerogel-elevation-0`
- `--aerogel-elevation-1`
- `--aerogel-elevation-2`
- `--aerogel-elevation-3`
- `--aerogel-elevation-glass`

### Glass

- `--aerogel-glass-bg`
- `--aerogel-glass-blur`
- `--aerogel-glass-saturate`
- `--aerogel-glass-border`

### Shape

- `--aerogel-radius-sm`
- `--aerogel-radius-md`
- `--aerogel-radius-lg`
- `--aerogel-radius-xl`
- `--aerogel-radius-full`

### Motion

- `--aerogel-transition-fast`
- `--aerogel-transition-normal`
- `--aerogel-transition-slow`

### Semantic States

- `--aerogel-state-on`
- `--aerogel-state-heat`
- `--aerogel-state-cool`
- `--aerogel-state-eco`
- `--aerogel-state-warning`
- `--aerogel-state-alert`
- `--aerogel-state-unavailable`

## Compatibility

The old `--aerogel-convex-*` and `--aerogel-concave-*` hooks still exist and map to the new elevation/inset system so older card-mod snippets do not hard-break.
