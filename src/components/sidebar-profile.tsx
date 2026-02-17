"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          <Avatar className="size-8 rounded-lg" size="default">
            <AvatarImage alt={profile.fullName} src="/images/happy.jpg" />
            <AvatarFallback className="rounded-lg">CB</AvatarFallback>
          </Avatar>
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
