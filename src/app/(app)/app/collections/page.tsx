"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionCard } from "@/components/collections/collection-card";
import { categoryMeta, collections } from "@/mocks/collections";
import type { CollectionCategory } from "@/types/collection";

export default function CollectionsPage() {
  const [tab, setTab] = useState<CollectionCategory>("formats");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () =>
      Object.fromEntries(
        categoryMeta.map((m) => [m.value, collections.filter((c) => c.category === m.value).length])
      ) as Record<CollectionCategory, number>,
    []
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return collections.filter(
      (c) =>
        c.category === tab && (!q || `${c.name} ${c.hint}`.toLowerCase().includes(q))
    );
  }, [tab, query]);

  const meta = categoryMeta.find((m) => m.value === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
        <p className="text-sm text-muted-foreground">
          {collections.length} curated patterns, free on every plan. No credits. New videos are
          added every week.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as CollectionCategory)}>
        <TabsList className="flex-wrap">
          {categoryMeta.map((m) => (
            <TabsTrigger key={m.value} value={m.value}>
              {m.label} ({counts[m.value]})
            </TabsTrigger>
          ))}
        </TabsList>

        {categoryMeta.map((m) => (
          <TabsContent key={m.value} value={m.value} />
        ))}
      </Tabs>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{meta?.blurb}</p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={`Search ${meta?.label.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {shown.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No collections match &quot;{query}&quot; in {meta?.label}. Try another word or another
            category.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {shown.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}