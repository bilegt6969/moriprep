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
import { auth as firebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  BarChart3,
  BookOpen,
  ChevronsUpDown,
  FileText,
  History,
  LayoutGrid,
  LogOut,
  PanelLeft,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
  >
    <path
      d="M48 105
         C48 96 51 88 58 81
         L119 37
         C124 33 132 33 137 37
         L198 81
         C205 88 208 96 208 105
         V184
         C208 201 198 211 181 211
         H75
         C58 211 48 201 48 184
         Z"
    />
    <rect x="91" y="157" width="74" height="19" rx="5" fill="#FFFFFF" />
  </svg>
);

const navigationItems = [
  {
    label: "Home",
    href: "/home",
    icon: HomeIcon,
  },
  {
    label: "Test",
    href: "/practice",
    icon: LayoutGrid,
  },
  {
    label: "Lessons",
    icon: BookOpen,
    hasSubmenu: true,
    subItems: [
      { label: "Math", href: "/resources/math" },
      { label: "Reading & Writing", href: "/resources/rw" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    icon: FileText,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
] satisfies {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
  subItems?: { label: string; href: string }[];
}[];

// Shown under the "Settings" group label at the bottom of the sidebar.
const settingsItems = [
  {
    label: "General settings",
    href: "/settings",
    icon: Settings,
  },
] satisfies {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}[];

function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNavbar({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    const parent = navigationItems.find((item) =>
      item.subItems?.some((sub) => isPathActive(pathname, sub.href)),
    );
    return parent?.label ?? null;
  });
  const [user, setUser] = useState<any>(null);

  // Keep the parent submenu open when the active route lives inside it,
  // e.g. landing on /resources/math directly from a bookmark or refresh.
  useEffect(() => {
    const parent = navigationItems.find((item) =>
      item.subItems?.some((sub) => isPathActive(pathname, sub.href)),
    );
    if (parent) setOpenSubmenu(parent.label);
  }, [pathname]);

  useEffect(() => {
    if (!firebaseAuth) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    if (firebaseAuth) {
      signOut(firebaseAuth);
    }
  };

  // Derive the page title (shown in the top bar) from the current route
  // instead of tracking it by hand in click handlers, so it stays correct
  // on direct links, refreshes, and browser back/forward.
  const activeLabel = useMemo(() => {
    for (const item of navigationItems) {
      if (item.subItems) {
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
    if (activeSetting) return activeSetting.label;
    return "Home";
  }, [pathname]);

  return (
    <AnimatedSidebarProvider defaultOpen={true}>
      <AnimatedSidebar
        ariaLabel="Mori Prep navigation"
        collapsible="icon"
        variant="sidebar"
        className="bg-transparent border-0"
      >
        <AnimatedSidebarHeader className="gap-3 p-3 pb-2">
          <div className="flex min-h-9 items-center gap-2.5 overflow-hidden px-1">
            <div className="grid size-12 shrink-0 place-items-center">
              <Image src="/morin.svg" alt="" width={48} height={48} />
            </div>
            <AnimatedSidebarClose className="ml-auto text-muted-foreground hover:bg-neutral-100 md:hidden">
              <X aria-hidden="true" className="size-4" />
            </AnimatedSidebarClose>
          </div>
        </AnimatedSidebarHeader>

        <AnimatedSidebarContent className="px-2 pt-1">
          <AnimatedSidebarGroup className="pb-2">
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu>
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
                              item.icon && typeof item.icon === "function" ? (
                                <item.icon className="size-4" />
                              ) : undefined
                            }
                            onSelect={() =>
                              setOpenSubmenu(
                                openSubmenu === item.label ? null : item.label,
                              )
                            }
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
                            item.icon ? (
                              <item.icon className="size-4" />
                            ) : undefined
                          }
                          href={item.href}
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
            <AnimatedSidebarGroupLabel>Settings</AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu>
                {settingsItems.map((item) => (
                  <AnimatedSidebarMenuItem key={item.label}>
                    <AnimatedSidebarMenuButton
                      isActive={isPathActive(pathname, item.href)}
                      icon={<item.icon className="size-4" />}
                      href={item.href}
                    >
                      {item.label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                ))}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>

        <AnimatedSidebarFooter className="border-none p-3">
          <ProfileMenu user={user} onSignOut={handleSignOut} />
        </AnimatedSidebarFooter>

        <AnimatedSidebarRail />
      </AnimatedSidebar>

      <AnimatedSidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 px-4">
          <AnimatedSidebarTrigger className="text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <PanelLeft aria-hidden="true" className="size-4" />
          </AnimatedSidebarTrigger>
          <div className="h-5 w-px bg-gray-200" />
          <p className="text-sm font-medium text-foreground">{activeLabel}</p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </AnimatedSidebarInset>
    </AnimatedSidebarProvider>
  );
}

// Small helper so this file doesn't need to import `cn` from the design
// system just for one conditional class list — replace with your own
// `cn`/`clsx` util if you already have one in scope.
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ProfileMenu({
  user,
  onSignOut,
}: {
  user: any;
  onSignOut: () => void;
}) {
  const { open, isMobile } = useAnimatedSidebar();
  const reduce = useReducedMotion();
  const collapsed = !isMobile && !open;
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
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
        className="flex items-center gap-3 rounded-xl px-1.5 py-1.5 transition-colors hover:bg-neutral-50"
      >
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">
          ?
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">
              Not signed in
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Sign in to access features
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
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
            className="absolute bottom-full left-0 mb-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            <a
              href="/settings"
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-gray-700 transition-colors hover:bg-neutral-50"
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="size-4" aria-hidden="true" />
              Settings
            </a>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
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
        className="flex w-full items-center gap-3 rounded-xl px-1.5 py-1.5 text-left transition-colors hover:bg-neutral-50"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            className="size-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#FC4C01] text-white text-xs font-semibold">
            {initial}
          </div>
        )}
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {user.displayName || "User"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user.email || "user@moriprep.xyz"}
              </span>
            </div>
            <ChevronsUpDown
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </>
        )}
      </motion.button>
    </div>
  );
}
