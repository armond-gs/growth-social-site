export type Lesson = {
  no: string;
  title: string;
  // PLACEHOLDER — durations per README; real values come from the video backend.
  dur: string;
  done: boolean;
};

export type Module = {
  no: string;
  title: string;
  count: number;
  lessons: Lesson[];
};

const DURS = ["06:12", "09:40", "12:05", "08:33", "15:20", "07:48"];

function buildModule(no: string, title: string, titles: string[], doneCount = 0): Module {
  const lessons = titles.map((t, i) => ({
    no: `L${String(i + 1).padStart(2, "0")}`,
    title: t,
    dur: DURS[i % DURS.length],
    done: i < doneCount,
  }));
  return { no, title, count: lessons.length, lessons };
}

export const MODULES: Module[] = [
  buildModule("00", "Limitless", ["Understanding Limitless", "Lifestyle", "Friends"], 3),
  buildModule(
    "01",
    "UGC Fundamentals",
    [
      "What UGC Actually Is",
      "How Brands Think",
      "Why Most Creators Stay Stuck",
      "The UGC Opportunity in 2026",
    ],
    2,
  ),
  buildModule("02", "Filming", ["Lighting", "Audio", "Backgrounds", "Hooks", "Speaking Naturally"]),
  buildModule("03", "Editing", [
    "Why Editing Matters",
    "Retention",
    "Captions",
    "Pacing",
    "Pattern Interrupts",
    "Ad-Style Editing",
  ]),
  buildModule("04", "Portfolio Creation", [
    "What Brands Look For",
    "Building Your First Portfolio",
    "Spec Ads",
    "Portfolio Mistakes",
    "Portfolio Review",
  ]),
  buildModule("05", "Landing Clients", [
    "Outreach",
    "Email",
    "DMs",
    "Pricing",
    "Negotiation",
    "Retainers",
  ]),
  buildModule("06", "Scaling", ["Systems", "AI", "Getting to $10k+/month"]),
];

export const MODULE_COUNT = MODULES.length;
export const LESSON_COUNT = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

// PLACEHOLDER — continue-watching + progress state; real values come from the
// per-user progress backend once auth/video hosting are wired up.
export const CONTINUE_WATCHING = {
  moduleLabel: "Module 02 · Filming",
  lessonTitle: "Hooks",
  progressPercent: 42,
  timeLeft: "6 min left",
  duration: "14:32",
};

export const PROGRESS_PERCENT = 17;
