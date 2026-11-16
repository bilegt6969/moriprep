"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    BarChart2,
    ChevronDown,
    CircleDollarSign,
    ClipboardList,
    Home,
    Info,
    Library,
    Menu,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Apple-style fluid spring physics
const iosSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export default function Navbar() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Practice Tests", href: "/tests", icon: ClipboardList },
    {
      name: "Question Banks",
      href: "#",
      icon: Library,
      hasDropdown: true,
    },
    { name: "Charts", href: "/charts", icon: BarChart2 },
    { name: "Donate", href: "/donate", icon: CircleDollarSign },
    { name: "About", href: "/about", icon: Info },
  ];

  const questionBankItems = [
    { title: "Reading & Writing", href: "/banks/rw" },
    { title: "Math", href: "/banks/math" },
    { title: "Vocabulary", href: "/banks/vocab" },
  ];

  return (
    <>
      {/* 
        Full-width, edge-to-edge macOS style frosted glass navbar.
        Positioned fixed to the top.
      */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-200/60 bg-white/85 px-4 backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-black/60 lg:px-6"
        onMouseLeave={() => {
          setHoveredNav(null);
          setIsDropdownOpen(false);
        }}
      >
        {/* Left: Brand Logo */}
        <div className="flex min-w-0 items-center lg:w-40">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-70"
            aria-label="Mori Prep"
          >
            <img
              src="/morin.svg"
              alt="Mori Prep"
              className="h-7 w-auto max-w-[7rem] object-contain opacity-75"
            />
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredNav === item.name;

            if (item.hasDropdown) {
              return (
                <div
                  key={item.name}
                  className="relative flex h-full items-center"
                  onMouseEnter={() => {
                    setHoveredNav(item.name);
                    setIsDropdownOpen(true);
                  }}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setIsDropdownOpen(true)}
                    className={`relative z-10 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
                      isHovered
                        ? "text-blue-600 dark:text-white"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} className="opacity-80" />
                    <span>{item.name}</span>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-0.5"
                    >
                      <ChevronDown size={14} strokeWidth={2.5} />
                    </motion.div>
                  </button>

                  {/* Sliding Hover Indicator */}
                  {isHovered && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-y-1.5 inset-x-0 z-0 rounded-lg bg-slate-100/80 dark:bg-white/10"
                      transition={iosSpring}
                    />
                  )}

                  {/* Glass Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={iosSpring}
                        className="absolute left-1/2 top-[44px] z-[100] w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200/60 bg-white/80 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-neutral-900/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                      >
                        {questionBankItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block rounded-md px-3 py-2 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <div
                key={item.name}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredNav(item.name)}
              >
                <Link
                  href={item.href}
                  className={`relative z-10 flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
                    isHovered
                      ? "text-blue-600 dark:text-white"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <Icon size={16} strokeWidth={2} className="opacity-80" />
                  <span>{item.name}</span>
                </Link>

                {/* Sliding Hover Indicator (Shared layoutId connects them) */}
                {isHovered && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-y-1.5 inset-x-0 z-0 rounded-lg bg-slate-100/80 dark:bg-white/10"
                    transition={iosSpring}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Blue Profile Avatar from Reference Image */}
        <div className="flex items-center justify-end gap-2 lg:w-40">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            type="button"
            aria-label="User Profile"
            className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-sm transition-transform hover:scale-105 active:scale-95 lg:flex"
          >
            <User size={16} strokeWidth={2.5} />
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav
            id="mobile-primary-navigation"
            aria-label="Main navigation"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-slate-200/70 bg-white/95 p-3 shadow-xl backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-neutral-950/95"
          >
            {mainNavItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.name} className="border-b border-slate-100 py-1 dark:border-white/10">
                  <button
                    type="button"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen((open) => !open)}
                    className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={17} aria-hidden="true" />
                      {item.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="pb-2 pl-10">
                      {questionBankItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-10 items-center rounded-lg px-3 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <item.icon size={17} aria-hidden="true" />
                  {item.name}
                </Link>
              ),
            )}
          </nav>
        )}
      </header>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-14 w-full" />
    </>
  );
}
