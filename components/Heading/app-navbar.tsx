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
  AnimatedSidebarTrigger,
  useAnimatedSidebar,
} from "@/components/motion/animated-sidebar";
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
  HelpCircle,
  History,
  LogOut,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

// Apple-style UI Colors & Utilities
const COLORS = {
  bgGray: "#F5F5F7",
  textMain: "#1D1D1F",
  textMuted: "#86868B",
  activeBg: "rgba(0, 0, 0, 0.05)",
  hoverBg: "rgba(0, 0, 0, 0.03)",
};

const RAIL_PAD =
  "transition-[padding] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]"; // keep in sync with SIDEBAR_MORPH_DURATION

const fadeMask = (stops: string): React.CSSProperties => ({
  maskImage: `linear-gradient(to bottom, ${stops})`,
  WebkitMaskImage: `linear-gradient(to bottom, ${stops})`,
});

// Uniform Custom Icons (Forced to 16px size and 1.5 stroke to match exactly)
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    color="currentColor"
    className={className}
  >
    <path
      d="M5.812 12.188H12.188M2.813 7.706C2.813 7.079 2.813 6.766 2.891 6.476C2.961 6.219 3.076 5.976 3.231 5.76C3.405 5.515 3.648 5.317 4.133 4.92L6.72 2.803C7.532 2.138 7.939 1.806 8.39 1.679C8.789 1.567 9.211 1.567 9.61 1.679C10.061 1.806 10.467 2.139 11.282 2.803L13.867 4.92C14.352 5.317 14.595 5.515 14.769 5.76C14.924 5.977 15.039 6.219 15.109 6.476C15.188 6.766 15.188 7.079 15.188 7.706V11.588C15.188 12.848 15.188 13.478 14.942 13.959C14.726 14.382 14.382 14.726 13.959 14.942C13.478 15.188 12.848 15.188 11.588 15.188H6.413C5.153 15.188 4.523 15.188 4.041 14.942C3.618 14.726 3.274 14.382 3.058 13.959C2.813 13.478 2.813 12.848 2.813 11.588V7.706Z"
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
    color="currentColor"
    className={className}
  >
    <path
      d="M5.062 7.875C6.616 7.875 7.875 6.616 7.875 5.062C7.875 3.509 6.616 2.25 5.062 2.25C3.509 2.25 2.25 3.509 2.25 5.062C2.25 6.616 3.509 7.875 5.062 7.875Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.062 15.75C6.616 15.75 7.875 14.491 7.875 12.937C7.875 11.384 6.616 10.125 5.062 10.125C3.509 10.125 2.25 11.384 2.25 12.937C2.25 14.491 3.509 15.75 5.062 15.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12.937 7.875C14.491 7.875 15.75 6.616 15.75 5.062C15.75 3.509 14.491 2.25 12.937 2.25C11.384 2.25 10.125 3.509 10.125 5.062C10.125 6.616 11.384 7.875 12.937 7.875Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12.937 15.75C14.491 15.75 15.75 14.491 15.75 12.937C15.75 11.384 14.491 10.125 12.937 10.125C11.384 10.125 10.125 11.384 10.125 12.937C10.125 14.491 11.384 15.75 12.937 15.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    color="currentColor"
    className={className}
  >
    <rect
      x="2"
      y="2"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="2"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="2"
      y="10"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="10"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const CommunityIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    color="currentColor"
    className={className}
  >
    <path
      d="M9 9C11.209 9 13 7.209 13 5C13 2.791 11.209 1 9 1C6.791 1 5 2.791 5 5C5 7.209 6.791 9 9 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M17 17C17 14.239 13.418 12 9 12C4.582 12 1 14.239 1 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ResourcesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    color="currentColor"
    className={className}
  >
    <path
      d="M2.999 6V4.499C2.999 3.671 3.671 3 4.499 3H10.499C11.328 3 11.999 3.671 11.999 4.499M2.999 6H6.131C6.529 6 6.91 6.158 7.192 6.439L8.563 7.81C8.844 8.091 9.226 8.25 9.624 8.25H11.999M2.999 6C2.587 6 2.252 6.334 2.252 6.747V13.5C2.252 14.328 2.924 15 3.752 15H14.252C15.081 15 15.752 14.328 15.752 13.5V9.002C15.752 8.587 15.415 8.25 14.999 8.25M11.999 4.499V8.25M11.999 4.499H13.499C14.328 4.499 14.999 5.171 14.999 6V8.25M11.999 8.25H14.999"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

type NavItem =
  | {
      label: string;
      href: string;
      icon:
        | React.ComponentType<{ className?: string }>
        | React.ForwardRefExoticComponent<any>;
      comingSoon?: boolean;
    }
  | {
      label: string;
      icon:
        | React.ComponentType<{ className?: string }>
        | React.ForwardRefExoticComponent<any>;
      hasSubmenu: true;
      subItems: { label: string; href: string }[];
      comingSoon?: boolean;
    };

type NavGroup = {
  label: string | null;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { label: "Overview", href: "/overview", icon: HomeIcon },
      { label: "Question Rush", href: "/question-rush", icon: TestIcon },
      { label: "Practice Test", href: "/practice-test", icon: BookOpen },
    ],
  },
  {
    label: "learn",
    items: [
      {
        label: "Lessons",
        icon: BookOpen,
        href: "/lessons",
        comingSoon: true,
      },
      { label: "Resources", href: "/resources", icon: ResourcesIcon },
      { label: "Blog", href: "/blog", icon: BookOpen },
    ],
  },
  {
    label: "progress",
    items: [
      { label: "History", href: "/history", icon: History },
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "community",
    items: [
      {
        label: "Community",
        href: "/community",
        icon: CommunityIcon,
        comingSoon: true,
      },
      { label: "Help", href: "/support", icon: HelpCircle },
    ],
  },
];

const navigationItems: NavItem[] = navGroups.flatMap((group) => group.items);
const settingsItems: NavItem[] = [
  { label: "Account", href: "/account", icon: Settings },
];

// True Apple Styling Rules: Absolutely no borders, flat rounded shapes, uniform sizing
const NAV_ITEM_BASE =
  "flex items-center gap-3 h-[30px] px-3 rounded-[10px] text-[13.5px] transition-colors duration-200 w-full outline-none";
const NAV_ITEM_ACTIVE = "bg-black/[0.05] text-[#1D1D1F] font-semibold";
const NAV_ITEM_INACTIVE =
  "text-[#545459] font-medium hover:text-[#1D1D1F] hover:bg-black/[0.03]";

const NAV_GROUP_LABEL =
  "text-[12px] font-medium text-[#545459] uppercase px-3 mt-4 mb-1 tracking-wide whitespace-nowrap";

function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  // Check for exact match first
  if (pathname === href) return true;
  // Then check if pathname starts with href AND the next character is a slash or there is no next character
  // This prevents /practice-test from matching /question-rush
  if (pathname.startsWith(href)) {
    const nextChar = pathname[href.length];
    return nextChar === "/" || nextChar === undefined;
  }
  return false;
}

export function AppNavbar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    const parent = navigationItems.find(
      (item) =>
        "subItems" in item &&
        item.subItems?.some((sub) => isPathActive(pathname, sub.href)),
    );
    return parent?.label ?? null;
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const parent = navigationItems.find(
      (item) =>
        "subItems" in item &&
        item.subItems?.some((sub) => isPathActive(pathname, sub.href)),
    );
    if (parent) setOpenSubmenu(parent.label);
  }, [pathname]);

  useEffect(() => {
    if (!firebaseAuth) return;
    const unsubscribe = onAuthStateChanged(firebaseAuth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <AnimatedSidebarProvider defaultOpen={true} className="bg-[#F5F5F7]">
      <AppNavbarContent
        children={children}
        user={user}
        handleSignOut={() => firebaseAuth && signOut(firebaseAuth)}
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
  const { open: sidebarOpen, isMobile } = useAnimatedSidebar();
  const collapsed = !isMobile && !sidebarOpen;
  const [streak, setStreak] = useState(0);

  // Fetch Streak (Unchanged logic)
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
      if (answers.length === 0) return setStreak(0);
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
        if (
          diffDays === calculatedStreak ||
          diffDays === calculatedStreak + 1
        ) {
          calculatedStreak++;
          currentDate = new Date(answerDate);
        } else break;
      }
      setStreak(calculatedStreak);
    });
    return () => unsubscribe();
  }, [user]);

  const activeLabel = useMemo(() => {
    for (const item of navigationItems) {
      if ("hasSubmenu" in item && item.hasSubmenu && item.subItems) {
        const activeSub = item.subItems.find((sub) =>
          isPathActive(pathname, sub.href),
        );
        if (activeSub) return activeSub.label;
      }
      if ("href" in item) {
        if (isPathActive(pathname, item.href)) return item.label;
      }
    }
    const activeSetting = settingsItems.find(
      (item) => "href" in item && isPathActive(pathname, item.href),
    );
    return activeSetting?.label ?? "Overview";
  }, [pathname]);

  return (
    <>
      <AnimatedSidebar
        ariaLabel="MoriPrep navigation"
        collapsible="icon"
        variant="inset"
        // NO BORDERS. Pure flat color.
        className="bg-[#F5F5F7] border-0"
      >
        <AnimatedSidebarHeader
          className={`px-4 pt-6 pb-2 ${RAIL_PAD} group-data-[state=collapsed]/sidebar-wrapper:px-2`}
        >
          {/* 1. Wrapped in a Link for UX, with Apple-style hover/press interactions */}
          <Link
            href="/overview"
            className="flex w-full items-center gap-3 p-1.5 rounded-xl transition-all duration-200 hover:bg-black/[0.04] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-black/10 group/logo"
          >
            {/* Collapsed state logo */}
            <motion.div
              initial={false}
              animate={{
                opacity: collapsed ? 1 : 0,
                scale: collapsed ? 1 : 0.8,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="absolute"
            >
              <Image
                src="/logo/logo.png"
                alt="MoriPrep Logo"
                width={32}
                height={32}
                className="size-8 object-contain"
                priority
              />
            </motion.div>

            {/* 2. Improved Framer Motion animation to handle layout shifts */}
            <motion.div
              initial={false}
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                x: collapsed ? -8 : 0,
              }}
              transition={
                collapsed
                  ? { duration: 0.15, ease: "easeOut" }
                  : { duration: 0.3, delay: 0.1, ease: "easeOut" }
              }
              aria-hidden={collapsed}
              className="flex min-w-0 items-center overflow-hidden origin-left"
            >
              <Image
                src="/morin.svg"
                alt="MoriPrep Wordmark"
                width={120}
                height={24}
                className="h-6 w-auto shrink-0 object-contain ml-4"
                priority
              />
            </motion.div>
          </Link>

          <AnimatedSidebarClose className="absolute right-4 top-8 grid size-7 place-items-center rounded-full text-[#86868B] transition-colors hover:text-[#1D1D1F] hover:bg-black/5 md:hidden">
            <X className="size-4" />
          </AnimatedSidebarClose>
        </AnimatedSidebarHeader>

        <AnimatedSidebarContent
          className={`px-4 py-2 ${RAIL_PAD} group-data-[state=collapsed]/sidebar-wrapper:px-1`}
        >
          {navGroups.map((group, groupIndex) => (
            <AnimatedSidebarGroup key={group.label ?? `group-${groupIndex}`}>
              {group.label && (
                <AnimatedSidebarGroupLabel className={NAV_GROUP_LABEL}>
                  {group.label}
                </AnimatedSidebarGroupLabel>
              )}
              <AnimatedSidebarGroupContent>
                <AnimatedSidebarMenu className="gap-[2px]">
                  {group.items.map((item) => {
                    const isActive =
                      "hasSubmenu" in item && item.hasSubmenu
                        ? item.subItems?.some((sub) =>
                            isPathActive(pathname, sub.href),
                          )
                        : "href" in item
                          ? isPathActive(pathname, item.href)
                          : false;
                    const isComingSoon =
                      "comingSoon" in item && item.comingSoon;

                    return (
                      <AnimatedSidebarMenuItem key={item.label}>
                        {"hasSubmenu" in item && item.hasSubmenu ? (
                          <>
                            <AnimatedSidebarMenuButton
                              isActive={isActive}
                              ariaExpanded={openSubmenu === item.label}
                              icon={
                                item.icon && (
                                  <item.icon className="size-[18px] shrink-0" />
                                )
                              }
                              className={`${NAV_ITEM_BASE} ${isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE}`}
                              onSelect={() =>
                                setOpenSubmenu((prev) =>
                                  prev === item.label ? null : item.label,
                                )
                              }
                            >
                              {item.label}
                            </AnimatedSidebarMenuButton>
                            <AnimatedSidebarMenuSub
                              open={openSubmenu === item.label}
                            >
                              {"subItems" in item &&
                                item.subItems?.map((subItem) => (
                                  <AnimatedSidebarMenuSubItem
                                    key={subItem.label}
                                  >
                                    <AnimatedSidebarMenuSubButton
                                      isActive={isPathActive(
                                        pathname,
                                        subItem.href,
                                      )}
                                      href={subItem.href}
                                      className={`!rounded-[8px] text-[13px] px-3 h-7 transition-colors ${
                                        isPathActive(pathname, subItem.href)
                                          ? "text-[#1D1D1F] font-semibold bg-black/[0.04]"
                                          : "text-[#545459] font-medium hover:text-[#1D1D1F]"
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
                            disabled={isComingSoon}
                            icon={
                              item.icon && (
                                <item.icon className="size-[18px] shrink-0" />
                              )
                            }
                            href={"href" in item ? item.href : undefined}
                            className={`${NAV_ITEM_BASE} ${isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE} ${isComingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              {item.label}
                              {isComingSoon && (
                                <span className="text-[10px] font-medium text-[#86868B]">
                                  Coming soon
                                </span>
                              )}
                            </div>
                          </AnimatedSidebarMenuButton>
                        )}
                      </AnimatedSidebarMenuItem>
                    );
                  })}
                </AnimatedSidebarMenu>
              </AnimatedSidebarGroupContent>
            </AnimatedSidebarGroup>
          ))}

          <AnimatedSidebarGroup className="mt-2">
            <AnimatedSidebarGroupLabel className={NAV_GROUP_LABEL}>
              settings
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-[2px]">
                {settingsItems.map((item) => {
                  const isActive =
                    "href" in item ? isPathActive(pathname, item.href) : false;
                  return (
                    <AnimatedSidebarMenuItem key={item.label}>
                      <AnimatedSidebarMenuButton
                        isActive={isActive}
                        icon={<item.icon className="size-[18px] shrink-0" />}
                        href={"href" in item ? item.href : undefined}
                        className={`${NAV_ITEM_BASE} ${isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE}`}
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

        <AnimatedSidebarFooter
          className={`px-4 pb-4 mt-4 ${RAIL_PAD} group-data-[state=collapsed]/sidebar-wrapper:px-2`}
        >
          <ProfileMenu user={user} onSignOut={handleSignOut} />
        </AnimatedSidebarFooter>
      </AnimatedSidebar>

      {/* Main Content Area: Pure White, Rounded, No harsh borders */}
      <AnimatedSidebarInset className="relative bg-white overflow-hidden md:h-[calc(100vh-16px)] md:my-2 md:mr-2 md:-ml-1 md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_32px_-16px_rgba(0,0,0,0.08)]">
        {/* Scroll area now runs UNDER the header */}
        <div className="h-full overflow-y-auto overflow-x-hidden px-8 pb-12 pt-16">
          {children}
        </div>

        {/* Progressive frosted blur: strong at the top, fades to clear at the bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20"
        >
          <div
            className="absolute inset-0 backdrop-blur-[14px]"
            style={fadeMask("black 0%, black 35%, transparent 70%")}
          />
          <div
            className="absolute inset-0 backdrop-blur-[5px]"
            style={fadeMask("black 25%, black 55%, transparent 88%")}
          />
          <div
            className="absolute inset-0 backdrop-blur-[1.5px]"
            style={fadeMask("black 45%, transparent 100%")}
          />
        </div>

        {/* Header content sits on top of the blur */}
        <header className="absolute inset-x-0 top-0 z-20 flex h-16 shrink-0 items-center gap-4 px-8">
          <AnimatedSidebarTrigger className="text-[#86868B] transition-colors hover:text-[#1D1D1F] md:hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              color="currentColor"
            >
              <rect
                x="3"
                y="5"
                width="14"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="3"
                y="9"
                width="14"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="3"
                y="13"
                width="14"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </AnimatedSidebarTrigger>
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-[#1D1D1F] tracking-tight truncate">
              {activeLabel}
            </p>
            <AnimatedSidebarTrigger className="text-[#86868B] transition-colors hover:text-[#1D1D1F] hidden md:flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-black/[0.04] outline-none">
              <ChevronsUpDown className="size-4" />
            </AnimatedSidebarTrigger>
          </div>
          <div className="flex-1" />

          {/* Simple bright pill for the streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF9500] text-white">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177A7.547 7.547 0 0 1 6.648 6.874a.75.75 0 0 0-1.152.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1.1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[13px] font-bold tracking-tight">
              {streak}
            </span>
          </div>
        </header>
      </AnimatedSidebarInset>
    </>
  );
}

// Dead simple, borderless profile block exactly matching the screenshot
function ProfileMenu({
  user,
  onSignOut,
}: {
  user: User | null;
  onSignOut: () => void;
}) {
  const { open, isMobile } = useAnimatedSidebar();
  const collapsed = !isMobile && !open;

  if (!user) {
    return (
      <a
        href="/sign-in"
        className="flex items-center gap-3 px-2 py-1 transition-colors hover:bg-black/[0.03] rounded-[10px]"
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-black/[0.04] text-[#545459] text-sm font-semibold">
          ?
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -6 : 0 }}
          transition={
            collapsed
              ? { duration: 0.12, ease: "easeOut" }
              : { duration: 0.25, delay: 0.15, ease: "easeOut" }
          }
          aria-hidden={collapsed}
          className="min-w-0 flex-1"
        >
          <span className="block truncate text-[13px] font-semibold text-[#1D1D1F]">
            Not signed in
          </span>
          <span className="block truncate text-[12px] font-medium text-[#545459]">
            Sign in to sync
          </span>
        </motion.div>
      </a>
    );
  }

  const initial = (user.email?.[0] ?? "U").toUpperCase();

  return (
    <Link
      href="/account"
      className="flex w-full items-center gap-3 px-1 transition-colors hover:bg-black/[0.03] rounded-[10px]"
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          className="size-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1D1D1F] text-white text-[13px] font-semibold">
          {initial}
        </div>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -6 : 0 }}
        transition={
          collapsed
            ? { duration: 0.12, ease: "easeOut" }
            : { duration: 0.25, delay: 0.15, ease: "easeOut" }
        }
        aria-hidden={collapsed}
        className="min-w-0 flex-1 -space-y-0.5"
      >
        <span className="block truncate text-[13.5px] font-semibold text-[#1D1D1F]">
          {user.displayName || "User"}
        </span>
        <span className="block truncate text-[12px] font-medium text-[#545459]">
          {user.email || "user@moriprep.xyz"}
        </span>
      </motion.div>
      <motion.button
        initial={false}
        animate={{ opacity: collapsed ? 0 : 1 }}
        transition={
          collapsed
            ? { duration: 0.12, ease: "easeOut" }
            : { duration: 0.25, delay: 0.15, ease: "easeOut" }
        }
        aria-hidden={collapsed}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onSignOut();
        }}
        className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 outline-none"
      >
        <LogOut className="size-4" strokeWidth={2} />
      </motion.button>
    </Link>
  );
}
