# Score Counter

Multi-game card and board game score counter. Mobile-first web app for tracking scores at the pub table.

## Architecture

- Pure static site: HTML, CSS, JavaScript. No backend, no database, no authentication.
- Hosted on GitHub Pages (public repo). URL: `jhlubek.github.io/score-counter`.
- All game state and history stored in browser localStorage.
- Tailwind CSS via standalone CLI binary for styling.
- Vanilla JavaScript — no frameworks, no bundlers.
- Each game lives in its own folder with its own `AGENTS.md` containing game-specific rules and behavior.

## File Structure

```
score-counter/
  AGENTS.md                -- this file: project-wide architecture and conventions
  TODO.md                  -- candidate games for future implementation
  index.html               -- landing page with game list
  hearts/
    AGENTS.md              -- Hearts-specific rules and behavior
    index.html
    app.js
    tests/
      game_logic_test.js
  generic/
    AGENTS.md              -- Generic Counter spec
    index.html
    app.js
  shared/
    i18n.js                -- shared i18n utilities
    theme.js               -- shared dark mode logic
    input.css              -- Tailwind source
    output.css             -- built Tailwind CSS
  .github/
    workflows/deploy.yml   -- GitHub Actions: build CSS + deploy to Pages
```

## UI Approach

- Mobile-first design. Primary usage is phones at a pub table.
- Large touch-friendly buttons, minimal scrolling, easy one-hand operation.
- On desktop, content is centered with max-width (e.g. `max-w-md mx-auto`) so it doesn't stretch across a wide screen — looks like a phone app in the browser.
- Dark mode toggle with 3 states: system default (default), light, dark. Persisted in localStorage.

## Shared Features Across All Games

- Internationalization (i18n): English and Czech. Default is browser language. Language selector with flags in bottom left corner of home screen.
- Dark mode toggle in top right corner of home screen and setup screen.
- Player setup with touch-friendly drag-and-drop reordering.
- Game history: last 5 games shown on home screen, older games deleted. Clicking a history item shows read-only round details.
- Manual score entry mode as alternative to game-specific buttons.

## Code Style

- Vanilla JavaScript. No React, Vue, or other frameworks.
- Tailwind CSS for styling. Use standalone CLI binary (no Node.js dependency for CSS).
- Each game in its own folder with its own `AGENTS.md`, `index.html`, `app.js`.
- Game logic functions must be pure and exported for testing (via `module.exports` guard).

## Testing

- Unit tests for game logic using Node.js: `node <game>/tests/game_logic_test.js`.
- Test-first approach for all fixes: write a failing test, then fix the code.
- Test all common game scenarios and edge cases.

## Adding a New Game

1. Create `<game>/` folder.
2. Add `<game>/AGENTS.md` with game-specific rules, scoring, and UI behavior.
3. Add `<game>/index.html`, `<game>/app.js`.
4. Add `<game>/tests/game_logic_test.js` for game logic tests.
5. Link the new game from the landing page `index.html`.
