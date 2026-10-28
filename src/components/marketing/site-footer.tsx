import Link from "next/link";

const columns = [
  { title: "Product", links: [["Pricing", "/pricing"], ["Claude MCP", "/mcp"], ["Collections", "/collections"]] },
  { title: "Company", links: [["FAQ", "/faq"], ["Affiliate", "/affiliate"]] },
  { title: "Account", links: [["Log in", "/login"], ["Sign up", "/signup"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-4">
        <div>
          <p className="font-semibold">Smart Content</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Research what works. Write the script.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.title} className="space-y-2 text-sm">
            <p className="font-medium">{c.title}</p>
            {c.links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block text-muted-foreground hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}