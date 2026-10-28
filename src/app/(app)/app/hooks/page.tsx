"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HookRow } from "@/components/hooks/hook-row";
import { useHydrated } from "@/hooks/use-hydrated";
import { generateHooks, hookCategories, hookLibrary } from "@/mocks/hooks";
import { useSavedHooks } from "@/store/hooks";
import type { Hook, HookCategory } from "@/types/hook";

export default function HooksPage() {
  const ready = useHydrated(useSavedHooks);
  const saved = useSavedHooks((s) => s.saved);

  const [query, setQuery] = useState("");
  const [libCat, setLibCat] = useState<HookCategory | "all">("all");

  const [topic, setTopic] = useState("");
  const [genCat, setGenCat] = useState<HookCategory>("curiosity");
  const [generated, setGenerated] = useState<Hook[]>([]);

  const library = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hookLibrary.filter(
      (h) =>
        (libCat === "all" || h.category === libCat) &&
        (!q || `${h.text} ${h.niche}`.toLowerCase().includes(q))
    );
  }, [query, libCat]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hooks</h1>
        <p className="text-sm text-muted-foreground">
          Proven openers by niche, plus a generator. Free: hooks never cost credits.
        </p>
      </div>

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="saved">Saved ({saved.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by niche or keyword..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={libCat === "all" ? "default" : "outline"}
              onClick={() => setLibCat("all")}
            >
              All
            </Button>
            {hookCategories.map((c) => (
              <Button
                key={c.value}
                size="sm"
                variant={libCat === c.value ? "default" : "outline"}
                onClick={() => setLibCat(c.value)}
              >
                {c.label}
              </Button>
            ))}
          </div>
          {library.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No hooks match. Try a different keyword or category.
            </p>
          ) : (
            <div className="space-y-2">
              {library.map((h) => (
                <HookRow key={h.id} hook={h} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <Input
            placeholder="Your topic, e.g. meal prep, cold email, home workouts"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {hookCategories.map((c) => (
              <Button
                key={c.value}
                size="sm"
                variant={genCat === c.value ? "default" : "outline"}
                onClick={() => setGenCat(c.value)}
              >
                {c.label}
              </Button>
            ))}
          </div>
          <Button onClick={() => setGenerated(generateHooks(topic, genCat))}>
            Generate 20 hooks
          </Button>
          {generated.length > 0 && (
            <div className="space-y-2">
              {generated.map((h) => (
                <HookRow key={h.id} hook={h} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-2">
          {!ready ? null : saved.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No saved hooks yet. Click the bookmark icon on any hook to save it here.
            </p>
          ) : (
            saved.map((h) => <HookRow key={h.id} hook={h} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}