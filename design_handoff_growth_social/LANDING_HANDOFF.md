# Handoff: Landing page — two-sided (brand / creator)

Scope: **the marketing landing page only** (`/`). The Academy has its own doc (`ACADEMY_HANDOFF.md`); full design tokens are in `README.md`. This doc covers what changed since the version currently deployed at growthsocialhq.com.

References: `Growth Social.dc.html` (desktop) and `Growth Social Mobile.dc.html` (mobile, shown in a phone frame — the frame is prototype-only, don't ship it). Build **one responsive page**, not two.

---

## The headline change: an audience toggle

A centered pill sits **below the header, at the top of the hero**: `I'm a brand` / `I'm a creator`. Brand is the default. It is a client-side state switch on the same page (no route change, no reload).

Switching modes changes three things:

**1. Copy** — hero kicker, all three headline lines, hero body, both hero CTAs, the social-proof label, the results heading, the services kicker + heading, the approach heading, the final CTA kicker + heading, the status chip, and the nav/footer CTA. Every string is in `renderVals()` in the desktop file under `const copy = isBrand ? {…} : {…}` — lift that object wholesale.

**2. Content** — stats, the three service/step cards, and the three principles are separate arrays per mode (`stats`/`creatorStats`, `services`/`creatorServices`, `principles`/`creatorPrinciples`).

**3. The entire palette inverts.** See below.

### Palette inversion (creator mode)
Same brand colors, swapped roles — nothing new is introduced.

| Element | Brand mode | Creator mode |
|---|---|---|
| Page wash | cream radial (`#F6F6EE→#F1F1E7→#EAEADD`) | green radial (`#1A4633→#143828→#0F2C1F`) |
| Body text | `#111110` | `#F1F1E7` |
| Big blocks (stats, statement band, final CTA) | `#143828` | `#F1F1E7` |
| Text on those blocks | `#F1F1E7` | `#111110` |
| Approach panel | `#ECECDE` | `#0F2C1F` |
| Primary button | green bg / cream text | cream bg / ink text |
| Wordmark (nav + footer) | `logo-green.png` | `logo-cream.png` |
| Sticky nav (scrolled) | `rgba(241,241,231,0.82)` | `rgba(17,50,35,0.86)` |
| Reel placeholder stripes | `#E8E8DC`/`#EEEEE4` | `#17402E`/`#1C4A35` |

Hairlines/muted text follow the same rule: ink-at-opacity in brand mode, cream-at-opacity in creator mode. All values are in `renderVals()` as `fg`, `fgMuted`, `fgSubtle`, `fgFaint`, `rule`, `ruleStrong`, `darkBg`, `bandFg`, `bandMuted`, `bandSubtle`, `bandRule`, `bandGlow`, `bandBtnBg`, `bandBtnFg`, `chipBg`, `panelBg`, `reelBg` — implement these as CSS custom properties on a `data-mode` attribute rather than as inline JS values.

Transition the wash over ~1.1s and the blocks over ~0.9s so the switch feels deliberate. Counters and the hero word animation replay on switch.

### Toggle thumb
The sliding pill **must measure the active button** (`offsetWidth`/`offsetLeft`) and set its width/transform from that — recompute on mount, on `document.fonts.ready`, and on mode change. The two labels are different widths; hardcoded pixel values overshoot the track.

---

## Other changes from the deployed version

- **Nav is three zones**: logo left, links (Services / Results / Approach) optically centered, status chip + CTA right. Links live in hover pills — background fades in (`rgba(20,56,40,0.08)` brand / `rgba(241,241,231,0.12)` creator), text goes to full color and **weight 700**.
- **Status chip**: mono uppercase with a slowly pulsing dot (2.4s). "Now booking" (brand) / "Applications open" (creator).
- **Hero eyebrow** is a full-width rule: kicker left, hairline gradient stretching across, "Est. 2026" right.
- **Faint logo watermark** behind the hero's top-right at 5% opacity. Ship one literal image and invert it with a CSS `filter` per mode rather than swapping `src`.
- **Stats section restructured** — the 4-up equal grid is gone. One hero number at `clamp(96px,15vw,232px)` on the left with its label, and the remaining three as mono footnote rows (label left, value right) separated by hairlines. Mobile stacks: hero number, then the three rows.
- **Testimonials section removed** entirely from both modes.
- **Reel cards** show a view-count badge (eye icon + count) bottom-right; the old REEL-id and caption chips are gone.
- **Hero headline animates per word** — each word rises out of a clipping mask, 60ms stagger, lines offset by 110ms.
- **Mono kickers tick in** character by character (26ms/char) when scrolled into view, once each.
- Both animations must respect `prefers-reduced-motion` and always land on final text even if frames are dropped.

## Links
- Brand CTA → booking flow (the existing `BookingReveal`)
- Creator CTA → `https://apply.growthsocialhq.com`
- Creator secondary → Academy login
- Footer CTA follows the active mode

## Content status
**All stats, numbers, and results copy are placeholders** on both sides — the client is replacing them. Wire them as data, not hardcoded JSX. Brand logos in the marquee are set type, not real marks.
