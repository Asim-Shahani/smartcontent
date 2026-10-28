import {
  LayoutDashboard,
  Compass,
  Radio,
  Lightbulb,
  Anchor,
  Library,
  FileText,
  FolderKanban,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Discover", href: "/app/discover", icon: Compass },
  { label: "Channels", href: "/app/channels", icon: Radio },
  { label: "Ideas", href: "/app/ideas", icon: Lightbulb },
  { label: "Hooks", href: "/app/hooks", icon: Anchor },
  { label: "Collections", href: "/app/collections", icon: Library, badge: "Free" },
  { label: "Scripts", href: "/app/scripts", icon: FileText },
  { label: "Projects", href: "/app/projects", icon: FolderKanban },
];

export const settingsNav: NavItem = {
  label: "Settings",
  href: "/app/settings/subscription",
  icon: Settings,
};