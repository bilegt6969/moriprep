"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LiteNavbar() {
  const reduce = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white border-b border-gray-200 flex justify-center sticky top-0 z-50"
    >
      <div className="w-full max-w-[600px] px-6 py-4 flex items-center">
        <motion.button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer p-0 group"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduce ? undefined : { scale: 1.05 }}
          whileTap={reduce ? undefined : { scale: 0.95 }}
          tabIndex={0}
        >
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
            whileHover={reduce ? undefined : { x: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </motion.svg>
          <motion.span
            className="transition-colors duration-300 ease-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Back
          </motion.span>
        </motion.button>

        <div className="ml-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduce ? undefined : { scale: 1.1, rotate: 5 }}
          >
            <Link href="/" className="flex items-center h-5 cursor-pointer">
              <motion.img
                src="/morin.svg"
                alt="Brand Logo"
                className="h-full w-auto object-contain opacity-80"
                whileHover={reduce ? undefined : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
