# Migrating To Aerogel NeoSurface Pro

## Theme Names

The maintained theme file is now:

- `themes/aerogel.yaml`

And it defines only:

- `Aerogel Pearl`
- `Aerogel Graphite`
- `Aerogel Obsidian`

## Biggest Visual Change

The UI is no longer glass-first.

What changed:

- cards are now solid and readable
- dialogs use dense raised surfaces
- glass is limited to sidebar, header, badges, ambient layers, and modal scrims
- soft 3D depth is back through NeoSurface shadow tokens

## If You Used Older card-mod Snippets

Update custom snippets to use:

- `--aerogel-surface`
- `--aerogel-surface-raised`
- `--aerogel-surface-pressed`
- `--aerogel-shadow-raised`
- `--aerogel-shadow-soft`
- `--aerogel-shadow-pressed`

## Recommended Upgrade Path

1. Reload themes after updating.
2. Switch to `Aerogel Graphite` first.
3. Re-check more-info dialogs and any custom cards.
4. Move old blur-heavy snippets to solid NeoSurface surfaces.
