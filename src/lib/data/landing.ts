import { APPLY_URL } from "@/lib/site";

// "Clients" (#voices) and "Results" (#results) are omitted while those
// sections are hidden — they would scroll to nothing. Restore each link
// alongside its section.
export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#approach", label: "Approach" },
];

export type Clip = {
  id: string;
  label: string;
  src: string;
  views: string;
};

// Captions are placeholder copy — swap for real per-clip descriptions as you
// go. `src` points at public/reels-compressed/<file>.mp4 (web-optimized;
// public/reels/ holds the original full-quality source files as a backup).
// Leave src unset (or the file missing) and that card falls back to the
// stripe placeholder.
export const CLIPS: Clip[] = [
  { id: "REEL 01", label: "9:16 · skincare hook", src: "/reels-compressed/reel-01.mp4", views: "2.3M" },
  { id: "REEL 02", label: "9:16 · unboxing", src: "/reels-compressed/reel-02.mp4", views: "17.9M" },
  { id: "REEL 03", label: "9:16 · testimonial", src: "/reels-compressed/reel-03.mp4", views: "3.4M" },
  { id: "REEL 04", label: "9:16 · day-in-life", src: "/reels-compressed/reel-04.mp4", views: "500K" },
  { id: "REEL 05", label: "9:16 · demo", src: "/reels-compressed/reel-05.mp4", views: "1.4M" },
  { id: "REEL 06", label: "9:16 · founder story", src: "/reels-compressed/reel-06.mp4", views: "450K" },
  { id: "REEL 07", label: "9:16 · before/after", src: "/reels-compressed/reel-07.mp4", views: "8.5M" },
  { id: "REEL 08", label: "9:16 · street interview", src: "/reels-compressed/reel-08.mp4", views: "1M" },
  { id: "REEL 09", label: "9:16 · behind-the-scenes", src: "/reels-compressed/reel-09.mp4", views: "620K" },
];

export const BRANDS = [
  "Meta",
  "Cluely",
  "Lovable",
  "SharkNinja",
  "Based Bodyworks",
  "Anker",
  "Govee",
  "Levoit",
  "QVC",
  "PacSun",
  "Midjourney",
  "Polymarket",
  "BISSELL",
  "Dave’s Hot Chicken",
  "Crocs",
];

export const STATS = [
  { value: "3.4", suffix: "x", label: "Average conversion lift across paid social" },
  { value: "150", suffix: "+", label: "Vetted creators in our coached network" },
  { value: "12", suffix: "M+", label: "Monthly views driven for our clients" },
  { value: "48", suffix: "hr", label: "Average concept-to-first-cut turnaround" },
];

export const SERVICES = [
  {
    no: "01",
    title: "UGC Creation",
    desc: "Scroll-stopping, platform-native content made by creators who actually use your product — briefed against your funnel, not vanity metrics.",
    tags: ["Short-form video", "Photo", "Hooks & scripting"],
  },
  {
    no: "02",
    title: "Creator Coaching",
    desc: "We develop our creators like athletes: performance reviews, shared hook libraries and tight iteration loops so every batch outperforms the last.",
    tags: ["Performance reviews", "Hook libraries", "Iteration loops"],
  },
  {
    no: "03",
    title: "Performance Scaling",
    desc: "Winning concepts get systematized and scaled across placements and markets, with results feeding straight back into the next brief.",
    tags: ["Creative testing", "Scaling frameworks", "Reporting"],
  },
];

export const STATEMENT_BAND = [
  { text: "Creator-first", italic: false },
  { text: "Outcome-driven", italic: true },
  { text: "Coached like a team", italic: false },
  { text: "Against the grain", italic: true },
];

export const PRINCIPLES = [
  {
    no: "01",
    title: "Creators, not vendors",
    body: "We pay well, coach hard and build long-term relationships. Better-treated creators simply make better-performing content.",
  },
  {
    no: "02",
    title: "Outcomes, not deliverables",
    body: "We measure ourselves on your CAC, ROAS and retention — never a quota of clips that nobody watches.",
  },
  {
    no: "03",
    title: "Systems, not guesswork",
    body: "Every winning hook feeds a library and a testing framework, so performance compounds instead of resetting each month.",
  },
];

// PLACEHOLDER — testimonial copy per README; confirm real quotes before launch.
export const TESTIMONIALS = [
  {
    quote:
      "They treat our creative like a product — every batch is measurably better than the last. It changed how our whole team thinks about paid.",
    name: "Maya Ellison",
    role: "Head of Growth, Superbloom",
  },
  {
    quote:
      "Finally an agency that reports on revenue, not view counts. Growth Social feels like a real extension of our team.",
    name: "Devon Carter",
    role: "Founder, Northwind",
  },
  {
    quote:
      "The creators actually understand our product. The content sounds like our customers — and it converts like it too.",
    name: "Priya Nair",
    role: "VP Marketing, Aéra",
  },
];

export const FOOTER_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#approach", label: "Approach" },
  { href: "#book", label: "Book a call" },
];

/* ---------------------------------------------------------------------------
   Audience modes
   ---------------------------------------------------------------------------
   The landing page addresses two audiences from the same URL. Everything that
   differs between them lives here as data — copy, stats, the service/step
   cards and the principles — so the components stay mode-agnostic and render
   whichever object is active.

   NOTE: every stat, number and results line on both sides is placeholder copy
   pending real figures from the client. Kept as data precisely so swapping
   them is an edit here rather than a hunt through JSX.
--------------------------------------------------------------------------- */

export type AudienceMode = "brand" | "creator";

export type Stat = { value: string; suffix: string; label: string };
export type Service = { no: string; title: string; desc: string; tags: string[] };
export type Principle = { no: string; title: string; body: string };

export type LandingCopy = {
  heroKicker: string;
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroBody: string;
  heroCta: string;
  heroCtaHref: string;
  /** Brand's primary CTA opens the inline booking panel rather than navigating. */
  heroCtaOpensBooking: boolean;
  heroAlt: string;
  heroAltHref: string;
  statusLabel: string;
  proofLabel: string;
  resultsHeading: string;
  servicesKicker: string;
  servicesHeadA: string;
  servicesHeadItalic: string;
  servicesHeadB: string;
  approachHeadA: string;
  approachHeadItalic: string;
  ctaKicker: string;
  ctaHeadA: string;
  ctaHeadItalic: string;
  navCta: string;
  navCtaHref: string;
  /** Brand's nav CTA opens the inline booking panel; creator's navigates. */
  navCtaOpensBooking: boolean;
  stats: Stat[];
  services: Service[];
  principles: Principle[];
};

const CREATOR_STATS: Stat[] = [
  { value: "150", suffix: "+", label: "Creators earning with us right now" },
  { value: "7", suffix: "d", label: "From accepted application to first paid brief" },
  { value: "20", suffix: "+", label: "Academy lessons, free once you’re in" },
  { value: "2", suffix: "x", label: "Average rate increase in a creator’s first year" },
];

const CREATOR_SERVICES: Service[] = [
  {
    no: "01",
    title: "Apply & get vetted",
    desc: "Send us your handle and a couple of clips. No follower minimums — we care how you shoot, talk and take direction.",
    tags: ["No follower minimum", "48hr response", "Portfolio review"],
  },
  {
    no: "02",
    title: "Get coached",
    desc: "Full access to the Creator Academy: hooks, filming, editing, portfolio and client-landing modules, plus intro sessions with Noel and Joey.",
    tags: ["Creator Academy", "Hook libraries", "1:1 feedback"],
  },
  {
    no: "03",
    title: "Get paid to post",
    desc: "We match you to briefs from real brands, handle the contracts and invoicing, and pay flat rate per approved video.",
    tags: ["Flat rate per video", "Repeat clients", "We handle contracts"],
  },
];

const CREATOR_PRINCIPLES: Principle[] = [
  {
    no: "01",
    title: "Paid properly, on time",
    body: "Flat rates agreed up front and paid on schedule — no chasing invoices, no commission-only roulette.",
  },
  {
    no: "02",
    title: "Coached, not just booked",
    body: "You get reviews, hook libraries and real feedback after every batch. You should be a better creator six months in.",
  },
  {
    no: "03",
    title: "Long-term, not one-off",
    body: "We build repeat relationships with brands so our creators get steady work instead of scrambling for the next gig.",
  },
];

export const LANDING_COPY: Record<AudienceMode, LandingCopy> = {
  brand: {
    heroKicker: "UGC Agency",
    heroLine1: "Creator‑focused.",
    heroLine2: "Outcome‑obsessed.",
    heroLine3: "Against the grain.",
    heroBody:
      "Growth Social is a UGC agency built around the people who make the content — and the results our clients actually care about. We coach creators like a team and measure ourselves on your numbers.",
    heroCta: "Book a call",
    heroCtaHref: "/book",
    heroCtaOpensBooking: true,
    heroAlt: "See the work",
    heroAltHref: "#services",
    statusLabel: "Now booking",
    proofLabel: "Trusted by brands of every size",
    resultsHeading: "Content that earns its place in the ad account.",
    servicesKicker: "/ What we do",
    servicesHeadA: "Three things, done ",
    servicesHeadItalic: "obsessively",
    servicesHeadB: " well.",
    approachHeadA: "Traditional agencies optimize for output.",
    approachHeadItalic: "We optimize for you.",
    ctaKicker: "/ Let’s talk",
    ctaHeadA: "Content that",
    ctaHeadItalic: "performs.",
    navCta: "Book a call",
    navCtaHref: "/book",
    navCtaOpensBooking: true,
    stats: STATS,
    services: SERVICES,
    principles: PRINCIPLES,
  },
  creator: {
    heroKicker: "For creators",
    heroLine1: "Get paid to post.",
    heroLine2: "Get coached to win.",
    heroLine3: "Grow on purpose.",
    heroBody:
      "Flat rates per approved video, briefs from real brands, and a full Academy behind you. We treat creators like a roster, not a headcount — coached, paid properly and booked again.",
    heroCta: "Apply to create",
    heroCtaHref: APPLY_URL,
    heroCtaOpensBooking: false,
    heroAlt: "Log into the portal",
    heroAltHref: "/academy",
    statusLabel: "Applications open",
    proofLabel: "Brands our creators have shot for",
    resultsHeading: "A roster that gets better every single month.",
    servicesKicker: "/ How it works",
    servicesHeadA: "Three steps, no ",
    servicesHeadItalic: "gatekeeping",
    servicesHeadB: ".",
    approachHeadA: "Most agencies treat creators as headcount.",
    approachHeadItalic: "We treat you as the roster.",
    ctaKicker: "/ Join the roster",
    ctaHeadA: "Creators who",
    ctaHeadItalic: "get booked.",
    navCta: "Log into portal",
    navCtaHref: "/academy",
    navCtaOpensBooking: false,
    stats: CREATOR_STATS,
    services: CREATOR_SERVICES,
    principles: CREATOR_PRINCIPLES,
  },
};
