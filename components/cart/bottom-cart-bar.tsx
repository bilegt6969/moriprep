"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "lib/cn";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";

// 1. Upgrade to a premium spring transition
const smoothSpring = {
  type: "spring" as const,
  damping: 25,
  stiffness: 200,
  mass: 0.8,
};

const EXCLUDED_PATHS = [
  "/privacy",
  "/terms",
  "/support",
  "/cookie-settings",
  "/sign-in",
  "/signup",
  "/checkout",
  "/studio",
];

export default function BottomCartBar() {
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PATHS.some((path) => pathname?.startsWith(path));

  if (!cart || cart.totalQuantity === 0 || isExcluded) {
    return null;
  }

  const handleCheckout = async () => {
    setIsSubmitting(true);
    await redirectToCheckout();
  };

  const barVariants = {
    hidden: { y: 100, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: smoothSpring,
    },
  };

  // 2. Animate width and blur to prevent harsh snapping
  const contentVariants = {
    expanded: {
      opacity: 1,
      width: "auto",
      filter: "blur(0px)",
      scale: 1,
      paddingLeft: "0.5rem",
    },
    collapsed: {
      opacity: 0,
      width: 0,
      filter: "blur(4px)",
      scale: 0.9,
      paddingLeft: "0rem",
    },
  };

  const productImages = cart.lines
    .slice(0, 3)
    .map((line) => line.merchandise.product.featuredImage?.url)
    .filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        variants={barVariants}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-3"
      >
        {/* 3. Add 'layout' to the parent so it dynamically resizes */}
        <motion.div
          layout
          transition={smoothSpring}
          className="island-surface relative flex items-center gap-2 rounded-full px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 overflow-hidden"
        >
          <motion.div layout className="flex items-center gap-2">
            <motion.button
              layout
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="island-inset flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-800 transition-opacity hover:opacity-80"
              whileTap={{ scale: 0.9 }} // Add slight tap feedback
            >
              {/* 4. Smoothly swap the icons */}
              <AnimatePresence mode="wait">
                {isCollapsed ? (
                  <motion.svg
                    key="cart-icon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </motion.svg>
                ) : (
                  <motion.div
                    key="close-icon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.div
              layout
              className="island-inset flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-xs font-semibold text-neutral-800"
            >
              {cart.totalQuantity}
            </motion.div>
          </motion.div>

          {/* Expandable content */}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                layout
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={smoothSpring}
                // 5. whitespace-nowrap is crucial so text doesn't stack when width shrinks
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              >
                <div className="flex flex-col leading-tight">
                  <p className="text-neutral-500 text-[8px]">Cart total</p>
                  <p className="text-neutral-900 text-sm font-semibold">
                    {cart.cost.totalAmount.currencyCode}{" "}
                    {Number(cart.cost.totalAmount.amount).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className={cn(
                    "island-inset flex h-8 items-center rounded-full bg-white px-4 text-xs font-semibold text-neutral-800 transition-opacity hover:opacity-80 sm:px-5 sm:text-sm",
                    isSubmitting && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isSubmitting ? "..." : "Checkout"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
