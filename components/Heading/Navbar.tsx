"use client";

import Wrapper from "components/global/wrapper";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMediaQuery } from "hooks/use-media-query";
import { cn } from "lib/cn";
import { Menu as MenuIcon, X } from "lucide-react";
// @ts-ignore - metal-fx types not resolving correctly
// @ts-ignore - border-beam types may not resolve correctly
import { BorderBeam } from "border-beam";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Menu from "./menu";
import MobileMenu from "./mobile-menu";
import { SignInButton } from "./sign-in-button";

interface NavLink {
  label: string;
  href: string;
  description?: string;
}

const smoothEase: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function Navbar({
  siteName,
  categories,
}: {
  siteName: string;
  categories: NavLink[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMobile = !isLargeScreen;

  // Mount timer
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLargeScreen && isOpen) setIsOpen(false);
  }, [isLargeScreen, isOpen]);

  useEffect(() => {
    const isMobileMenuOpen = isOpen && isMobile;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  const navbarVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 28,
        mass: 0.8,
        opacity: { duration: 0.4, ease: smoothEase },
      },
    },
  };

  return (
    <div className="relative w-full">
      {/* The Global Backdrop Blur 
        Softened the background tint and increased the blur slightly for a smoother effect 
      */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[95] bg-black/[0.02] backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isDesktopMenuOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[99] h-[88px]" />

      {/* Top scroll blur (mobile + desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-32 bg-white/20 backdrop-blur-md"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
        }}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.header
            variants={navbarVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-x-0 top-3 z-[100] flex justify-center px-3 max-lg:top-[max(0.75rem,env(safe-area-inset-top))] lg:top-4"
          >
            <Wrapper
              className={cn(
                "island-surface flex h-12 w-fit max-w-[calc(100vw-1.5rem)] items-center justify-between gap-2.5 rounded-full px-2 sm:gap-4 sm:px-2",
              )}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  href="/"
                  prefetch
                  className="island-inset relative flex h-8 shrink-0 items-center rounded-full bg-white px-3 transition-opacity hover:opacity-80 sm:px-2.5"
                  aria-label={siteName}
                  style={{
                    boxShadow:
                      "inset 0 1px 2px rgba(0,0,0,0.08), inset 0 -1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <Image
                    src="/morin.svg"
                    alt={siteName}
                    width={1666}
                    height={360}
                    className="h-4 w-auto max-w-[5.5rem] object-contain object-left opacity-60 sm:h-[1rem] sm:max-w-[6rem]"
                    priority
                  />
                </Link>
                <Menu
                  categories={categories}
                  onOpenChange={setIsDesktopMenuOpen}
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="relative flex items-center">
                  <BorderBeam
                    size="line"
                    colorVariant="mono"
                    className="rounded-full hidden lg:inline-flex"
                  >
                    <SignInButton />
                  </BorderBeam>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/5 lg:hidden"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <MenuIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!isLargeScreen && (
                <MobileMenu
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  categories={categories}
                />
              )}
            </Wrapper>
          </motion.header>
        )}
      </AnimatePresence>
    </div>
  );
}
