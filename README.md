# Nyansa

BECE and WASSCE exam prep for Ghanaian students. A web app laid out for laptops that feels like a native app on phones, installable as a PWA.

- Product: [What users do](https://claude.ai/artifact/UmBcC8vagA1WyGzZ15MVxS) · [Build plan](https://claude.ai/artifact/NmrH4YSjHPii6irpDDjvER)
- Design blueprint: [Clickable prototype](https://claude.ai/artifact/CZZUUbfwgLAY18NhNnuEyb)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 (App Router, Cache Components), React 19, TypeScript |
| Styling | Plain CSS design system ported from the prototype (`styles/`): tokens on `:root`, shared component classes, container queries |
| Accessible primitives | Radix (`radix-ui`), unstyled, for the dialog/sheet and switches |
| Client state | Zustand, persisted to the device (`lib/store.ts`) |
| PWA | `app/manifest.ts`, icons in `public/icons`, `app/icon.svg`, `app/apple-icon.png` |

Planned per the build plan: service worker + IndexedDB offline, KaTeX, Prisma/PostgreSQL, SMS sign-in, Claude API tutor and marking.

## How it is laid out

- **One frame, two layouts.** `.app` fills the viewport and is a CSS container. Under 900px it is the phone layout (floating dark tab bar, one column); from 900px it switches to the web layout (side menu, top bar, two columns, centred sheets). Use `.m-only` / `.w-only` for content that belongs to one layout.
- **Route groups** pick the shell:
  - `(onboarding)`: setup steps and the diagnostic check-in, with a step header on web
  - `(app)`: student screens inside the tab bar / side menu
  - `(parent)`: the parent dashboard
  - `(focus)`: full-screen tasks with no navigation (lesson, practice question, mock exam, link a child)
- **Content** lives in `lib/content.ts` as sample data shaped like the build plan's data model, ready to swap for API calls.
- **Saved progress** loads before first paint (`components/providers.tsx`). Time-based values use the store's `now` clock, which is null during prerender, so server and client HTML match.

## Screens

| Code | Route | Code | Route |
| --- | --- | --- | --- |
| A0 Splash | `/` | P0 Practice sets | `/practice/sets` |
| A1 Welcome | `/welcome` | P1–P2 Question + feedback | `/practice/question` |
| A2 Phone, code, name | `/setup/phone` `/setup/code` `/setup/name` | P3 Practice summary | `/practice/summary` |
| A3 Exam, class | `/setup/exam` `/setup/class` | P Practice hub | `/practice` |
| A4 Subjects | `/setup/subjects` | M1–M3 Mocks | `/mocks` `/mocks/exam` `/mocks/results` |
| A5 Date and goal | `/setup/goal` | P4 Past questions | `/past-questions` |
| A6 Data and language | `/setup/prefs` | P5 Theory marking | `/theory` |
| D1–D3 Check-in | `/check-in` `/check-in/questions` `/check-in/results` | P6 Mistakes | `/mistakes` |
| H1 Home | `/home` | T1 Tutor | `/tutor` |
| PL Study plan | `/plan` | R1 Progress | `/progress` |
| L1 Subjects | `/learn` | S3 Settings | `/settings` |
| L2 Syllabus journey | `/learn/mathematics` | G1 Link child | `/parent/link` |
| L3 Topic | `/learn/mathematics/linear-equations` | G2 Parent dashboard | `/parent` |
| L4 Lesson | `/lesson` | | |
