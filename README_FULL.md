# Focus & Friends

A delightful productivity app combining focus sessions (Pomodoro/Timer) with collectible gacha-style figurines from POPMART's Nyota series.

## Features

- **Kanban Task Board** — Organize tasks across backlog, in progress, and done columns with drag-and-drop support
- **Focus Sessions** — Choose between a simple timer or Pomodoro (work + break) sessions
- **Blind Boxes** — Earn collectible figures from the Nyota series by completing focus sessions
- **Collection Management** — View and organize your collected figures by series
- **Shelf Display** — Curate and drag-reorder a display shelf of your favorite figures
- **Local Persistence** — All data (tasks, collection, shelf) is saved to localStorage

## Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Top bar with greeting, timer, session controls
│   ├── TaskBoard.tsx           # Main Kanban board container
│   ├── TaskColumn.tsx          # Individual task column (backlog/progress/done)
│   ├── TaskCard.tsx            # Individual task card with actions
│   ├── Shelf.tsx               # Shelf display of favorite figures
│   └── modals/
│       ├── SessionModal.tsx    # Modal to configure and start sessions
│       ├── AddTaskModal.tsx    # Modal to add new tasks
│       ├── BlindBoxModal.tsx   # Modal for unboxing collectibles
│       ├── CollectionModal.tsx # Modal to view full collection
│       └── SessionCompleteModal.tsx # Modal shown after session completes
├── context/
│   └── AppContext.tsx          # Global app state and actions (React Context)
├── data/
│   └── figures.ts              # Figure data (Nyota series, blind boxes)
├── hooks/
│   └── useFigures.ts           # Utility hooks for figure operations
├── services/
│   └── storage.ts              # localStorage abstraction layer
├── types/
│   └── index.ts                # TypeScript type definitions
├── App.tsx                     # Main app component with timer loop
├── index.css                   # Global styles and Tailwind imports
└── main.tsx                    # Entry point
```

## Tech Stack

- **Vite** — Fast build tool and dev server
- **React 18** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first styling
- **React Context** — State management
- **LocalStorage** — Data persistence

## Architecture

### State Management

All state is managed via React Context (`AppContext`) using `useReducer`:
- **Tasks** — List of task objects
- **Collection** — Dictionary of figure ID → count
- **Timer** — Current session state (work/break phase, time left, etc.)
- **UI State** — Modal visibility, selected figures, etc.

State changes are automatically persisted to localStorage.

### Data Layer

The `storage.ts` service provides a clean interface for persistence:
- `getState()` — Load all state from localStorage
- `setState(state)` — Persist state changes
- Can be easily swapped for a backend API later

### Components

- **Presentational** — TaskCard, TaskColumn, Header, Shelf — Pure React components receiving props
- **Connected** — TaskBoard, all modals — Use `useAppState()` and `useAppActions()` hooks to access global state

### Animations

Tailwind animations configured in `tailwind.config.js`:
- `ffBreathe` — Breathing scale animation for blind boxes
- `ffWiggle` — Wiggle rotation for decorative elements
- `ffBoxShake` — Box shaking during reveal
- `ffPop` — Pop-in effect for revealed figures
- `ffLand` — Landing effect for moved tasks
- `ffFloat` — Floating animation for atmospheric elements
- `ffModalIn` — Modal entrance animation

## Running the App

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5174` (or next available port).

## Key Implementation Details

### Timer Loop

In `App.tsx`, a `useEffect` hook runs a 1-second interval when `state.timer.running` is true, calling `tickTimer()` to decrement time. Another effect watches for `timer.left === 0` to trigger phase completion (work → break or session end).

### Task Kanban

- Tasks stored flat with a `status` field ('backlog' | 'progress' | 'done')
- TaskColumn filters by status
- Drag-and-drop using HTML5 drag events
- `justDone` state triggers landing animation on newly moved tasks

### Blind Box System

- Pending boxes stored as array of indices into the `BLIND_BOXES` array
- On unbox, `pickRandomFigure()` uses weighted randomization (common figures more likely than secrets)
- Figures added to `collection` dictionary with counts
- Secret figures trigger special animations and styling

### Collection & Shelf

- Full collection grouped by `FigureSet` in CollectionModal
- "Add to shelf" / "Remove from shelf" toggles figures in `displayed` array
- Shelf supports drag-reorder via pointer events

## Accessibility

- Semantic HTML (header, main, section, button)
- WCAG AA color contrast
- Respects `prefers-reduced-motion` system setting
- Buttons have title/aria attributes
- Keyboard navigation via native HTML buttons

## Extending the App

### Adding Multi-User Support

Replace localStorage with an API layer in `services/storage.ts`:
```ts
export const api = {
  async getState(userId: string) { /* fetch from backend */ },
  async setState(userId: string, state: AppState) { /* POST to backend */ },
};
```

### Adding More Figure Sets

Edit `src/data/figures.ts` and add to `FIGURE_SETS` array:
```ts
{
  id: 'new-set-id',
  name: 'New Figure Set',
  series: 'Series XX',
  active: true,  // Mark as active to draw from during unboxing
  figures: [ /* ... */ ],
}
```

## Notes

- All data persists automatically to localStorage on state changes
- Fully functional offline—no external APIs required
- Responsive design optimized for desktop viewing
- Pre-populated with example Nyota figures and sample tasks
- ~650KB minified + gzip

Enjoy Focus & Friends! 🎁✨
