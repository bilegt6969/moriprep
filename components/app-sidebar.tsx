"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  BookOpenIcon,
  ChevronLeftIcon,
  FileText,
  FrameIcon,
  LayoutDashboard,
  MapIcon,
  PieChartIcon,
  Settings,
} from "lucide-react";

// Full icons with standard styling for better visibility
const iconProps = {
  size: 20,
  strokeWidth: 2,
  className: "text-neutral-700 dark:text-neutral-300",
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
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
    // "inset" makes the sidebar blend into the page's root background, while
    // <SidebarInset> (wrapping your main content — see note below) becomes a
    // rounded, shadowed card that floats over it, like the reference image.
    <Sidebar collapsible="icon" variant="inset" {...props}>
      {/* Pill "Back" button replaces the team switcher, matching the reference header */}
      <SidebarHeader className="px-3 pt-4 pb-2 group-data-[collapsible=icon]:px-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2"
        >
          <ChevronLeftIcon size={16} strokeWidth={2} />
          <span className="group-data-[collapsible=icon]:hidden">Back</span>
        </button>
      </SidebarHeader>

      {/* Flat, continuous list — no boxed/shadowed sections, tight spacing like the reference */}
      <SidebarContent className="px-3 gap-y-0">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4 border-t border-neutral-200 dark:border-neutral-800">
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail className="opacity-0" />
    </Sidebar>
  );
}
