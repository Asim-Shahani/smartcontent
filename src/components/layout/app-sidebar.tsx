"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { mainNav, settingsNav, type NavItem } from "@/lib/nav";
import { WorkspaceSwitcher } from "./workspace-switcher";

function isActive(pathname: string, item: NavItem) {
  const base = item.href.startsWith("/app/settings") ? "/app/settings" : item.href;
  return pathname === base || pathname.startsWith(base + "/");
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isActive(pathname, item);
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
      )}
    >
      <Icon className="size-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Link href="/app/dashboard" className="px-2 text-lg font-semibold tracking-tight">
        Smart Content
      </Link>
      <WorkspaceSwitcher />
      <nav className="flex flex-1 flex-col gap-1">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <NavLink item={settingsNav} pathname={pathname} />
    </div>
  );
}