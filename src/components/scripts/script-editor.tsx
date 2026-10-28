"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FolderPlus,
  Save,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { expandBlocks } from "@/mocks/script-builder";
import { useScripts, useScriptsReady } from "@/store/scripts";
import type { Script, ScriptBlockKey } from "@/types/script";
import { useSavedHooks } from "@/store/hooks";
import { AddToProject } from "@/components/projects/add-to-project";
const order: ScriptBlockKey[] = [
  "hook",
  "introduction",
  "main",
  "storyFlow",
  "cta",
  "ending",
];

const labels: Record<ScriptBlockKey, string> = {
  hook: "Hook",
  introduction: "Introduction",
  main: "Main content",
  storyFlow: "Story flow",
  cta: "CTA",
  ending: "Ending",
};

function Editor({ script }: { script: Script }) {
  const save = useScripts((s) => s.save);
  const [blocks, setBlocks] = useState(script.blocks);
  const [expanded, setExpanded] = useState(script.expanded);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const savedHooks = useSavedHooks((s) => s.saved);

  const dirty = JSON.stringify(blocks) !== JSON.stringify(script.blocks);

  function onSave() {
    save(script.id, blocks, expanded);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function onCopy() {
    const text = order.map((k) => `${labels[k].toUpperCase()}\n${blocks[k]}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onExpand() {
    setBlocks(expandBlocks(blocks));
    setExpanded(true);
  }

  function onExport() {
    const md =
      `# ${script.title}\n\n` +
      order.map((k) => `## ${labels[k]}\n${blocks[k]}`).join("\n\n");
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${script.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/app/scripts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All scripts
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Version {script.version}</Badge>
          {expanded && <Badge variant="secondary">Expanded</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{script.title}</h1>
        <Link
          href={`/app/discover/${script.sourceVideoId}`}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          View source video
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onSave} disabled={!dirty}>
          {saved ? <Check className="size-4" /> : <Save className="size-4" />}
          {saved ? "Saved" : `Save as v${script.version + 1}`}
        </Button>
        <Button variant="outline" onClick={onCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy full script"}
        </Button>
        <Button variant="outline" onClick={onExpand} disabled={expanded}>
          <Sparkles className="size-4" /> Expand (free)
        </Button>
               <AddToProject
          item={{ kind: "script", refId: script.id, title: script.title }}
        />
        <Button variant="ghost" onClick={onExport}>
          <Download className="size-4" /> Export .md
        </Button>
      </div>

      <div className="space-y-4">
        {order.map((k) => (
          <Card key={k}>
            <CardContent className="space-y-2 p-4">
              <label htmlFor={k} className="text-sm font-medium">
                {labels[k]}
              </label>
              <Textarea
                id={k}
                value={blocks[k]}
                rows={k === "main" || k === "storyFlow" ? 6 : 3}
                              onChange={(e) => setBlocks({ ...blocks, [k]: e.target.value })}
              />
              {k === "hook" && savedHooks.length > 0 && (
                <div className="space-y-1 pt-1">
                  <p className="text-xs text-muted-foreground">
                    Your saved hooks (click one to use it):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {savedHooks.map((h) => (
                      <Button
                        key={h.id}
                        size="sm"
                        variant="outline"
                        className="h-auto whitespace-normal text-left"
                        onClick={() => setBlocks({ ...blocks, hook: h.text })}
                      >
                        {h.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ScriptEditor({ scriptId }: { scriptId: string }) {
  const ready = useScriptsReady();
  const script = useScripts((s) => s.scripts.find((x) => x.id === scriptId));

  if (!ready) return <p className="text-sm text-muted-foreground">Loading...</p>;

  if (!script) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Script not found.</p>
        <Button asChild variant="outline">
          <Link href="/app/scripts">Back to scripts</Link>
        </Button>
      </div>
    );
  }

  return <Editor key={script.id} script={script} />;
}