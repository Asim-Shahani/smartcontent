"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilterBar, type Filters } from "@/components/discover/filter-bar";
import { VideoCard } from "@/components/discover/video-card";
import { videos } from "@/mocks/videos";
import { creatorKey, useWatchlist } from "@/store/watchlist";

const initialFilters: Filters = {
  keyword: "",
  platform: "all",
  minOutlier: 0,
  watchlistOnly: false,
};

export default function DiscoverPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const channels = useWatchlist((s) => s.channels);
  const watched = useMemo(() => new Set(channels.map(creatorKey)), [channels]);

  const results = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    return videos
      .filter((v) => {
        const matchesKeyword =
          !kw ||
          v.title.toLowerCase().includes(kw) ||
          v.creator.toLowerCase().includes(kw) ||
          v.niche.toLowerCase().includes(kw);
        const matchesPlatform = filters.platform === "all" || v.platform === filters.platform;
        const matchesOutlier = v.outlierScore >= filters.minOutlier;
        const key = `${v.platform}:${v.creator.replace(/^@/, "").toLowerCase()}`;
        const matchesWatchlist = !filters.watchlistOnly || watched.has(key);
        return matchesKeyword && matchesPlatform && matchesOutlier && matchesWatchlist;
      })
      .sort((a, b) => b.outlierScore - a.outlierScore);
  }, [filters, watched]);

  const watchlistEmpty = filters.watchlistOnly && channels.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Videos that beat their own channel&apos;s average, ranked by outlier score.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} watchlistCount={channels.length} />

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium">
            {watchlistEmpty ? "Your watchlist is empty" : "No videos match these filters"}
          </p>
          <p className="text-sm text-muted-foreground">
            {watchlistEmpty
              ? "Add channels to your watchlist to see their videos here."
              : "Try a broader keyword or lower the outlier score."}
          </p>
          <div className="flex gap-2">
            {watchlistEmpty && (
              <Button asChild>
                <Link href="/app/channels">Add channels</Link>
              </Button>
            )}
            <Button variant="outline" onClick={() => setFilters(initialFilters)}>
              Reset filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{results.length} videos</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {results.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}