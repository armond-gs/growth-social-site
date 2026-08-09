"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { LANDING_COPY, type AudienceMode, type LandingCopy } from "@/lib/data/landing";

type ModeContextValue = {
  mode: AudienceMode;
  isBrand: boolean;
  setMode: (mode: AudienceMode) => void;
  copy: LandingCopy;
  /**
   * Increments on every switch. Components key off this to replay one-shot
   * animations (counters, the hero word rise) that would otherwise only run
   * on first mount.
   */
  modeEpoch: number;
};

const ModeContext = createContext<ModeContextValue | null>(null);

/**
 * Audience mode for the landing page.
 *
 * Only copy and content live here. The palette inversion is done entirely in
 * CSS via the `data-mode` attribute this sets on its wrapper — see the
 * [data-mode] blocks in globals.css. Keeping colour out of React means the
 * switch is a CSS transition rather than a re-render, so nothing flashes and
 * the timings are declared in one place.
 */
export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AudienceMode>("brand");
  const [modeEpoch, setModeEpoch] = useState(0);

  const setMode = useCallback((next: AudienceMode) => {
    setModeState((current) => {
      if (current === next) return current;
      setModeEpoch((e) => e + 1);
      return next;
    });
  }, []);

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      isBrand: mode === "brand",
      setMode,
      copy: LANDING_COPY[mode],
      modeEpoch,
    }),
    [mode, setMode, modeEpoch],
  );

  return (
    <ModeContext.Provider value={value}>
      <div
        data-mode={mode}
        className="relative min-h-screen overflow-x-hidden text-[var(--fg)] transition-[background] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ background: "var(--page-wash)" }}
      >
        {children}
      </div>
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}
