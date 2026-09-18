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
    // No card wrapper (bg/border/shadow) or uppercase label — continues the flat list
    <SidebarGroup className="p-0 group-data-[collapsible=icon]:hidden">
      <SidebarMenu className="gap-0">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={item.name}
              className="h-10 rounded-xl transition-all duration-200"
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
          <SidebarMenuButton className="h-10 rounded-xl text-neutral-400">
            <MoreHorizontalIcon className="text-neutral-400" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
