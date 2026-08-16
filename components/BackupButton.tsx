"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { useEffect, useState } from "react";

const RING_COLOR = "#00C853";
const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

type ButtonState = "idle" | "loading" | "success";

export default function BackupButton() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<ButtonState>("idle");

  useEffect(() => {
    setMounted(true);

    // Auto-loops the full animation cycle so you can test it
    const runAnimationCycle = () => {
      setStatus("loading");

      setTimeout(() => {
        setStatus("success");

        setTimeout(() => {
          setStatus("idle");
        }, 2000);
      }, 3000);
    };

    runAnimationCycle();
    const interval = setInterval(runAnimationCycle, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      layout
      className="relative flex items-center justify-center overflow-visible rounded-full bg-[#00C853] px-6 py-3.5 font-medium text-white select-none"
      whileTap={reduce || status !== "idle" ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      initial={false}
      suppressHydrationWarning
    >
      {/* Pulse rings */}
      <AnimatePresence>
        {mounted && !reduce && status === "loading" && (
          <>
            <motion.span
              key="ring-1"
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                outlineStyle: "solid",
                outlineWidth: 3,
                outlineColor: RING_COLOR,
              }}
              initial={{ outlineOffset: 0, opacity: 0.5 }}
              animate={{ outlineOffset: 14, opacity: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 1.8, repeat: Infinity, ease: EASE_APPLE }}
            />
            <motion.span
              key="ring-2"
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                outlineStyle: "solid",
                outlineWidth: 3,
                outlineColor: RING_COLOR,
              }}
              initial={{ outlineOffset: 0, opacity: 0.3 }}
              animate={{ outlineOffset: 14, opacity: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: EASE_APPLE,
                delay: 0.6,
              }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.div layout className="flex items-center">
        {/* 
          The Sliding Door Container: 
          Handles the space the icon takes up so flexbox doesn't squash the icon 
        */}
        <AnimatePresence initial={false}>
          {status !== "idle" && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 28, opacity: 1 }} // 20px for icon + 8px for gap
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_APPLE }}
              className="flex overflow-hidden items-center"
            >
              {/* The Fixed Container: Guarantees the icons stay perfectly circular */}
              <div className="relative h-5 w-5 shrink-0 mr-2">
                <AnimatePresence>
                  {status === "loading" && (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div
                        className="h-5 w-5 rounded-full border-[2.5px] border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  )}

                  {status === "success" && (
                    <motion.div
                      key="checkmark"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-white"
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-3.5 w-3.5 text-[#00C853]"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <path
                          d="M4.5 12.5L9 17L19.5 6.5"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.span layout className="font-bold whitespace-nowrap">
          {status === "idle" ? "Back Up Now" : "Backing Up"}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
