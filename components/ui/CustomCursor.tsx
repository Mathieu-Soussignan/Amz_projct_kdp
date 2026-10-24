"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorVariant = "default" | "book" | "amazon" | "paint";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springX = useSpring(rawX, { stiffness: 420, damping: 32, mass: 0.4 });
  const springY = useSpring(rawY, { stiffness: 420, damping: 32, mass: 0.4 });

  useEffect(() => {
    // Only enable on fine pointer devices (desktop/trackpad)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    const handleMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("[data-cursor='amazon']")) {
        setVariant("amazon");
      } else if (target.closest("[data-cursor='book']")) {
        setVariant("book");
      } else if (target.closest("[data-cursor='paint']")) {
        setVariant("paint");
      } else {
        setVariant("default");
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  if (!enabled) return null;

  const isExpanded = variant !== "default";

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width:
          variant === "book" || variant === "amazon"
            ? 86
            : variant === "paint"
            ? 44
            : 22,
        height:
          variant === "book" || variant === "amazon"
            ? 86
            : variant === "paint"
            ? 44
            : 22,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={`pointer-events-none fixed top-0 left-0 z-[60] rounded-full flex items-center justify-center transition-colors duration-200 ${
        variant === "amazon"
          ? "bg-autumn-saffron/95 text-white shadow-[0_0_30px_rgba(217,119,54,0.65)] border border-amber-200/60"
          : variant === "book"
          ? "bg-espresso-900/90 text-amber-200 backdrop-blur-md shadow-xl border border-amber-300/40"
          : variant === "paint"
          ? "bg-amber-300/35 border-2 border-espresso-900/60 backdrop-blur-sm"
          : "bg-autumn-saffron/25 border border-autumn-saffron/60"
      }`}
    >
      {isExpanded && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight px-1 select-none"
        >
          {variant === "amazon"
            ? "Amazon ↗"
            : variant === "book"
            ? "Feuilleter"
            : "Colorier"}
        </motion.span>
      )}
    </motion.div>
  );
}
