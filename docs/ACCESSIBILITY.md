# Accessibility
Settings panel: text size (90–150%), high contrast, reduce motion. Semantic landmarks (aside/nav/main/header), skip link, focus moved to main on navigation, visible 3px focus ring, labelled form fields, `aria-invalid`/`role=alert` on errors, `aria-live` for toasts and counts, `aria-pressed` on slots, status = icon + text, 44px minimum touch targets, responsive layout with bottom navigation on mobile. Limitation: not yet tested with a screen reader.

## Theme and contrast (final pass)
- Light and dark themes are CSS-variable palettes (`:root` and `[data-theme=dark]`). The theme is set before first paint from `localStorage` (`sc-theme`), falling back to the system preference.
- High contrast is always a light, black-on-white palette and overrides the theme.
- Automated check: every visible text element on every route, for all five roles, in both themes, meets WCAG AA contrast (4.5:1 body, 3:1 large text), and no un-themed white surfaces remain in dark mode.
