# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Impostor de Fútbol is a mobile-first web party game (Spanish/English). Players pass a single device around — one or more players are "impostors" who don't know the secret footballer, while others do. After discussion and voting, the group tries to eliminate the impostor(s).

## Running Locally

No build step required — this is a static HTML/CSS/JS project.

**Option A — Open directly:**
```
src/index.html   # open in browser
```

**Option B — Docker (recommended for prod-like environment):**
```bash
docker compose up -d --build    # serves on http://localhost:8080
docker compose down              # stop
docker compose logs -f           # view logs
```

For production, change port mapping in `docker-compose.yml` from `"8080:80"` to `"80:80"`.

## Architecture

Single-page application with no framework. All screens are `<div>` sections in `index.html` toggled via `display: none/flex`.

**Script load order matters:** `i18n.js` → `players-db.js` → `game.js` → `app.js`

| File | Responsibility |
|------|---------------|
| `src/js/game.js` | `Game` class — core logic: role assignment, voting, results calculation |
| `src/js/app.js` | UI/screen navigation, DOM manipulation, timer, event handlers |
| `src/js/players-db.js` | Database of 33 footballers with name, team, nationality, position, and 5 clues each |
| `src/js/i18n.js` | Spanish/English translations (~70 keys), persisted in `localStorage` |
| `src/css/styles.css` | All styling — mobile-first, responsive (400px–800px+ heights) |

**Global state:** `window.game` is the singleton `Game` instance used by `app.js`.

## Game Flow

Splash → Home → Setup (players 3-10, mode, impostors) → Names → Role Reveal (pass device) → Discussion (2min timer) → Voting (pass device) → Results

Two modes: **Classic** (fixed impostor count) and **Chaos** (random 1-to-all impostors).

## Design Tokens

- Primary green: `#0d6b2e`, Accent yellow: `#ffe135`, Orange: `#e67e22`
- Fonts: **Bangers** (titles), **Nunito** (body) via Google Fonts

## Internationalization

All UI text uses `data-i18n` attributes on HTML elements. Translations live in `i18n.js` as key-value maps. Language preference is stored in `localStorage`.
