"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Platform } from "@/types/video";

export type Filters = {
  keyword: string;
  platform: Platform | "all";
  minOutlier: number;
};

const platforms: { value: Filters["platform"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Reels" },
  { value: "youtube", label: "Shorts" },
];

const outlierSteps = [
  { value: 0, label: "Any" },
  { value: 3, label: "3x+" },
  { value: 5, label: "5x+" },
  { value: 10, label: "10x+" },
];

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by keyword, title or creator..."
          className="pl-9"
          value={filters.keyword}
          onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Platform</span>
          <div className="flex gap-1">
            {platforms.map((p) => (
              <Button
                key={p.value}
                size="sm"
                variant={filters.platform === p.value ? "default" : "outline"}
                onClick={() => onChange({ ...filters, platform: p.value })}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Outlier score</span>
          <div className="flex gap-1">
            {outlierSteps.map((s) => (
              <Button
                key={s.value}
                size="sm"
                variant={filters.minOutlier === s.value ? "default" : "outline"}
                onClick={() => onChange({ ...filters, minOutlier: s.value })}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}