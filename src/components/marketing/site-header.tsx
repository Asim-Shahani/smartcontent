import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Pricing", href: "/pricing" },
  { label: "Claude MCP", href: "/mcp" },
  { label: "Collections", href: "/collections" },
  { label: "FAQ", href: "/faq" },
  { label: "Affiliate", href: "/affiliate" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Smart Content
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Try It Free</Link>
          </Button>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-6 pb-2 text-sm text-muted-foreground md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0 hover:text-foreground">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}