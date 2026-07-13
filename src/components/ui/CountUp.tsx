"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();
  const target = parseFloat(value);
  const decimals = (value.split(".")[1] || "").length;
  const [display, setDisplay] = useState(shouldReduceMotion ? value : "0");

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [isInView, shouldReduceMotion, target, decimals]);

  return <span ref={ref}>{display}</span>;
}
