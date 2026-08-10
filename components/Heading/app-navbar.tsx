"use client";

import { useMediaQuery } from "hooks/use-media-query";
import { cn } from "lib/cn";
import { Menu as MenuIcon, X } from "lucide-react";
// @ts-ignore - border-beam types may not resolve correctly
import { BorderBeam } from "border-beam";
import AnnouncementBanner from "components/announcement-banner";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Menu from "./app-menu";
import MobileMenu from "./app-mobile-menu";
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
}: {
  siteName: string;
  categories: NavLink[];
  showBanner?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMobile = !isLargeScreen;

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

  return (
    <div className="relative w-full">
      {/* Top scroll blur (mobile + desktop) */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[10] h-32 bg-white/20 backdrop-blur-md"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
        }}
      />

      {/* Global Backdrop Blur - only for desktop menu */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[20] bg-black/[0.02] backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isDesktopMenuOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[30] h-[88px]" />

      <header className="fixed inset-x-0 top-3 z-[50] flex flex-col items-center px-3 max-lg:top-[max(0.75rem,env(safe-area-inset-top))] lg:top-4">
        {/* Reduced gap to match the tight spacing in the screenshot */}
        <div className="relative flex items-center justify-between w-full">
          {/* Logo - Far Left */}
          <div className="flex h-12 shrink-0 items-center justify-center px-2">
            <Link
              href="/"
              prefetch
              className="flex h-8 shrink-0 items-center justify-center rounded-full  px-4 transition-opacity hover:opacity-80"
              aria-label={siteName}
            >
              <Image
                src="/morin.svg"
                alt={siteName}
                width={1666}
                height={360}
                className="h-[1.2rem] w-auto max-w-[6.6rem] object-contain opacity-100 sm:h-[1.35rem] sm:max-w-[7.2rem]"
                priority
              />
            </Link>
          </div>

          {/* Navigation Items - Middle - Absolutely centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 island-surface flex h-12 items-center justify-center rounded-full px-2">
            <Menu categories={categories} onOpenChange={setIsDesktopMenuOpen} />
          </div>

          {/* Account Section - Far Right */}
          <div className="flex h-12 shrink-0 items-center justify-center px-2">
            <div className="flex items-center">
              <div className="relative flex items-center">
                <BorderBeam
                  size="line"
                  colorVariant="mono"
                  className="hidden rounded-full lg:inline-flex"
                >
                  <SignInButton />
                </BorderBeam>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/5 lg:hidden"
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
          </div>
        </div>

        {showBanner && (
          <div className="mt-1 relative z-0">
            <AnnouncementBanner />
          </div>
        )}

        {!isLargeScreen && (
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            categories={categories}
          />
        )}
      </header>
    </div>
  );
}
