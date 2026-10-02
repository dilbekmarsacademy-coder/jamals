# ApexSAT — *Master the Score. Own the Journey.*

Gamified SAT prep platform: video lessons with timestamped notes, SAT-style practice with a split-screen test interface, weekly leagues, an attendance tracker and a spaced-repetition Mistake Bank. Frontend-only — all progress lives in the browser (localStorage), and the app ships with a seeded demo student (Level 14, 14-day streak, Diamond League).

Interface languages: **O‘zbekcha / Русский / English** (switcher in the top bar). Dark theme by default, light theme toggle.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # type-checks and builds
npm run lint
```

Reset the demo any time: avatar menu → **Reset demo progress**.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Radix UI primitives (shadcn-style components in `src/components/ui`) · Lucide · Framer Motion · canvas-confetti · Zustand (`persist`) · TanStack Query · React Hook Form + Zod.

## Routes

| Route | What's there |
|---|---|
| `/dashboard` | Profile, level/XP bar, streak + freezes, live SAT countdown, Today's Mission, predicted score (Math / R&W), mini league, weekly attendance dots, homework snapshot, Cipher coaching |
| `/lessons`, `/lessons/[id]` | Custom YouTube player (speed 0.75–2x, scrub bar with chapter markers, ±10s, fullscreen, keyboard), Smart Notes (timestamped, click to jump), Resources (downloads + formula accordion), Complete & Continue → XP modal → homework |
| `/homework`, `/homework/[id]` | Kanban with `NOT_STARTED` / `IN_PROGRESS` / `OVERDUE` (pulsing, −20% XP) / `COMPLETED`, filters, briefing + results review |
| `/homework/[id]/take` | Split-screen test: passage highlight/strikethrough, answer eliminator, mark for review, 1–20 navigator, timer, floating draggable scientific calculator + grapher, submit → score, XP, domain/difficulty breakdown, explanations |
| `/leaderboard` | Bronze → Master tiers, podium, promotion/demotion zones, pinned "you" row, weekly reset countdown, 12 badges with progress tooltips |
| `/attendance` | Year (GitHub-style) and month heatmaps, KPIs, Ivy League Masterclass perk (>90%), session log (Attended / Late / Missed / Bonus) |
| `/mistakes`, `/mistakes/retry` | Weak-spots analyzer per SAT domain, Leitner boxes (1 → 3 → 7 days), retry mode with immediate feedback |

## Structure

```
src/
  app/(app)/…        pages inside the sidebar shell
  app/(focus)/…      distraction-free test + retry screens
  components/        ui/ (primitives), brand/ (logo, Cipher mascot), layout/, common/, feature folders
  data/              lessons, homework, question bank (math is generated from seeded templates), leagues, badges, demo seed
  store/             useApex (persisted progress + game rules), fx (XP floats, toasts, celebrations)
  lib/               pure logic: levels, streak, srs, badges, attendance, calc (safe expression parser), dates
  i18n/              typed dictionaries — uz.ts / ru.ts must cover every key in en.ts (compile-time)
  hooks/             derived selectors, TanStack Query hooks, YouTube player, clock
```

## Going to a backend

Catalog data is read through `src/lib/api.ts` + TanStack Query hooks (`src/hooks/queries.ts`) — swap those function bodies for `fetch()` calls. Student progress actions live in `src/store/useApex.ts`; game rules (`lib/levels.ts`, `lib/srs.ts`, `lib/badges.ts`, `lib/homework.ts`) are pure functions that can move server-side unchanged.

## Notes

- Lesson videos are public YouTube SAT lessons; copyright belongs to their creators. Chapter markers are ApexSAT's own study outline.
- Reading & Writing passages and questions are original; math items are generated deterministically from templates, so every set is stable between reloads.
