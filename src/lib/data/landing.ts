export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#approach", label: "Approach" },
  { href: "#voices", label: "Clients" },
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
  { href: "#results", label: "Results" },
  { href: "#approach", label: "Approach" },
  { href: "#voices", label: "Clients" },
  { href: "#book", label: "Book a call" },
];
