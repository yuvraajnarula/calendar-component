# Calendar Notes Project

This is a small Next.js calendar app with a notes section tied to specific date ranges.

## What I changed

- Implemeneted the notes storage model so notes are now stored by exact selected date range instead of by month.
- Added auto-save behavior with a 2-second debounce so notes are saved automatically after the user stops typing.
- Added save/clear state feedback to improve UX.
- Kept the calendar and notes components separate for a clean component structure.

## Important files

- `components/calendar-grid.tsx` — date range selection calendar UI
- `components/notes-section.tsx` — notes editor and localStorage persistence
- `app/page.tsx` — main page wiring the calendar and notes components together

## How to run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser at:

```bash
http://localhost:3000
```