"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";

export function Marquee({
  children,
  durationSeconds = 40,
  direction = "left",
  className = "",
  trackClassName = "flex w-max gap-4",
}: {
  children: ReactNode;
  durationSeconds?: number;
  direction?: "left" | "right";
  className?: string;
  trackClassName?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className={trackClassName}>{items}</div>
      </div>
    );
  }

  const duplicated = items.map((item, i) =>
    isValidElement(item) ? cloneElement(item, { key: `dup-${i}` }) : item,
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className={trackClassName}
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: durationSeconds, repeat: Infinity, ease: "linear" }}
      >
        {items}
        {duplicated}
      </motion.div>
    </div>
  );
}
