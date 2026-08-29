"use client";

import {
  AnimatedSidebar,
  AnimatedSidebarClose,
  AnimatedSidebarContent,
  AnimatedSidebarFooter,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarMenuSub,
  AnimatedSidebarMenuSubButton,
  AnimatedSidebarMenuSubItem,
  AnimatedSidebarProvider,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
  useAnimatedSidebar,
} from "@/components/motion/animated-sidebar";
import { EASE_OUT, SPRING_PRESS } from "@/lib/ease";
import {
  collection,
  db,
  auth as firebaseAuth,
  onSnapshot,
  query,
  where,
} from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  BarChart3,
  BookOpen,
  ChevronsUpDown,
  History,
  LogOut,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

const LOGO_MORPH_DURATION = 0.36; // mirrors SIDEBAR_MORPH_DURATION in animated-sidebar.tsx

// NOTE: removed hardcoded width/height attrs — sizing now comes purely from
// the `size-4` className passed at call sites, so these line up exactly
// with the 16px Lucide icons instead of rendering at 18px.
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="currentColor"
    className={className}
  >
    <path
      d="M5.81299 12.188H12.188M2.81299 7.70599C2.81299 7.07899 2.81299 6.76599 2.89099 6.47599C2.96099 6.21899 3.07599 5.97599 3.23099 5.75999C3.40499 5.51499 3.64799 5.31699 4.13299 4.91999L6.71999 2.80299C7.53199 2.13799 7.93899 1.80599 8.38999 1.67899C8.7889 1.56664 9.21108 1.56664 9.60999 1.67899C10.061 1.80599 10.467 2.13899 11.28 2.80299L13.867 4.91999C14.352 5.31699 14.595 5.51499 14.769 5.75999C14.924 5.97699 15.039 6.21899 15.109 6.47599C15.188 6.76599 15.188 7.07899 15.188 7.70599V11.588C15.188 12.848 15.188 13.478 14.942 13.959C14.7263 14.3822 14.3822 14.7263 13.959 14.942C13.478 15.188 12.848 15.188 11.588 15.188H6.41299C5.15299 15.188 4.52299 15.188 4.04099 14.942C3.61777 14.7263 3.27368 14.3822 3.05799 13.959C2.81299 13.478 2.81299 12.848 2.81299 11.588V7.70599Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const TestIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="currentColor"
    className={className}
  >
    <path
      d="M5.0625 7.875C6.6158 7.875 7.875 6.6158 7.875 5.0625C7.875 3.5092 6.6158 2.25 5.0625 2.25C3.5092 2.25 2.25 3.5092 2.25 5.0625C2.25 6.6158 3.5092 7.875 5.0625 7.875Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.0625 15.75C6.6158 15.75 7.875 14.4908 7.875 12.9375C7.875 11.3842 6.6158 10.125 5.0625 10.125C3.5092 10.125 2.25 11.3842 2.25 12.9375C2.25 14.4908 3.5092 15.75 5.0625 15.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12.9375 7.875C14.4908 7.875 15.75 6.6158 15.75 5.0625C15.75 3.5092 14.4908 2.25 12.9375 2.25C11.3842 2.25 10.125 3.5092 10.125 5.0625C10.125 6.6158 11.3842 7.875 12.9375 7.875Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12.9375 15.75C14.4908 15.75 15.75 14.4908 15.75 12.9375C15.75 11.3842 14.4908 10.125 12.9375 10.125C11.3842 10.125 10.125 11.3842 10.125 12.9375C10.125 14.4908 11.3842 15.75 12.9375 15.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const ResourcesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="currentColor"
    className={className}
  >
    <path
      d="M2.99975 6V4.49999C2.99975 3.67157 3.67133 3 4.49975 3H10.4997C11.3282 3 11.9997 3.67157 11.9997 4.49999M2.99975 6H6.13136C6.52919 6 6.91072 6.15803 7.19202 6.43934L8.56332 7.81064C8.84465 8.09197 9.22622 8.25 9.62402 8.25H11.9997M2.99975 6C2.58715 6 2.25269 6.33447 2.25269 6.74707V13.5C2.25269 14.3285 2.92426 15 3.75269 15H14.2527C15.0812 15 15.7527 14.3285 15.7527 13.5V9.00288C15.7527 8.58712 15.4155 8.25 14.9997 8.25M11.9997 4.49999V8.25M11.9997 4.49999H13.4998C14.3282 4.49999 14.9997 5.17157 14.9997 6V8.25M11.9997 8.25H14.9997"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SidebarToggleIcon = ({
  className,
  isOpen,
}: {
  className?: string;
  isOpen?: boolean;
}) => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="currentColor"
    className={className}
    animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
  >
    <rect
      x="10.5"
      y="6.5"
      width="7"
      height="5"
      rx="1"
      transform="rotate(90 10.5 6.5)"
      fill="currentColor"
    />
    <rect
      x="3"
      y="4"
      width="14"
      height="12"
      rx="2.8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </motion.svg>
);

const navigationItems = [
  { label: "Home", href: "/home", icon: HomeIcon },
  { label: "Test", href: "/practice", icon: TestIcon },
  {
    label: "Lessons",
    icon: BookOpen,
    hasSubmenu: true,
    subItems: [
      { label: "Math", href: "/resources/math" },
      { label: "Reading & Writing", href: "/resources/rw" },
    ],
  },
  { label: "Resources", href: "/resources", icon: ResourcesIcon },
  { label: "History", href: "/history", icon: History },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const settingsItems = [
  { label: "General settings", href: "/settings", icon: Settings },
];

// Shared class strings so active/hover states are byte-for-byte identical
// across the main nav and the settings nav — this is what was producing the
// "chopped" look, since the two lists previously used slightly different
// class ordering. `!rounded-[10px]` forces the corner radius even if the
// underlying AnimatedSidebarMenuButton ships its own conflicting radius.
// IMPORTANT: do NOT put a bg-* class on the active state here.
// AnimatedSidebarMenuButton already paints the active pill itself (a
// layoutId-animated <span>, see animated-sidebar.tsx). Adding a background
// here stacks a second, differently-sized rounded rect underneath it,
// which is what produced the "chopped"/double-edge pill. Active state is
// text color + weight only; the pill itself is the component's job.
// No radius override here either — the component already sets rounded-xl
// on the button itself, and the active pill matches that automatically.
// Redefining it here risked a 1-2px radius mismatch between the button box
// and the pill sitting inside it.
const NAV_ITEM_BASE = "transition-colors duration-150";
const NAV_ITEM_ACTIVE = "text-zinc-900 font-semibold";
const NAV_ITEM_INACTIVE =
  "text-zinc-500 font-medium hover:text-zinc-900 hover:bg-black/[0.035] rounded-xl";

function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    const parent = navigationItems.find((item) =>
      item.subItems?.some((sub) => isPathActive(pathname, sub.href)),
    );
    return parent?.label ?? null;
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const parent = navigationItems.find((item) =>
      item.subItems?.some((sub) => isPathActive(pathname, sub.href)),
    );
    if (parent) setOpenSubmenu(parent.label);
  }, [pathname]);

  useEffect(() => {
    if (!firebaseAuth) return;
    const unsubscribe = onAuthStateChanged(firebaseAuth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    if (firebaseAuth) signOut(firebaseAuth);
  };

  return (
    <AnimatedSidebarProvider defaultOpen={true}>
      <AppNavbarContent
        children={children}
        user={user}
        handleSignOut={handleSignOut}
        pathname={pathname}
        openSubmenu={openSubmenu}
        setOpenSubmenu={setOpenSubmenu}
      />
    </AnimatedSidebarProvider>
  );
}

function AppNavbarContent({
  children,
  user,
  handleSignOut,
  pathname,
  openSubmenu,
  setOpenSubmenu,
}: {
  children: React.ReactNode;
  user: User | null;
  handleSignOut: () => void;
  pathname: string;
  openSubmenu: string | null;
  setOpenSubmenu: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const reduce = useReducedMotion();
  const { state, open: sidebarOpen, isMobile } = useAnimatedSidebar();
  const collapsed = !isMobile && !sidebarOpen;
  const [streak, setStreak] = useState(0);

  // Fetch streak data from Firebase
  useEffect(() => {
    if (!firebaseAuth || !db || !user) return;

    const q = query(
      collection(db, "userProgress"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const answers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate practice streak (same logic as analytics page)
      if (answers.length === 0) {
        setStreak(0);
        return;
      }

      const dates = answers
        .map((p: any) =>
          p.lastAttemptedAt ? new Date(p.lastAttemptedAt).toDateString() : null,
        )
        .filter((d) => d !== null)
        .reverse();

      const uniqueDates = [...new Set(dates)];
      let calculatedStreak = 0;
      let currentDate = new Date();

      for (const date of uniqueDates) {
        const answerDate = new Date(date);
        const diffDays = Math.floor(
          (currentDate.getTime() - answerDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (diffDays === calculatedStreak) {
          calculatedStreak++;
          currentDate = new Date(answerDate);
        } else if (diffDays === calculatedStreak + 1) {
          calculatedStreak++;
          currentDate = new Date(answerDate);
        } else {
          break;
        }
      }

      setStreak(calculatedStreak);
    });

    return () => unsubscribe();
  }, [user]);

  const activeLabel = useMemo(() => {
    for (const item of navigationItems) {
      if (item.hasSubmenu) {
        const activeSub = item.subItems.find((sub) =>
          isPathActive(pathname, sub.href),
        );
        if (activeSub) return activeSub.label;
      }
      if (isPathActive(pathname, item.href)) return item.label;
    }
    const activeSetting = settingsItems.find((item) =>
      isPathActive(pathname, item.href),
    );
    return activeSetting?.label ?? "Home";
  }, [pathname]);

  return (
    <>
      <AnimatedSidebar
        ariaLabel="Mori Prep navigation"
        collapsible="icon"
        variant="sidebar"
        className="bg-[#f5f5f7]/80 border-r border-black/[0.04] backdrop-blur-3xl"
      >
        {/*
          The icon column's left edge sits 28px from the sidebar's left
          edge: AnimatedSidebarContent's px-3 (12px) + AnimatedSidebarGroup's
          px-1 (4px) + the menu button's own px-3 (12px) = 28px. The header
          below reproduces that exact stack — px-3 here (12px) + pl-4 on the
          row (16px) — instead of guessing at a padding value, so the
          wordmark's left edge lands on the same 28px line as "Home"/"Test"
          rather than ~8px short of it.
        */}
        <AnimatedSidebarHeader className="px-3 pt-6 pb-3">
          <div className="flex h-8 items-center justify-between gap-2 pl-4 pr-1">
            <div className="flex items-center gap-2.5 min-w-0 relative h-8">
              <AnimatePresence initial={false} mode="wait">
                {collapsed ? (
                  <motion.div
                    key="mark"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{
                      duration: LOGO_MORPH_DURATION * 0.4,
                      delay: LOGO_MORPH_DURATION * 0.3,
                      ease: EASE_OUT,
                    }}
                  >
                    <Image
                      src="/logo/logo.png"
                      alt="Mori Prep"
                      width={96}
                      height={30}
                      className="h-7 w-auto object-contain shrink-0"
                      priority
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="wordmark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: LOGO_MORPH_DURATION * 0.4,
                      delay: LOGO_MORPH_DURATION * 0.35,
                      ease: EASE_OUT,
                    }}
                  >
                    <Image
                      src="/morin.svg"
                      alt="Mori Prep"
                      width={110}
                      height={26}
                      className="h-6 w-auto object-contain shrink-0 drop-shadow-sm"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatedSidebarClose className="grid size-7 shrink-0 place-items-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-black/[0.05] transition-colors md:hidden">
              <X aria-hidden="true" className="size-4" />
            </AnimatedSidebarClose>
          </div>
        </AnimatedSidebarHeader>

        <AnimatedSidebarContent className="px-3 pt-2">
          <AnimatedSidebarGroup className="pb-4">
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-1">
                {navigationItems.map((item) => {
                  const isActive = item.hasSubmenu
                    ? item.subItems?.some((sub) =>
                        isPathActive(pathname, sub.href),
                      )
                    : isPathActive(pathname, item.href);

                  return (
                    <AnimatedSidebarMenuItem key={item.label}>
                      {item.hasSubmenu ? (
                        <>
                          <AnimatedSidebarMenuButton
                            isActive={isActive}
                            ariaExpanded={openSubmenu === item.label}
                            icon={
                              item.icon && (
                                <item.icon className="size-4 shrink-0" />
                              )
                            }
                            className={`${NAV_ITEM_BASE} ${
                              isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
                            }`}
                            onSelect={() => {
                              setOpenSubmenu((prev) =>
                                prev === item.label ? null : item.label,
                              );
                            }}
                          >
                            {item.label}
                          </AnimatedSidebarMenuButton>
                          <AnimatedSidebarMenuSub
                            open={openSubmenu === item.label}
                          >
                            {item.subItems?.map((subItem) => (
                              <AnimatedSidebarMenuSubItem key={subItem.label}>
                                <AnimatedSidebarMenuSubButton
                                  isActive={isPathActive(
                                    pathname,
                                    subItem.href,
                                  )}
                                  href={subItem.href}
                                  className={`!rounded-[8px] text-[13px] px-3 transition-colors ${
                                    isPathActive(pathname, subItem.href)
                                      ? "text-zinc-900 font-semibold bg-black/[0.04]"
                                      : "text-zinc-500 hover:text-zinc-900"
                                  }`}
                                >
                                  {subItem.label}
                                </AnimatedSidebarMenuSubButton>
                              </AnimatedSidebarMenuSubItem>
                            ))}
                          </AnimatedSidebarMenuSub>
                        </>
                      ) : (
                        <AnimatedSidebarMenuButton
                          isActive={isActive}
                          icon={
                            item.icon && (
                              <item.icon className="size-4 shrink-0" />
                            )
                          }
                          href={item.href}
                          className={`${NAV_ITEM_BASE} ${
                            isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
                          }`}
                        >
                          {item.label}
                        </AnimatedSidebarMenuButton>
                      )}
                    </AnimatedSidebarMenuItem>
                  );
                })}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>

          <AnimatedSidebarGroup className="mt-auto">
            <AnimatedSidebarGroupLabel className="text-[11px] font-semibold text-zinc-400 tracking-widest uppercase px-3 mb-1">
              Settings
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-1">
                {settingsItems.map((item) => {
                  const isActive = isPathActive(pathname, item.href);
                  return (
                    <AnimatedSidebarMenuItem key={item.label}>
                      <AnimatedSidebarMenuButton
                        isActive={isActive}
                        icon={<item.icon className="size-4 shrink-0" />}
                        href={item.href}
                        className={`${NAV_ITEM_BASE} ${
                          isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
                        }`}
                      >
                        {item.label}
                      </AnimatedSidebarMenuButton>
                    </AnimatedSidebarMenuItem>
                  );
                })}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>

        <AnimatedSidebarFooter className="p-3 pt-2">
          <ProfileMenu user={user} onSignOut={handleSignOut} />
        </AnimatedSidebarFooter>

        <AnimatedSidebarRail />
      </AnimatedSidebar>

      {/* Main Content Area */}
      <AnimatedSidebarInset className="bg-white h-screen overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 sm:gap-4 px-4 sm:px-6 border-b border-zinc-200 bg-white/70 backdrop-blur-2xl">
          <AnimatedSidebarTrigger className="text-zinc-400 transition-colors hover:text-zinc-900">
            <SidebarToggleIcon
              aria-hidden="true"
              className="size-5"
              isOpen={sidebarOpen}
            />
          </AnimatedSidebarTrigger>
          <div className="h-3 w-[1px] bg-zinc-200" />
          <p className="text-[14px] font-semibold text-zinc-800 tracking-tight truncate">
            {activeLabel}
          </p>
          <div className="flex-1" />
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00] text-white">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177A7.547 7.547 0 0 1 6.648 6.874a.75.75 0 0 0-1.152.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[15px] font-bold">{streak}</span>
          </div>
        </header>

        {/*
          Responsive content padding: tight on mobile, roomier on larger
          screens, instead of a fixed p-8 that eats most of a phone screen.
        */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-zinc-50/20">
          {children}
        </div>
      </AnimatedSidebarInset>
    </>
  );
}

function ProfileMenu({
  user,
  onSignOut,
}: {
  user: User | null;
  onSignOut: () => void;
}) {
  const { open, isMobile } = useAnimatedSidebar();
  const reduce = useReducedMotion();
  const collapsed = !isMobile && !open;
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = "profile-dropdown-menu";

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (collapsed) setMenuOpen(false);
  }, [collapsed]);

  if (!user) {
    return (
      <a
        href="/sign-in"
        className="flex items-center gap-3 rounded-[12px] px-2 py-2 transition-colors hover:bg-black/[0.04]"
      >
        <div className="grid size-[34px] shrink-0 place-items-center rounded-full bg-zinc-200/50 text-zinc-500 text-xs font-semibold">
          ?
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-zinc-900 tracking-tight">
              Not signed in
            </span>
            <span className="block truncate text-[11px] font-medium text-zinc-500">
              Sign in to sync progress
            </span>
          </div>
        )}
      </a>
    );
  }

  const initial = (user.email?.[0] ?? "U").toUpperCase();
  const photoURL = user.photoURL;

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {menuOpen && !collapsed && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute bottom-[calc(100%+8px)] left-0 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[14px] border border-black/[0.04] bg-white/85 backdrop-blur-2xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          >
            <a
              href="/settings"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-black/[0.04]"
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="size-4 text-zinc-500" aria-hidden="true" />
              Settings
            </a>
            <div className="my-1 h-px w-full bg-black/[0.04]" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={SPRING_PRESS}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? menuId : undefined}
        className="flex w-full items-center gap-3 rounded-[12px] px-2 py-2 text-left transition-colors hover:bg-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            className="size-[34px] shrink-0 rounded-full object-cover border border-black/[0.04]"
          />
        ) : (
          <div className="grid size-[34px] shrink-0 place-items-center rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800 text-white text-[11px] font-semibold">
            {initial}
          </div>
        )}
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-zinc-900 tracking-tight">
                {user.displayName || "User"}
              </span>
              <span className="block truncate text-[11px] font-medium text-zinc-500">
                {user.email || "user@moriprep.xyz"}
              </span>
            </div>
            <ChevronsUpDown
              aria-hidden="true"
              className="size-[14px] shrink-0 text-zinc-400"
            />
          </>
        )}
      </motion.button>
    </div>
  );
}
