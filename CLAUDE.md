# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Impostor de Fútbol" is a local multiplayer party game (pass-the-device) inspired by Among Us, themed around football/soccer players. It's a vanilla JavaScript SPA with no build tools or npm dependencies. Bilingual (Spanish/English).

## Development & Deployment

There is no build step, test runner, or linter. The app is pure HTML/CSS/JS served as static files.

```bash
# Run locally with Docker
docker compose up -d --build

# Development with hot reload (volume-mounted)
# Default port: 8080 → http://localhost:8080
# Production: change port mapping in docker-compose.yml to 80:80

# Rebuild after changes
docker compose up -d --build

# View logs
docker compose logs -f
```

Alternatively, open `src/index.html` directly in a browser for quick testing (no server required).

## Architecture

### Entry Point & Script Load Order

`src/index.html` loads scripts in this order (order matters):
1. **`src/js/i18n.js`** — Translation system with `t(key)` function. Uses `data-i18n` HTML attributes and `localStorage` for language persistence.
2. **`src/js/players-db.js`** — Database of 30 footballers, each with `nombre`, `equipo`, `nacionalidad`, `posicion`, and 5 `pistas` (hints).
3. **`src/js/game.js`** — `Game` class managing state: player setup, role assignment (impostor vs normal), voting, and results. Two modes: Classic (fixed impostor count) and Chaos (random count).
4. **`src/js/app.js`** — UI controller handling screen navigation (`showScreen(id)`), text updates (`updateTexts()`), name input, role reveal flow, voting flow, and results display.

### Game Flow

Splash → Home → Settings/Setup → Player Names → Role Reveal (pass device) → Discussion (2min timer) → Voting (pass device) → Results → Play Again/Menu

### Screen System

UI uses screen-based navigation with CSS class toggling (`hidden`/`active`). Screen IDs: `screen-splash`, `screen-home`, `screen-settings`, `screen-setup`, `screen-names`, `screen-role-pass`, `screen-discussion`, `screen-vote-pass`, `screen-results`.

### Internationalization

All user-facing strings go through `t(key)` from `i18n.js`. The `TRANSLATIONS` object holds ES/EN pairs. HTML elements use `data-i18n="key"` for automatic translation via `updateTexts()`.

### Styling

`src/css/styles.css` — Football-field green theme (#0d6b2e), Google Fonts (Bangers for headings, Nunito for body), mobile-first responsive design (breakpoint at 400px), CSS animations for transitions.

## Infrastructure

- **Docker**: `nginx:alpine` serving static files from `src/`
- **Nginx**: SPA routing (`try_files $uri $uri/ /index.html`), 1-day cache for static assets
- **No backend**: Entirely client-side
