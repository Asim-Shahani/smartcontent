"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatorRow } from "@/components/channels/creator-row";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  creatorFromUrl,
  creators,
  describeCreators,
  niches,
  searchCreators,
} from "@/mocks/creators";
import { COMPETITOR_LIMIT, useWatchlist } from "@/store/watchlist";
import type { Creator } from "@/types/channel";

const examples = [
  "fitness creators who post home workouts",
  "tech and AI tools reviewers",
  "budget meal prep and healthy recipes",
];

export default function ChannelsPage() {
  const ready = useHydrated(useWatchlist);
  const channels = useWatchlist((s) => s.channels);

  const [tab, setTab] = useState("watchlist");
  const [notice, setNotice] = useState<string | null>(null);

  const [niche, setNiche] = useState("all");
  const [query, setQuery] = useState("");
  const [description, setDescription] = useState("");
  const [described, setDescribed] = useState<{ creators: Creator[]; relevant: number } | null>(null);
  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState<ReturnType<typeof creatorFromUrl> | null>(null);

  const suggested = useMemo(
    () =>
      creators
        .filter((x) => niche === "all" || x.niche === niche)
        .sort((a, b) => b.followers - a.followers),
    [niche]
  );
  const found = useMemo(() => searchCreators(query), [query]);

  function runDescribe(text: string) {
    setDescription(text);
    setDescribed(describeCreators(text));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Channels</h1>
        <p className="text-sm text-muted-foreground">
          Track the creators in your niche. {channels.length} of {COMPETITOR_LIMIT} competitor
          channels used.
        </p>
      </div>

      {notice && (
        <p className="rounded-lg border border-destructive/40 bg-card p-3 text-sm text-destructive">
          {notice}
        </p>
      )}

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v);
          setNotice(null);
        }}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="watchlist">Watchlist ({channels.length})</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
          <TabsTrigger value="describe">Describe</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="url">Add by URL</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="space-y-2">
          {!ready ? null : channels.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
              <p className="font-medium">Your watchlist is empty</p>
              <p className="text-sm text-muted-foreground">
                Add channels four ways: suggested, a plain-language description, search, or a link.
              </p>
              <Button onClick={() => setTab("suggested")}>Browse suggested channels</Button>
            </div>
          ) : (
            channels.map((ch) => (
              <CreatorRow key={`${ch.platform}:${ch.handle}`} creator={ch} onNotice={setNotice} />
            ))
          )}
        </TabsContent>

        <TabsContent value="suggested" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {["all", ...niches].map((n) => (
              <Button
                key={n}
                size="sm"
                variant={niche === n ? "default" : "outline"}
                onClick={() => setNiche(n)}
              >
                {n === "all" ? "All niches" : n}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            {suggested.map((ch) => (
              <CreatorRow key={`${ch.platform}:${ch.handle}`} creator={ch} onNotice={setNotice} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="describe" className="space-y-4">
          <Textarea
            rows={3}
            placeholder="Describe the creators you want to track, e.g. fitness creators who post home workouts"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => runDescribe(description)} disabled={!description.trim()}>
              Find channels
            </Button>
            <span className="text-xs text-muted-foreground">Try:</span>
            {examples.map((ex) => (
              <Button key={ex} size="sm" variant="outline" onClick={() => runDescribe(ex)}>
                {ex}
              </Button>
            ))}
          </div>
          {described && (
            <div className="space-y-2">
              {described.relevant < described.creators.length && (
                <p className="text-sm text-muted-foreground">
                  {described.relevant === 0
                    ? "No close matches, so here are popular channels to start with."
                    : `${described.relevant} close matches, plus a few popular channels.`}
                </p>
              )}
              {described.creators.map((ch) => (
                <CreatorRow key={`${ch.platform}:${ch.handle}`} creator={ch} onNotice={setNotice} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, @handle, niche or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {!query.trim() ? (
            <p className="text-sm text-muted-foreground">
              Start typing to search creators, for example &quot;gym&quot;, &quot;recipes&quot; or
              &quot;@creatorlab&quot;.
            </p>
          ) : found.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No creators match. Try another word, or add the channel by URL.
            </p>
          ) : (
            <div className="space-y-2">
              {found.map((ch) => (
                <CreatorRow key={`${ch.platform}:${ch.handle}`} creator={ch} onNotice={setNotice} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="flex max-w-xl gap-2">
            <Input
              placeholder="https://www.tiktok.com/@handle"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setUrlResult(creatorFromUrl(url));
              }}
            />
            <Button onClick={() => setUrlResult(creatorFromUrl(url))}>Find channel</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported: TikTok, Instagram and YouTube profile or channel links.
          </p>
          {urlResult &&
            (urlResult.ok ? (
              <CreatorRow creator={urlResult.creator} onNotice={setNotice} />
            ) : (
              <p className="text-sm text-destructive">{urlResult.error}</p>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}