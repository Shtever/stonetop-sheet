# Stonetop Character Sheet App — Project Plan

Oct 28, 2026 · @Shteve

## Overview & goals

Build a single-player character tracker for Stonetop that looks and feels like the paper playbook: tap a box to mark it, tap a field to type. It runs offline on iPad first and ships as a Windows desktop app later from the same codebase.

- **Feels like paper:** one scrolling sheet, ruled fields, checkboxes, no menus to dig through mid-session.
- **Fast at the table:** HP, XP, debilities and item uses change in one tap.
- **Offline and private:** all data stays on the device; no account or server.
- **Safe:** autosave on every change, plus export/import of a JSON backup.
- **One codebase:** web tech now, wrapped as a desktop app later without a rewrite.

## Recommended tech stack

Recommendation: a **Progressive Web App (PWA)** for iPad now, wrapped with **Tauri** for Windows later. A PWA installs to the iPad home screen from Safari, runs full-screen and offline, and needs no Mac, Xcode or App Store account.

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript | Catches data-model mistakes early; Claude Code works well with it |
| UI framework | React + Vite | Fast dev server, huge ecosystem, simple component model |
| Styling | Plain CSS modules (or Tailwind) | Full control over the paper look |
| Offline / install | vite-plugin-pwa | Generates the manifest and service worker |
| Storage | IndexedDB via Dexie | Survives reloads; holds multiple characters |
| State | Zustand (small store) + autosave | Minimal boilerplate |
| Hosting (iPad) | GitHub Pages, Netlify or Cloudflare Pages (free) | iPad needs an HTTPS URL to install the PWA |
| Desktop (later) | Tauri 2 | Small Windows installer, reuses the same web build |
| Tests | Vitest | Unit tests for rules math (load, HP, XP) |

Alternatives considered:

- **Native SwiftUI:** best iPad feel, but needs a Mac and does not carry over to Windows.
- **Electron for Windows:** works, but installers are 10x larger than Tauri's.
- **Tauri for iOS too:** possible, but needs a Mac, Xcode and an Apple developer account; keep as a later option.

One iPad caveat: Safari can clear storage for sites you rarely visit. Installing to the home screen mostly avoids this, and the JSON export is the backstop.

## Features & scope

The MVP covers everything on one playbook's front and back; anything that helps across characters or sessions comes later.

**MVP**

- [ ] Identity: name, playbook, level, background, origin, drive, look, instinct
- [ ] Stats: STR, DEX, CON, INT, WIS, CHA with modifiers
- [ ] Debilities as checkboxes, each linked to its stats
- [ ] HP: current/max with +/- buttons, armor, damage die
- [ ] XP track with checkboxes and a level-up prompt when full
- [ ] Moves: list of starting and advanced moves, each with a "taken" checkbox and editable text
- [ ] Spells / special resources: invocations, rites, arcana, companions — a generic list with prepared/used checkboxes and per-item notes
- [ ] Inventory: items with weight, uses as tick boxes, a running load total
- [ ] Bonds/relationships and free-form notes
- [ ] Autosave, JSON export/import

**Later**

- [ ] Multiple characters with a picker
- [ ] Playbook templates that pre-fill a new character's layout
- [ ] Dice roller (2d6 + stat, with the 6- / 7-9 / 10+ result band)
- [ ] Session log and "end of session" XP checklist
- [ ] Dark / parchment themes, print-friendly view
- [ ] Windows build via Tauri
- [ ] Optional sync (iCloud Drive / OneDrive folder) via export files

**Rules text and copyright:** Stonetop's playbook text belongs to its publisher. Don't hardcode move or spell descriptions in the repo. Build the app so you type or paste text from your own book into local templates; keep those out of any public repo.

## Data model

One `Character` record holds the whole sheet; lists (moves, spells, items) are generic so every playbook fits without special-casing. Add a `schemaVersion` from day one so old saves can be migrated.

```ts
type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

interface Character {
  id: string;
  schemaVersion: 1;
  updatedAt: string;           // ISO date
  name: string;
  playbook: string;            // e.g. 'The Lightbearer'
  level: number;
  background: string;
  origin: string;
  drive: string;
  look: string;
  instinct: string;
  stats: Record<StatKey, number>;   // modifiers, -1..+3
  debilities: Debility[];
  hp: { current: number; max: number };
  armor: number;
  damageDie: string;           // 'd6', 'd8', ...
  xp: { marked: number; needed: number };
  moves: Move[];
  resources: ResourceGroup[];  // spells, rites, arcana, companion...
  inventory: Item[];
  bonds: string[];
  notes: string;
}

interface Debility { name: string; affects: StatKey[]; marked: boolean; }

interface Move {
  id: string; name: string; text: string;
  taken: boolean; source: 'starting' | 'advanced' | 'custom';
  boxes?: { total: number; marked: number };   // moves with tick tracks
}

interface ResourceGroup {
  id: string; label: string;   // 'Invocations', 'Arcana', ...
  entries: { id: string; name: string; text: string;
             prepared?: boolean; used?: boolean;
             boxes?: { total: number; marked: number } }[];
}

interface Item {
  id: string; name: string; notes: string;
  weight: number;              // 0 = small/weightless
  carried: boolean;
  uses?: { total: number; marked: number };
  tags: string[];
}
```

The debility list, load thresholds and XP-per-level are rules values. Keep them in one `rules.ts` config so you can check them against your book and adjust in one place.

## UI layout

One sheet, two columns in iPad landscape, collapsing to one column in portrait. Section order mirrors the paper playbook so your eye knows where to go.

| Area | Contents | Interaction |
| --- | --- | --- |
| Header bar | Name, playbook, level, character switcher, export | Inline text fields |
| Left column, top | Stats grid (6 boxes) with debility checkboxes beside their stats | Tap modifier to edit |
| Left column, middle | HP (big number with − / +), max HP, armor, damage die | Large tap targets |
| Left column, bottom | XP track, bonds, background / origin / drive | Checkbox row; text areas |
| Right column, top | Moves: taken moves expanded, untaken collapsed | Checkbox + expandable text |
| Right column, middle | Spells / resources groups | Prepared / used toggles; "reset" per group |
| Right column, bottom | Inventory with load meter, item uses as boxes | Swipe or button to remove |
| Footer | Notes | Free text |

Design rules for Claude Code to follow:

- Paper look: off-white background, ink-dark text, ruled underlines instead of boxed inputs, a serif heading font.
- Every tap target at least 44 × 44 px (Apple's minimum).
- Inputs look like printed text until tapped; no visible edit mode.
- No hover-only controls (iPad has no hover).
- Big numbers (HP, armor) readable from arm's length.

## Project structure

Keep rules math and storage out of UI components, so the Tauri wrap later only touches the build config.

```
stonetop-sheet/
├─ CLAUDE.md               # project rules for Claude Code
├─ index.html
├─ vite.config.ts          # includes vite-plugin-pwa
├─ public/                 # icons, manifest assets
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ model/
│  │  ├─ types.ts          # Character, Move, Item...
│  │  ├─ rules.ts          # debilities, load, XP thresholds
│  │  └─ factory.ts        # newCharacter()
│  ├─ store/
│  │  ├─ useCharacter.ts   # Zustand store
│  │  └─ db.ts             # Dexie / IndexedDB + autosave
│  ├─ io/
│  │  └─ backup.ts         # JSON export/import + migrations
│  ├─ components/
│  │  ├─ sheet/            # StatsBlock, HpBlock, XpTrack, MovesList...
│  │  └─ ui/               # Checkbox, BoxTrack, InlineField, Stepper
│  └─ styles/              # paper theme, layout
├─ templates/              # your playbook templates (gitignored)
└─ tests/                  # Vitest
```

## Build phases

Six phases, each ending in something you can open on the iPad. Give Claude Code one phase per session and test before moving on.

1. **Scaffold:** Vite + React + TypeScript, paper theme, empty two-column sheet, deploy to a free host. *Done when:* the URL opens on the iPad.
2. **Model + storage:** types, `newCharacter()`, Dexie autosave, JSON export/import. *Done when:* edits survive closing Safari.
3. **Core sheet:** identity fields, stats, debilities, HP stepper, armor, damage die, XP track. *Done when:* you can run a fight from it.
4. **Lists:** moves, spells/resources, inventory with uses and load meter, bonds, notes. *Done when:* your full playbook fits.
5. **PWA polish:** manifest, icons, offline service worker, portrait/landscape layouts. *Done when:* it installs to the home screen and works in airplane mode.
6. **Later features:** multiple characters, templates, dice roller, then the Tauri Windows build (`npm create tauri-app` around the existing `dist/`).

## Kickoff for Claude Code

Create an empty folder, save this doc into it as `PLAN.md` (export as Markdown), add the `CLAUDE.md` below, then start Claude Code there with the first prompt.

**CLAUDE.md**

```markdown
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
```

**First prompt**

```
Read PLAN.md and CLAUDE.md. Do Phase 1 only: scaffold the Vite + React +
TypeScript project, add the paper theme and an empty two-column sheet layout
with the section headings from the UI layout table, and set up deployment to
GitHub Pages. Stop and tell me how to open it on my iPad.
```

For later phases: "Do Phase N from PLAN.md. Show me the plan before writing code."

## Open questions

- [ ] Which playbook are you playing first? Build its layout as the reference case.
- [ ] Do you have a Mac? If yes, a native iPad build via Tauri becomes an option; if no, stay PWA.
- [ ] Are you OK with a free GitHub account for hosting, or prefer Netlify/Cloudflare?
- [ ] Is Apple Pencil handwriting in notes wanted, or typing only?
- [ ] Should the sheet track steading/town items (Stonetop's village), or character only?
- [ ] Check `rules.ts` values (debilities, load, XP per level) against your book once Phase 2 lands.
