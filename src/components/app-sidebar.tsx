"use client";

import type { ComponentProps } from "react";
import { NavLinks } from "@/components/nav-links";
import { SidebarProfile } from "@/components/sidebar-profile";
import { SidebarSocial } from "@/components/sidebar-social";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { site } from "@/lib/data";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarProfile profile={site.profile} />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSocial social={site.social} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
