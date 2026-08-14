"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    AudioLinesIcon,
    BarChart3,
    BookOpenIcon,
    FileText,
    FrameIcon,
    GalleryVerticalEndIcon,
    LayoutDashboard,
    MapIcon,
    PieChartIcon,
    Settings,
    TerminalIcon,
} from "lucide-react";

// Apple-style icon configuration: slightly smaller, thinner strokes (matches SF Symbols)
const iconProps = {
  size: 18,
  strokeWidth: 1.5,
  className: "text-muted-foreground/80", // Softens the icon colors slightly
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon {...iconProps} />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon {...iconProps} />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon {...iconProps} />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: <LayoutDashboard {...iconProps} />,
      isActive: true,
      items: [],
    },
    {
      title: "Practice",
      url: "/practice",
      icon: <FileText {...iconProps} />,
      items: [
        { title: "Reading & Writing", url: "/practice/rw" },
        { title: "Math", url: "/practice/math" },
      ],
    },
    {
      title: "History",
      url: "/history",
      icon: (
        <svg
          {...iconProps}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      items: [],
    },
    {
      title: "Question Bank",
      url: "/practice/question-bank",
      icon: <BookOpenIcon {...iconProps} />,
      items: [
        { title: "All Questions", url: "/practice/question-bank/all" },
        { title: "Bookmarked", url: "/practice/question-bank/bookmarked" },
        { title: "Recent", url: "/practice/question-bank/recent" },
      ],
    },
    {
      title: "Analytics",
      url: "/practice/analytics",
      icon: <BarChart3 {...iconProps} />,
      items: [
        { title: "Performance", url: "/practice/analytics/performance" },
        { title: "Progress", url: "/practice/analytics/progress" },
        { title: "Weak Areas", url: "/practice/analytics/weaknesses" },
      ],
    },
  ],
  projects: [
    {
      name: "Craft & Structure",
      url: "/practice/rw?domain=Craft%20and%20Structure",
      icon: <FrameIcon {...iconProps} />,
    },
    {
      name: "Information & Ideas",
      url: "/practice/rw?domain=Information%20and%20Ideas",
      icon: <PieChartIcon {...iconProps} />,
    },
    {
      name: "Standard English",
      url: "/practice/rw?domain=Standard%20English%20Conventions",
      icon: <MapIcon {...iconProps} />,
    },
  ],
  navSecondary: [
    {
      title: "Quick Practice",
      url: "/practice/rw",
      icon: <FileText {...iconProps} />,
    },
    {
      title: "Settings",
      url: "/practice/settings",
      icon: <Settings {...iconProps} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-neutral-200/60 bg-neutral-100/50 backdrop-blur-xl shadow-none supports-[backdrop-filter]:bg-neutral-100/50 dark:bg-zinc-950/70 dark:border-zinc-800/60 rounded-r-2xl"
      {...props}
    >
      {/* Increased padding for an airy, uncrowded feel */}
      <SidebarHeader className="px-3 pt-4 pb-2">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      {/* Gap handles spacing between different nav sections organically */}
      <SidebarContent className="px-3 gap-y-4">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail className="opacity-0" />
    </Sidebar>
  );
}
