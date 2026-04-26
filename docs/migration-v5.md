# Migrating To Aerogel Pro v5

## Theme Names

These legacy names still work in v5:

- `Aerogel`
- `Aerogel Dark`
- `Aerogel Light`
- `Aerogel AMOLED`
- `Aerogel Rose`
- `Aerogel Lavender`
- `Aerogel Mint`
- `Aerogel Amber`
- `Aerogel Slate`

Preferred new selectors:

- `Aerogel Pro Graphite`
- `Aerogel Pro Light`
- `Aerogel Pro AMOLED`
- `Aerogel Pro Wall Panel`

## Visual Changes

- Heavy dual-shadow neumorphism has been replaced by thinner glass borders and elevation shadows.
- Typography now defaults to Inter.
- Accent variants inherit the Graphite system instead of shipping as full duplicated themes.

## Token Changes

New token families:

- `--aerogel-elevation-*`
- `--aerogel-glass-*`
- `--aerogel-state-*`

Compatibility aliases remain for:

- `--aerogel-convex-*`
- `--aerogel-concave-*`

## Recommended Update Path

1. Switch to one of the three core Pro modes.
2. Re-test any custom `card_mod` blocks that relied on the old convex/concave look.
3. Replace old shadow usage with the new elevation tokens over time.
