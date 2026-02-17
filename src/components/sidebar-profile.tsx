"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Profile } from "@/lib/schemas/site";

interface SidebarProfileProps {
  profile: Profile;
}

export function SidebarProfile({ profile }: SidebarProfileProps) {
  const displayName = `${profile.title} ${profile.fullName}`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="data-[slot=sidebar-menu-button]:!h-auto data-[slot=sidebar-menu-button]:!p-2"
          size="lg"
          tooltip={displayName}
        >
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-[0.5rem] text-primary-foreground group-data-[state=expanded]:size-8 group-data-[state=expanded]:text-sm">
            CB
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-sm">
              {displayName}
            </span>
            <span className="truncate text-xs">{profile.role}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
