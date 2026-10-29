# Stonetop Character Sheet

Offline-first PWA character sheet for the Stonetop TTRPG. Full plan: PLAN.md.

## Stack
TypeScript, React, Vite, vite-plugin-pwa, Zustand, Dexie (IndexedDB), Vitest.
Tauri 2 will wrap the build for Windows later, so: no Node-only APIs in src/.

## Rules
- Primary target: iPad Safari, landscape and portrait. Tap targets >= 44px. No hover-only UI.
- Paper look: off-white bg, dark ink text, ruled-line inputs, serif headings.
- Every edit autosaves. Never lose data; bump schemaVersion and add a migration on model changes.
- Rules values (debilities, load, XP) live only in src/model/rules.ts.
- Do not add Stonetop rulebook text to the repo. Templates in /templates are gitignored.
- Keep components small; logic in model/ and store/, not in components.
- Run `npm run test` and `npm run build` before saying a phase is done.
