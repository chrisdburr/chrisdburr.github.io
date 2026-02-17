"use client";

import type { LucideIcon } from "lucide-react";
import {
  GithubIcon,
  GitlabIcon,
  GraduationCapIcon,
  LinkedinIcon,
  MailIcon,
  TwitterIcon,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Social } from "@/lib/schemas/site";

const iconMap: Record<string, LucideIcon> = {
  email: MailIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  gitlab: GitlabIcon,
  scholar: GraduationCapIcon,
  x: TwitterIcon,
};

const labelMap: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  gitlab: "GitLab",
  scholar: "Google Scholar",
  x: "X",
};

interface SidebarSocialProps {
  social: Social;
}

export function SidebarSocial({ social }: SidebarSocialProps) {
  const entries = Object.entries(social).filter(
    ([key, value]) => value && key in iconMap
  );

  return (
    <SidebarMenu>
      {entries.map(([key, value]) => {
        const Icon = iconMap[key];
        const label = labelMap[key] ?? key;
        const href = key === "email" ? `mailto:${value}` : value;
        const isExternal = key !== "email";

        return (
          <SidebarMenuItem key={key}>
            <SidebarMenuButton
              render={
                <a
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                />
              }
              tooltip={label}
            >
              <Icon />
              <span>{label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
