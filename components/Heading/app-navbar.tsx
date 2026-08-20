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
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
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

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    className={className}
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
  { label: "Home", href: "/home", icon: HomeIcon },
  { label: "Test", href: "/practice", icon: LayoutGrid },
  {
    label: "Lessons",
    icon: BookOpen,
    hasSubmenu: true,
    subItems: [
      { label: "Math", href: "/resources/math" },
      { label: "Reading & Writing", href: "/resources/rw" },
    ],
  },
  { label: "Resources", href: "/resources", icon: FileText },
  { label: "History", href: "/history", icon: History },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const settingsItems = [
  { label: "General settings", href: "/settings", icon: Settings },
];

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
    return activeSetting?.label ?? "Home";
  }, [pathname]);

  return (
    <AnimatedSidebarProvider defaultOpen={true}>
      <AnimatedSidebar
        ariaLabel="Mori Prep navigation"
        collapsible="icon"
        variant="sidebar"
        // Apple's signature #f5f5f7 background with ultra-subtle border
        className="bg-[#f5f5f7]/80 border-r border-black/[0.04] backdrop-blur-3xl"
      >
        <AnimatedSidebarHeader className="px-5 pt-6 pb-4">
          <div className="flex h-8 items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Image
                src="/morin.svg"
                alt="Mori Prep"
                width={110}
                height={26}
                className="h-6 w-auto object-contain shrink-0 drop-shadow-sm"
                priority
              />
            </div>
            <AnimatedSidebarClose className="grid size-7 place-items-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-black/[0.05] transition-colors md:hidden">
              <X aria-hidden="true" className="size-4" />
            </AnimatedSidebarClose>
          </div>
        </AnimatedSidebarHeader>

        <AnimatedSidebarContent className="px-3 pt-2">
          <AnimatedSidebarGroup className="pb-4">
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
                            icon={item.icon && <item.icon className="size-4" />}
                            className={`transition-all rounded-[10px] px-3 ${
                              isActive
                                ? "bg-black/[0.04] text-zinc-900 font-semibold"
                                : "text-zinc-500 font-medium hover:text-zinc-900 hover:bg-black/[0.03]"
                            }`}
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
                            {item.subItems?.map((subItem) => (
                              <AnimatedSidebarMenuSubItem key={subItem.label}>
                                <AnimatedSidebarMenuSubButton
                                  isActive={isPathActive(
                                    pathname,
                                    subItem.href,
                                  )}
                                  href={subItem.href}
                                  className={`text-[13px] px-3 transition-colors ${
                                    isPathActive(pathname, subItem.href)
                                      ? "text-zinc-900 font-semibold"
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
                          icon={item.icon && <item.icon className="size-4" />}
                          href={item.href}
                          className={`transition-all rounded-[10px] px-3 ${
                            isActive
                              ? "bg-black/[0.04] text-zinc-900 font-semibold"
                              : "text-zinc-500 font-medium hover:text-zinc-900 hover:bg-black/[0.03]"
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
              <AnimatedSidebarMenu>
                {settingsItems.map((item) => (
                  <AnimatedSidebarMenuItem key={item.label}>
                    <AnimatedSidebarMenuButton
                      isActive={isPathActive(pathname, item.href)}
                      icon={<item.icon className="size-4" />}
                      href={item.href}
                      className="text-zinc-500 font-medium hover:text-zinc-900 hover:bg-black/[0.03] transition-all rounded-[10px] px-3"
                    >
                      {item.label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                ))}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>

        {/* Removed harsh top border for a clean fade approach */}
        <AnimatedSidebarFooter className="p-4 pt-2">
          <ProfileMenu user={user} onSignOut={handleSignOut} />
        </AnimatedSidebarFooter>

        <AnimatedSidebarRail />
      </AnimatedSidebar>

      {/* Main Content Area */}
      <AnimatedSidebarInset className="bg-white">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 px-6 border-b border-black/[0.03] bg-white/70 backdrop-blur-2xl">
          <AnimatedSidebarTrigger className="text-zinc-400 transition-colors hover:text-zinc-900">
            <PanelLeft aria-hidden="true" className="size-[18px]" />
          </AnimatedSidebarTrigger>
          <div className="h-3 w-[1px] bg-zinc-200" />
          <p className="text-[14px] font-semibold text-zinc-800 tracking-tight">
            {activeLabel}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-8 bg-zinc-50/20">
          {children}
        </div>
      </AnimatedSidebarInset>
    </AnimatedSidebarProvider>
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
            // macOS style soft shadow and blur
            className="absolute bottom-[calc(100%+8px)] left-0 w-60 overflow-hidden rounded-[14px] border border-black/[0.04] bg-white/85 backdrop-blur-2xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
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
