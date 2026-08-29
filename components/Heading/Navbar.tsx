"use client";

import Wrapper from "components/global/wrapper";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMediaQuery } from "hooks/use-media-query";
import { cn } from "lib/cn";
import { Menu as MenuIcon, X } from "lucide-react";
// @ts-ignore - metal-fx types not resolving correctly
// @ts-ignore - border-beam types may not resolve correctly
import { BorderBeam } from "border-beam";
import AnnouncementBanner from "components/announcement-banner";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  showBanner = false,
  transparent = false,
}: {
  siteName: string;
  categories: NavLink[];
  showBanner?: boolean;
  transparent?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMobile = !isLargeScreen;

  const handleMenuOpenChange = useCallback((open: boolean) => {
    setIsDesktopMenuOpen(open);
  }, []);

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
          "pointer-events-none fixed inset-0 z-40 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          transparent ? "bg-transparent" : "bg-black/[0.02]",
          isDesktopMenuOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-99 h-[88px]" />

      {/* Top scroll blur (mobile + desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 h-32 backdrop-blur-md",
          transparent ? "bg-transparent" : "bg-white/20",
        )}
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
        }}
      />

      {/* Bottom scroll blur (mobile + desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 backdrop-blur-sm"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
        }}
      />

      <AnimatePresence>
        {isVisible && (
          <header className="fixed inset-x-0 top-3 z-[999] flex flex-col items-center px-3 max-lg:top-[max(0.75rem,env(safe-area-inset-top))] lg:top-4">
            <Wrapper
              className={cn(
                "island-surface relative z-10 flex h-12 w-fit max-w-[calc(100vw-1.5rem)] items-center justify-between gap-2.5 rounded-full px-2 sm:gap-4 sm:px-2",
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
                  <div className="relative h-4 w-auto max-w-[5.5rem] sm:h-[1rem] sm:max-w-[6rem]">
                    {!logoLoaded && (
                      <div className="absolute inset-0 bg-neutral-200 rounded animate-pulse" />
                    )}
                    <Image
                      src="/morin.svg"
                      alt={siteName}
                      width={200}
                      height={43}
                      className={`h-4 w-auto max-w-[5.5rem] object-contain object-left grayscale opacity-60 sm:h-[1rem] sm:max-w-[6rem] transition-opacity duration-300 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
                      priority
                      onLoad={() => setLogoLoaded(true)}
                    />
                  </div>
                </Link>
                <Menu
                  categories={categories}
                  handleMenuOpenChangeAction={handleMenuOpenChange}
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
            {showBanner && (
              <div className="mt-1 relative">
                <AnnouncementBanner />
              </div>
            )}
          </header>
        )}
      </AnimatePresence>
    </div>
  );
}
