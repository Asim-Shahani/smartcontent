"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCount } from "@/components/discover/video-card";
import { COMPETITOR_LIMIT, creatorKey, useWatchlist } from "@/store/watchlist";
import { platformNames } from "@/types/account";
import type { Creator } from "@/types/channel";

export function CreatorRow({
  creator,
  onNotice,
}: {
  creator: Creator;
  onNotice?: (message: string | null) => void;
}) {
  const key = creatorKey(creator);
  const isAdded = useWatchlist((s) => s.channels.some((x) => creatorKey(x) === key));
  const add = useWatchlist((s) => s.add);
  const remove = useWatchlist((s) => s.remove);

  const initials = creator.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function onAdd() {
    const result = add(creator);
    onNotice?.(
      result === "limit"
        ? `You've reached the ${COMPETITOR_LIMIT} competitor channels included in your plan. Remove one to add another.`
        : null
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent text-sm font-medium">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{creator.name}</p>
          <p className="truncate text-xs text-muted-foreground">@{creator.handle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{platformNames[creator.platform]}</Badge>
          {creator.niche !== "Other" && <Badge variant="secondary">{creator.niche}</Badge>}
        </div>
        <div className="w-28 text-right text-xs text-muted-foreground">
          <p>{formatCount(creator.followers)} followers</p>
          <p>{formatCount(creator.totalViews)} views</p>
        </div>
        {isAdded ? (
          <Button size="sm" variant="outline" onClick={() => remove(key)}>
            Remove
          </Button>
        ) : (
          <Button size="sm" onClick={onAdd}>
            Add
          </Button>
        )}
      </CardContent>
    </Card>
  );
}