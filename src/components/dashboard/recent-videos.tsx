import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/components/discover/video-card";
import type { RecentVideo } from "@/mocks/analytics";
import { platformNames } from "@/types/account";

function indicator(ratio: number) {
  if (ratio >= 2) return { label: "Outlier", className: "bg-primary text-primary-foreground" };
  if (ratio >= 1) return { label: "Above average", className: "bg-accent text-accent-foreground" };
  return { label: "Below average", className: "bg-secondary text-secondary-foreground" };
}

export function RecentVideos({ videos }: { videos: RecentVideo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent videos</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {videos.map((v) => {
          const ind = indicator(v.ratio);
          return (
            <div key={v.id} className="flex items-center gap-3 py-3">
              <div className="size-12 shrink-0 rounded-md bg-gradient-to-br from-primary/30 via-accent to-card" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{v.title}</p>
                <p className="text-xs text-muted-foreground">
                  {platformNames[v.platform]} · {v.dateLabel}
                </p>
              </div>
              <div className="text-right text-sm">
                <p>{formatCount(v.views)} views</p>
                <Badge className={ind.className}>
                  {ind.label} · {v.ratio.toFixed(1)}x
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}