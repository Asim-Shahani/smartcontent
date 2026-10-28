"use client";

import { useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryLabel } from "@/mocks/hooks";
import { useSavedHooks } from "@/store/hooks";
import type { Hook } from "@/types/hook";

export function HookRow({ hook }: { hook: Hook }) {
  const isSaved = useSavedHooks((s) => s.saved.some((x) => x.id === hook.id));
  const toggle = useSavedHooks((s) => s.toggle);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">{hook.text}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{categoryLabel[hook.category]}</Badge>
            <span className="text-xs text-muted-foreground">{hook.niche}</span>
          </div>
        </div>
        <Button size="icon" variant="ghost" onClick={copy} aria-label="Copy hook">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
        <Button
          size="icon"
          variant={isSaved ? "secondary" : "ghost"}
          onClick={() => toggle(hook)}
          aria-label={isSaved ? "Remove from saved hooks" : "Save hook"}
        >
          <Bookmark className={isSaved ? "size-4 fill-current" : "size-4"} />
        </Button>
      </CardContent>
    </Card>
  );
}