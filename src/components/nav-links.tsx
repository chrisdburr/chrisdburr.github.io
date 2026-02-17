"use client";

import {
  BookTextIcon,
  FileTextIcon,
  FlaskConicalIcon,
  HomeIcon,
  PenLineIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "About", path: "/about", icon: UserIcon },
  { label: "Research", path: "/research", icon: FlaskConicalIcon },
  { label: "Publications", path: "/publications", icon: BookTextIcon },
  { label: "CV", path: "/cv", icon: FileTextIcon },
  { label: "Blog", path: "/blog", icon: PenLineIcon },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path)
                }
                render={<Link href={item.path} />}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
