# Handoff: Creator Academy (build this page)

Scope: **just the Creator Academy** — login + course library, responsive (desktop reference: `Creator Academy.dc.html`, mobile reference: `Creator Academy Mobile.dc.html`). Site setup, auth provider, and DB are assumed already scaffolded. See the main `README.md` in this folder for full design tokens/system — this doc covers what's new/specific to this build pass.

## What's new since last handoff
A **"Meet your coaches"** section, between "Continue watching" and "Curriculum": a heading + two real coach intro videos — **Noel** and **Joey**, both titled "Head Coach". Desktop = 2-up grid of 16:9 cards; mobile = horizontal scroll-snap row of ~200px cards. Same visual language as lesson cards (play button, duration badge, "Intro" tag top-left, name + role below). These are **real videos to embed**, not placeholders — see Video hosting below.

## Build tasks for this page

1. **Layout** — one responsive route reflowing between the desktop and mobile references (don't ship two implementations). Login is two-state (`login` / `academy`) in the prototype; build as two real routes/pages (e.g. `/academy/login`, `/academy`) gated by auth.

2. **Auth** — wire real login (Clerk or Auth.js). Replace the prototype's `setState` flip with a real session check; redirect unauthenticated users to login; "[ name ]" and avatar pull from the logged-in user.

3. **Video hosting** — upload coach intros + all lesson videos to Mux or Cloudflare Stream (adaptive streaming, thumbnails, no custom player needed). Each video card's placeholder becomes a real thumbnail + inline/modal player on click. Durations shown (`03:20`, `06:12`, etc.) are placeholders — pull real duration from the video host's metadata.

4. **Progress tracking** — needs a DB table like `lesson_progress (user_id, lesson_id, completed_at, seconds_watched)`.
   - Top-of-page "Your progress · X% complete" = completed lessons ÷ total lessons for that user, live query.
   - "Continue watching" card = most recently-watched incomplete lesson for that user (title, module, % progress, resume position).
   - Lesson card "DONE" badge = `completed_at IS NOT NULL` for that user+lesson.
   - Course structure (modules → lessons: title, video ID, duration) should live in a `modules`/`lessons` table or CMS, not hardcoded — the prototype's `renderVals()` data (7 modules, real titles) is the seed content.

5. **Coach section** — coach data (name, role, video ID) can be hardcoded (only 2, static) or a small `coaches` table if you want it CMS-editable later.

## Data shape (from the prototype, port as seed data)
```
coaches: [{ name: 'Noel', role: 'Head Coach' }, { name: 'Joey', role: 'Head Coach' }]
modules: 00 Limitless, 01 UGC Fundamentals, 02 Filming, 03 Editing,
         04 Portfolio Creation, 05 Landing Clients, 06 Scaling
```
Full lesson titles per module are in `Creator Academy.dc.html`'s `renderVals()`.

## Files
- `Creator Academy.dc.html` — desktop reference (updated with coaches section)
- `Creator Academy Mobile.dc.html` — mobile reference (updated with coaches section)
- `README.md` — full design system (colors, type, spacing, motion, assets)
