"use client";

import { motion } from "framer-motion";
import { cn } from "lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

export default function AppMenu({
  categories,
  onOpenChange,
}: {
  categories: NavLink[];
  onOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(
    categories[0]?.href || "/home",
  );

  // Keep the active tab synced with the current URL
  useEffect(() => {
    if (pathname) {
      const currentTab = categories.find((tab) => pathname.includes(tab.href));
      if (currentTab) {
        setActiveTab(currentTab.href);
      } else {
        // Fallback default if on home page or unmatched route
        setActiveTab(categories[0]?.href || "/home");
      }
    }
  }, [pathname, categories]);

  return (
    <nav className="relative z-50 hidden items-center justify-center lg:flex">
      {/* Tighter gap to keep the links closely bound together */}
      <ul className="flex items-center gap-2">
        {categories.map((tab) => {
          const isActive = activeTab === tab.href;

          return (
            <li
              key={tab.href}
              className="relative flex items-center justify-center"
            >
              <Link
                href={tab.href}
                onClick={() => {
                  setActiveTab(tab.href);
                  onOpenChange?.(false);
                }}
                className={cn(
                  "relative z-10 px-4 py-1.5 text-[13.5px] font-medium tracking-wide outline-none transition-colors duration-200",
                  isActive
                    ? "text-neutral-500"
                    : "text-neutral-500 hover:text-neutral-700 focus-visible:text-neutral-900",
                )}
              >
                {tab.label}
              </Link>

              {/* The Sliding Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 z-0 rounded-full bg-white/70"
                  style={{
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
