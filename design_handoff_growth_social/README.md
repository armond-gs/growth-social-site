# Handoff: Growth Social — Marketing Site + Creator Academy

## Overview
Growth Social is a UGC (user-generated content) agency positioned as *creator-focused, client-outcome-driven, against the grain of traditional UGC agencies*. This package covers three designs:

1. **Landing page (desktop)** — `Growth Social.dc.html`
2. **Landing page (mobile)** — `Growth Social Mobile.dc.html` (same content, phone layout, shown in an iOS device frame in the prototype — the frame is prototype-only, do **not** ship it)
3. **Creator Academy** — `Creator Academy.dc.html` — a gated login screen → course library (educational video course for the agency's creators)

## About the Design Files
The files in this bundle are **design references authored in HTML** — prototypes that show the intended look, layout, motion, and behavior. They are **not** production code to copy verbatim. They're built in a lightweight in-house template runtime (`.dc.html` files + `support.js`); **ignore that runtime**. Your job is to **recreate these designs in the target codebase's environment** using its established patterns and libraries.

If there is no existing codebase yet, a good default stack for this marketing site + gated portal is **Next.js (App Router) + React + Tailwind CSS**, with **Framer Motion** for the scroll reveals/marquees and a real auth provider for the Academy login. Any equivalent modern stack is fine.

The template syntax you'll see in the files:
- `<sc-for list="{{ items }}" as="item">…</sc-for>` = a `.map()` loop.
- `<sc-if value="{{ x }}">…</sc-if>` = conditional render.
- `{{ path }}` = data binding. Data lives in the `class Component` block at the bottom of each file (in `renderVals()`).
- `style-hover="…"` = a `:hover` style. `data-reveal` / `data-delay` = scroll-in animation hooks (see Interactions).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final. Recreate the UI pixel-accurately using the codebase's libraries. Exact tokens are listed below.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Cream (base) | `#F1F1E7` | Page background, text on dark sections |
| Cream (lighter, gradient top) | `#F6F6EE` | Top of the base radial gradient |
| Cream (darker, gradient edge) | `#EAEADD` | Bottom/edge of the base radial gradient |
| Cream (card) | `#FBFBF5` | Testimonial cards, form inputs |
| Warm grey panel | `#ECECDE` | "Why we exist" (Approach) section background |
| Brand green (primary/dark) | `#143828` | Dark sections, primary buttons, logo, accents |
| Brand green (hover darker) | `#0F2C1F` | Button hover background |
| Green tint (video placeholders) | `#16281F` / `#1D3327` | Diagonal-stripe placeholder gradient on dark cards |
| Near-black (text) | `#111110` | Headings & body text on cream |
| Success green (badge) | `#1F7A4D` | "Done" lesson badge in Academy |

Text opacity variants used throughout: `rgba(17,17,16,0.4 / 0.45 / 0.5 / 0.55 / 0.6 / 0.66 / 0.68)` on cream; `rgba(241,241,231,0.5 / 0.55 / 0.6 / 0.62)` on green.

### Base background (cream) — not flat
```css
background: radial-gradient(135% 95% at 50% -12%, #F6F6EE 0%, #F1F1E7 44%, #EAEADD 100%);
```
Plus a **film-grain overlay** (see Assets/Interactions).

### Typography
Three Google Fonts:
- **Archivo** (weights 400/500/600/700/800) — primary sans. Headings, body, UI.
- **Newsreader** (italic, weight 400/500, optical) — elegant italic *accent* words inside headlines (e.g. "*Outcome-obsessed*", "*obsessively*", "*We optimize for you*", "*performs*").
- **Space Mono** (400/700) — all mono labels/eyebrows, tags, stat suffixes, small meta text. Typically uppercase, `letter-spacing: 0.16–0.20em`.

Type scale (desktop, using `clamp(min, vw, max)`):
- Hero H1: `clamp(48px, 9.2vw, 132px)`, weight 800, line-height 0.92, letter-spacing -0.035em
- Section H2: `clamp(28px–32px, 4–5vw, 52px–60px)`, weight 700, letter-spacing -0.025 to -0.03em
- Stat numbers: `clamp(46px, 6vw, 84px)`, weight 800
- Body: `clamp(15px, 1.3–1.5vw, 18px–21px)`, line-height 1.55–1.6, color `rgba(17,17,16,0.66–0.68)`
- Eyebrow labels (Space Mono): 12px, uppercase, `letter-spacing 0.2em`, color `rgba(...,0.45)`

### Spacing / radius / shadow
- Section vertical padding: `clamp(72px, 10vw, 130–140px)` (hero/CTA larger).
- Content max-width: `1240px`, side padding `clamp(20px, 5vw, 48px)`.
- Radii: buttons/pills `999px`; cards `18px`; stat grid `16px`; service rows `12px`; inputs `12px`.
- Button hover shadow (green): `0 12–16px 24–30px -12/-14px rgba(20,56,40,0.7)`.
- Card hover shadow: `0 22px 44px -24px rgba(20,56,40,0.4)`.

---

## Screens / Views

### 1. Landing — Desktop (`Growth Social.dc.html`)
Fixed top nav + long scroll. Sections in order:

**Nav (fixed, top).** Transparent at top; on scroll past 16px it fades in a `rgba(241,241,231,0.82)` background with `backdrop-filter: blur(10px)` and a 1px bottom border `rgba(17,17,16,0.1)`. Left: logo mark + "Growth Social" (weight 700, 17px). Right: text links (Services, Results, Approach, Clients) → hover color `#143828`; a 1px divider; "Creator login" link (→ Academy); "Book a call" green pill button. Buttons/links lift 2px + green shadow on hover.

**Hero.** Eyebrow row: "UGC AGENCY — EST. 2026" (Space Mono, with a short rule between). H1 in three lines: "Creator-focused." / "*Outcome-obsessed.*" (Newsreader italic) / "Against the grain." Below: a paragraph (max 46ch, muted) on the left, and a CTA cluster on the right — green "Book a call →" pill + "See the work" text link with underline. Then a **full-width horizontal auto-scrolling reel strip**: 9:16 cards (`clamp(150px,15vw,210px)` wide), diagonal-stripe placeholders, each with a mono ID top-left and a caption bottom-left. Masked with a left/right fade (`mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)`).

**Social proof.** Eyebrow "Trusted by brands of every size". Full-width **auto-scrolling brand marquee** (opposite direction to the reel strip), weight-700 wordmarks at `clamp(20px,2.4vw,30px)`, color `rgba(17,17,16,0.34)`. Current brands (real client list): Meta, Cluely, Lovable, SharkNinja, Based Bodyworks, Anker, Govee, Levoit, QVC, PacSun, Midjourney, Polymarket, BISSELL, Dave's Hot Chicken, Crocs.

**Results / stats (dark green section, `#143828`).** `position:relative; overflow:hidden` with a soft radial light-glow (`radial-gradient(90% 70% at 12% 0%, rgba(241,241,231,0.09), transparent 55%)`) and a large faint ghost logo watermark (cream logo, opacity 0.05, bottom-right, `clamp(320px,38vw,560px)`). Eyebrow "/ The receipts" + H2 "Content that earns its place in the ad account." A 4-up stat grid (`repeat(auto-fit, minmax(210px,1fr))`, 1px gridlines via `rgba(241,241,231,0.14)` background/border). Each stat: a big **count-up animated number** + a small suffix, and a caption. Stats:
  - `3.4x` — Average conversion lift across paid social
  - `150+` — Vetted creators in our coached network
  - `12M+` — Monthly views driven for our clients
  - `48hr` — Average concept-to-first-cut turnaround

**Services.** Eyebrow "/ What we do" + H2 "Three things, done *obsessively* well." A list of 3 rows separated by 1px borders. Each row is a 4-column grid: index (`01`/`02`/`03`, Space Mono), title (H3), description + tag pills, and a **44px circular outlined arrow (↗, green)** right-aligned. **Row hover:** background tints `rgba(20,56,40,0.05)`, insets with `padding-left/right: 20px`, 0.4s ease. Content:
  - `01 UGC Creation` — "Scroll-stopping, platform-native content made by creators who actually use your product — briefed against your funnel, not vanity metrics." Tags: Short-form video, Photo, Hooks & scripting
  - `02 Creator Coaching` — "We develop our creators like athletes: performance reviews, shared hook libraries and tight iteration loops so every batch outperforms the last." Tags: Performance reviews, Hook libraries, Iteration loops
  - `03 Performance Scaling` — "Winning concepts get systematized and scaled across placements and markets, with results feeding straight back into the next brief." Tags: Creative testing, Scaling frameworks, Reporting

**Statement marquee band (dark green).** Full-width auto-scrolling ticker between Services and Approach. Cycles four phrases with the logo mark as separators: **Creator-first** (Archivo 700) · *Outcome-driven* (Newsreader italic) · **Coached like a team** · *Against the grain* — at `clamp(28px,3.8vw,56px)`. Subtle inner vignette overlay.

**Approach / "Why we exist" (warm grey `#ECECDE`).** Eyebrow "/ Why we exist" + large statement (max 30ch) "Traditional agencies optimize for output. *We optimize for you.*" Then a 3-column grid of principles, each with an index, title, and body:
  - `01 Creators, not vendors` — "We pay well, coach hard and build long-term relationships. Better-treated creators simply make better-performing content."
  - `02 Outcomes, not deliverables` — "We measure ourselves on your CAC, ROAS and retention — never a quota of clips that nobody watches."
  - `03 Systems, not guesswork` — "Every winning hook feeds a library and a testing framework, so performance compounds instead of resetting each month."

**Testimonials.** Eyebrow "/ In their words". 3-up grid of cards (`#FBFBF5`, 1px border, radius 18px, min-height 280px). Big Newsreader italic quote + avatar (placeholder) / name / role. **Card hover:** lift 6px, border → `rgba(20,56,40,0.4)`, green shadow. Content:
  - "They treat our creative like a product — every batch is measurably better than the last. It changed how our whole team thinks about paid." — Maya Ellison, Head of Growth, Superbloom
  - "Finally an agency that reports on revenue, not view counts. Growth Social feels like a real extension of our team." — Devon Carter, Founder, Northwind
  - "The creators actually understand our product. The content sounds like our customers — and it converts like it too." — Priya Nair, VP Marketing, Aéra

  > NOTE: testimonials are **placeholder copy** — confirm real quotes before launch.

**Final CTA (dark green).** Centered. Radial glow + large centered ghost logo watermark (opacity 0.045). Eyebrow "/ Let's talk" + H2 "Content that *performs.*" (`clamp(40px,7vw,96px)`). Cream "Book a call →" pill + `hello@growthsocial.co` mono email link.

**Footer.** Logo + wordmark; link row (Services, Results, Approach, Clients, Book a call); bottom row "© 2026 Growth Social — UGC, done differently." / "Creators first. Outcomes always."

### 2. Landing — Mobile (`Growth Social Mobile.dc.html`)
Same content and system at a 402px-wide single-column layout. Differences: compact top bar (logo + "Log in" text + "Book a call" pill); hero H1 at 41px; full-width stacked CTAs; stats as a **2×2 grid**; services as stacked cards (title + arrow on one row, description, tags); principles stacked; **testimonials are a horizontal scroll-snap carousel** (`scroll-snap-type: x mandatory`, 290px cards, "swipe →" hint); stacked footer. The iOS device frame around it is **prototype scaffolding only — do not ship it**; build responsively so the desktop layout collapses to this at small breakpoints.

### 3. Creator Academy (`Creator Academy.dc.html` = desktop, `Creator Academy Mobile.dc.html` = phone)
Two states behind a single component (`state.view = 'login' | 'academy'`). Build **one responsive route** that reflows between the two references below — don't ship two separate implementations.

**Login.** Two-column full-height. Left = green brand panel (`#143828`): logo (cream) + wordmark (links home), eyebrow "Creator Academy", H1 "Coached like *a team.*", supporting paragraph, and a mono footer row ("150+ creators" / "New drops weekly"). Right = centered form (max 380px): eyebrow "Creator login", H2 "Welcome back.", Email + Password inputs (`#FBFBF5`, 1px border, radius 12px), "Forgot password?" link, full-width green **"Log in to Academy"** button, and "New creator? Request access" (→ landing `#book`). In production, wire to real auth; the prototype just flips state on submit.

**Academy (course library).** Sticky top bar: logo + "Growth Social" (links home) + an "Academy" pill tag; right = avatar + "[ Creator name ]" + "Log out". Body:
- Greeting: eyebrow "Your progress · 17% complete" + H1 "Welcome back, [ name ]."
- **Continue watching** card (green, radius 20px): left = 16:9 video placeholder with a cream circular play button, a duration badge, and a "16:9 · lesson video" tag; right = "Continue watching · Module 02 · Filming", lesson title "Hooks", a progress bar (42%), "42% · 6 min left", and a cream "Resume →" button.
- **Meet your coaches:** heading + a 2-up grid of 16:9 video cards (same visual language as lesson cards — play button, duration badge, "Intro" tag) with name + role below. Real coaches: **Noel** and **Joey**, both titled "Head Coach". These are real intro videos to embed, not placeholders to replace with stock content.
- **Curriculum:** heading + "N modules · N lessons" count. Each module = an index + title + lesson count, then a **horizontal scroll row** of lesson cards. Lesson card: 16:9 stripe placeholder + play button + duration badge + optional green "DONE" badge; below, an `L01…` index + lesson title.

**Mobile Academy layout (`Creator Academy Mobile.dc.html`, shown in a prototype iOS frame — do not ship the frame).** Single column. *Login:* the green brand panel becomes a rounded **brand card at the top** (logo, eyebrow, "Coached like *a team.*", intro) with the form stacked beneath it — not side-by-side. *Library:* compact sticky bar (logo + "Academy" pill left; "Log out" + avatar right); greeting with an inline 17% progress bar; the "Continue watching" card **stacks vertically** (16:9 video on top, then eyebrow/title/progress/Resume); curriculum modules each show a heading then a **horizontal scroll-snap row** of ~200px lesson cards. Same green/cream system, grain overlay, and glow as the rest of the site.

Curriculum data (real titles; durations are placeholders):
  - **00 · Limitless** — Understanding Limitless, Lifestyle, Friends *(all done)*
  - **01 · UGC Fundamentals** — What UGC Actually Is *(done)*, How Brands Think *(done)*, Why Most Creators Stay Stuck, The UGC Opportunity in 2026
  - **02 · Filming** — Lighting, Audio, Backgrounds, Hooks, Speaking Naturally
  - **03 · Editing** — Why Editing Matters, Retention, Captions, Pacing, Pattern Interrupts, Ad-Style Editing
  - **04 · Portfolio Creation** — What Brands Look For, Building Your First Portfolio, Spec Ads, Portfolio Mistakes, Portfolio Review
  - **05 · Landing Clients** — Outreach, Email, DMs, Pricing, Negotiation, Retainers
  - **06 · Scaling** — Systems, AI, Getting to $10k+/month

---

## Interactions & Behavior
- **Scroll reveals:** elements marked `data-reveal` start at `opacity:0; translateY(20–28px)` and animate to visible when they enter the viewport (IntersectionObserver, threshold ~0.1). Easing `cubic-bezier(.16,1,.3,1)`, ~0.8–0.9s. Optional stagger via `data-delay` (ms). **Base state must be visible** — reveal is additive so content never gets stuck hidden. In React use Framer Motion `whileInView` / `viewport={{ once: true }}`.
- **Marquees** (reel strip, brand row, statement band): infinite horizontal scroll via a track duplicated 2× translating `-50%` (`@keyframes marq { to { transform: translateX(-50%) } }`), linear, ~34–46s. Directions alternate. Edge fade via `mask-image`.
- **Count-up stats:** animate 0 → target on first view (~1.5–1.6s, ease-out cubic), preserving decimals (`3.4`) and suffix (`x`, `+`, `M+`, `hr`).
- **Nav:** background/blur fade-in after 16px scroll.
- **Hover:** buttons lift 2px + green shadow; nav links → green; service rows tint + inset; testimonial cards lift + green border/shadow.
- **Reduced motion:** honor `prefers-reduced-motion` — disable marquees/reveals/count-up and show final state. (Prototype also exposes a `reduceMotion` flag.)
- **Academy:** login submit → library; "Log out" → login; logos link to landing.

## State Management
- Landing: none beyond scroll/viewport observers.
- Academy: `view: 'login' | 'academy'`. Production adds real auth/session, per-lesson progress, and a video player. Course structure (modules → lessons with `title`, `duration`, `done`) should come from a CMS/DB.

## Assets
- **Logo mark** (green "G"): `assets/logo-green.png` (transparent). Cream recolor for dark backgrounds: `assets/logo-cream.png`. Prefer converting to **SVG** in production for crispness. Brand green `#143828`.
- **Film-grain overlay:** an inline SVG `feTurbulence` noise (`baseFrequency 0.9`, 160×160 tile) painted as a fixed full-screen layer at `opacity 0.42`, `mix-blend-mode: soft-light`, `pointer-events:none`. Recreate as a fixed overlay div or a tiling PNG.
- **Reel / video / avatar imagery:** all currently **diagonal-stripe placeholders**. Client will supply real creator reels (vertical 9:16), lesson videos (16:9), brand logos, and avatars. Brand names currently render as **text wordmarks** — swap for real logo SVGs when available.
- **Fonts:** Archivo, Newsreader, Space Mono (Google Fonts).

## Files
- `Growth Social.dc.html` — desktop landing (reference)
- `Growth Social Mobile.dc.html` — mobile landing (reference; ignore the device frame)
- `Creator Academy.dc.html` — login + course library, desktop (reference)
- `Creator Academy Mobile.dc.html` — login + course library, phone (reference; ignore the device frame)
- `assets/logo-green.png`, `assets/logo-cream.png` — logo art

All data/copy lives in the `class Component { renderVals() {…} }` block at the bottom of each file. `support.js` and the `.dc.html` wrapper are prototype runtime — **do not port them.**
