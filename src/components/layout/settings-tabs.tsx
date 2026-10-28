"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Subscription", href: "/app/settings/subscription" },
  { label: "Profile", href: "/app/settings/profile" },
  { label: "Social Verification", href: "/app/settings/social-verification" },
  { label: "Workspaces", href: "/app/settings/workspaces" },
  { label: "Feature Flags", href: "/app/settings/feature-flags" },
  { label: "Connectors", href: "/app/settings/connectors" },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={cn(
            "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
            pathname === t.href
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}