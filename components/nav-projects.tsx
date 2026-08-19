"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    ArrowRightIcon,
    FolderIcon,
    MoreHorizontalIcon,
    Trash2Icon,
} from "lucide-react";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium px-3 pt-3">
        Lessons
      </SidebarGroupLabel>
      <SidebarMenu className="p-2 space-y-1">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={item.name}
              className="rounded-xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => (window.location.href = item.url)}
            >
              {item.icon}
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuAction
                  showOnHover
                  className="aria-expanded:bg-muted rounded-lg transition-all duration-200"
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-fit rounded-xl"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem className="rounded-lg">
                  <FolderIcon />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">
                  <ArrowRightIcon />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="rounded-lg">
                  <Trash2Icon />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70 rounded-xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
