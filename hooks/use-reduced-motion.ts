import { useReducedMotion as framerUseReducedMotion } from "framer-motion";

/**
 * Wrapper around framer-motion's useReducedMotion with fallback.
 * Returns true if the user prefers reduced motion, false otherwise.
 *
 * This hook should be used to conditionally disable or reduce motion-sensitive
 * animations (scale, translate, rotate) while preserving essential feedback
 * (color, opacity, focus states).
 */
export function useReducedMotion() {
  return framerUseReducedMotion() ?? false;
}
