"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { useEffect, useState } from "react";

const RING_COLOR = "#00C853";
const EASE_APPLE = [0.16, 1, 0.3, 1] as const; // expo-out, feels more "settled"

export default function BackupButton() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.button
      className="relative flex items-center justify-center gap-2 rounded-full bg-[#00C853] px-6 py-3.5 text-white font-medium select-none"
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      initial={false}
      suppressHydrationWarning
    >
      {/* Pulse rings — outline-offset expands evenly on all sides, unlike scale */}
      {mounted && !reduce && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              outlineStyle: "solid",
              outlineWidth: 3,
              outlineColor: RING_COLOR,
            }}
            initial={{ outlineOffset: 0, opacity: 0.5 }}
            animate={{ outlineOffset: 14, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: EASE_APPLE }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              outlineStyle: "solid",
              outlineWidth: 3,
              outlineColor: RING_COLOR,
            }}
            initial={{ outlineOffset: 0, opacity: 0.3 }}
            animate={{ outlineOffset: 14, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: EASE_APPLE,
              delay: 0.6,
            }}
          />
        </>
      )}

      {/* Icon — native CSS spin instead of JS-driven rotate */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-[2.5px] border-white/30 border-t-white animate-spin" />
      </div>

      <span className="font-bold">Backing Up</span>
    </motion.button>
  );
}
