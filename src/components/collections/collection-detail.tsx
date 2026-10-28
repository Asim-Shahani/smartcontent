"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCount } from "@/components/discover/video-card";
import { categoryMeta, getCollection, toReferenceSheet } from "@/mocks/collections";
import { platformNames } from "@/types/account";

export function CollectionDetail({ collectionId }: { collectionId: string }) {
  const collection = getCollection(collectionId);
  const [copied, setCopied] = useState(false);

  if (!collection) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Collection not found.</p>
        <Button asChild variant="outline">
          <Link href="/app/collections">Back to Collections</Link>
        </Button>
      </div>
    );
  }

  const category = categoryMeta.find((m) => m.value === collection.category)?.label;

  function download() {
    if (!collection) return;
    const url = URL.createObjectURL(
      new Blob([toReferenceSheet(collection)], { type: "text/markdown" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${collection.id}-reference-sheet.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copy() {
    if (!collection) return;
    await navigator.clipboard.writeText(toReferenceSheet(collection));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/app/collections"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All collections
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="secondary">Free · no credits</Badge>
          {collection.isNew && <Badge>New</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{collection.name}</h1>
        <p className="text-sm text-muted-foreground">{collection.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={download}>
          <Download className="size-4" /> Export reference sheet
        </Button>
        <Button variant="outline" onClick={copy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy as text"}
        </Button>
      </div>

      <Tabs defaultValue="breakdown">
        <TabsList>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-3">
          {collection.breakdown.map((b) => (
            <Card key={b.label}>
              <CardContent className="space-y-1 p-4">
                <p className="text-sm font-medium">{b.label}</p>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-2">
          {collection.examples.map((e) => (
            <Card key={e.title + e.creator}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="size-12 shrink-0 rounded-md bg-gradient-to-br from-primary/30 via-accent to-card" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">@{e.creator}</p>
                </div>
                <Badge variant="secondary">{platformNames[e.platform]}</Badge>
                <span className="w-20 text-right text-sm">{formatCount(e.views)}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardContent className="space-y-2 p-6 text-sm">
              <p className="text-xs text-muted-foreground">Transcript of the top example</p>
              {collection.transcript.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}