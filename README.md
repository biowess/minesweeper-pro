<div align="center">

# Minesweeper Pro

A sleek, neon-lit Minesweeper built with a modern React stack and a clean, performance-aware UI.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-biowess.github.io%2Fminesweeper--pro-7c3aed?style=for-the-badge\&logo=github)](https://biowess.github.io/minesweeper-pro)
[![Stack](https://img.shields.io/badge/Stack-React_%2B_TypeScript_%2B_Vite-0f172a?style=for-the-badge)](#stack)

</div>

## Stack

* **React 19** — component-driven UI
* **TypeScript** — typed game logic and UI state
* **Vite** — fast local development and production builds
* **Tailwind CSS v4** — utility-first styling
* **Zustand** — lightweight game state management
* **Motion** — smooth transitions and micro-interactions
* **react-zoom-pan-pinch** — zooming and panning the board
* **Lucide React** — icon set for HUD, actions, and status

## What this is

Minesweeper Pro is a modern take on the classic puzzle game. The goal is still familiar: reveal every safe cell without triggering a mine. What changes here is the presentation — a moody sapphire interface, glassy panels, animated feedback, and a stronger focus on clarity and flow.

## How the game works

The rules follow classic Minesweeper logic:

1. **The first click is safe.** Mines are only placed after your first move, so the opening click never loses the game.
2. **Each number tells a story.** A revealed number shows how many mines touch that cell in the 8 surrounding directions.
3. **Empty spaces spread automatically.** Clicking a zero triggers a flood-fill reveal, uncovering connected safe cells until numbered borders appear.
4. **Flags are for uncertain cells.** You can mark suspected mines with a flag instead of revealing them.
5. **Win by clearing all safe cells.** Once every non-mine cell is revealed, the game ends in victory and the remaining mines are auto-flagged.
6. **Lose by hitting a mine.** Triggering a mine ends the round immediately and reveals the board state.

### Controls

* **Left click / tap:** reveal a cell
* **Right click:** place or remove a flag
* **Long press on touch devices:** flag a cell
* **Restart button:** start a fresh board
* **Settings panel:** switch difficulty and performance mode

## UI philosophy

The interface is designed to feel like a compact control system rather than a toy board.

* **Clarity first.** The HUD keeps the timer, difficulty state, and stats visible without crowding the board.
* **Atmosphere without noise.** The palette leans dark and luminous so the game feels premium while still staying readable.
* **Meaningful motion.** Animations are used to reinforce actions — revealing, winning, losing, and restarting all have distinct feedback.
* **Responsive by design.** The board supports zooming and panning, so larger layouts remain usable on smaller screens.
* **Performance-aware styling.** A low-performance mode reduces visual effects for smoother rendering on weaker devices.

## Key features

* Safe first click with configurable safe radius
* Beginner, intermediate, and expert difficulty presets
* Timer, mine counter, cleared-cell count, and efficiency stats
* Flagging system for careful play
* Game-over and win states with animated feedback
* Splash screen and polished system-style HUD
* Mobile-friendly interaction, including long-press flagging
* Performance mode for lighter rendering

## Project structure

```txt
src/
├─ features/minesweeper/
│  ├─ engine/     # board generation, reveal logic, win checking
│  ├─ hooks/      # timer logic
│  ├─ state/      # Zustand store
│  └─ ui/         # board, cells, top bar, settings, modals
├─ shared/        # reusable hooks and utilities
└─ App.tsx        # app shell and layout
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## License

Built for learning, experimentation, and play.
