# Aerogel NeoSurface Pro Design System

## Core Principle

Aerogel is no longer positioned as a glassmorphism theme.

The visual system is built around:

- solid readable surfaces
- soft 3D depth
- restrained state color accents
- minimal functional glass only where it improves hierarchy

## Surface Hierarchy

1. `background`
2. `surface`
3. `surface-raised`
4. `surface-pressed`
5. `dialog surface`

Primary rule:

- cards and dialogs must remain dense and readable
- blur is decorative, not structural

## Distribution

- `80%` solid surfaces
- `15%` NeoSurface depth
- `5%` glass / blur / glow

## Theme Set

- **Aerogel Pearl**
- **Aerogel Graphite**
- **Aerogel Obsidian**

## Token Families

### Surface

- `--aerogel-bg`
- `--aerogel-surface`
- `--aerogel-surface-raised`
- `--aerogel-surface-pressed`

### Typography

- `--aerogel-text-primary`
- `--aerogel-text-secondary`
- `--aerogel-text-muted`

### Shape

- `--aerogel-radius-card`
- `--aerogel-radius-button`
- `--aerogel-radius-dialog`

### Depth

- `--aerogel-shadow-dark`
- `--aerogel-shadow-light`
- `--aerogel-shadow-raised`
- `--aerogel-shadow-soft`
- `--aerogel-shadow-pressed`
- `--aerogel-shadow-hover`

### State colors

- `--aerogel-state-on`
- `--aerogel-state-active`
- `--aerogel-state-heating`
- `--aerogel-state-cooling`
- `--aerogel-state-eco`
- `--aerogel-state-warning`
- `--aerogel-state-error`
- `--aerogel-state-unavailable`

## Where Glass Is Allowed

- sidebar
- top header
- floating badges
- weather decorative hero layer
- modal scrim
- ambient background blobs

## Where Glass Is Not Allowed

- main cards with text
- more-info dialog body
- room cards
- climate cards
- energy cards
- settings panels
- history/map/info surfaces
