"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterBar, type Filters } from "@/components/discover/filter-bar";
import { VideoCard } from "@/components/discover/video-card";
import { videos } from "@/mocks/videos";

const initialFilters: Filters = { keyword: "", platform: "all", minOutlier: 0 };

export default function DiscoverPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

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
        return matchesKeyword && matchesPlatform && matchesOutlier;
      })
      .sort((a, b) => b.outlierScore - a.outlierScore);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Videos that beat their own channel&apos;s average, ranked by outlier score.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium">No videos match these filters</p>
          <p className="text-sm text-muted-foreground">
            Try a broader keyword or lower the outlier score.
          </p>
          <Button variant="outline" onClick={() => setFilters(initialFilters)}>
            Reset filters
          </Button>
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