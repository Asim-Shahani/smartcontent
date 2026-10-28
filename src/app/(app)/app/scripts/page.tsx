"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useScripts, useScriptsReady } from "@/store/scripts";

export default function ScriptsPage() {
  const ready = useScriptsReady();
  const scripts = useScripts((s) => s.scripts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scripts</h1>
        <p className="text-sm text-muted-foreground">
          Scripts you&apos;ve written from analyzed videos. Each save creates a new version.
        </p>
      </div>

      {!ready ? null : scripts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium">No scripts yet</p>
          <p className="text-sm text-muted-foreground">
            Open an outlier video in Discover, analyze it, then click Create script.
          </p>
          <Button asChild>
            <Link href="/app/discover">Go to Discover</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {scripts.map((s) => (
            <Link key={s.id} href={`/app/scripts/${s.id}`}>
              <Card className="transition-colors hover:border-primary">
                <CardContent className="space-y-2 p-4">
                  <h3 className="line-clamp-2 font-medium">{s.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {s.blocks.hook}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">v{s.version}</Badge>
                    <span>Updated {s.updatedLabel}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}