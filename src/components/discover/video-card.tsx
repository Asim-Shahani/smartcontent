import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

const platformLabel = {
  tiktok: "TikTok",
  instagram: "Reels",
  youtube: "Shorts",
} as const;

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function VideoCard({ video }: { video: Video }) {
  const tier =
    video.outlierScore >= 10
      ? "bg-primary text-primary-foreground"
      : video.outlierScore >= 5
        ? "bg-accent text-accent-foreground"
        : "bg-secondary text-secondary-foreground";

  return (
    <Link href={`/app/discover/${video.id}`} className="group block">
      <Card className="overflow-hidden p-0 transition-colors group-hover:border-primary">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/30 via-accent to-card">
          <Badge variant="secondary" className="absolute left-3 top-3">
            {platformLabel[video.platform]}
          </Badge>
          <Badge className={cn("absolute right-3 top-3", tier)}>
            {video.outlierScore.toFixed(1)}x
          </Badge>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-2 font-medium leading-snug">{video.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {video.creator} · {video.postedLabel}
            </p>
          </div>

          <div className="space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(video.outlierScore * 7, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Outlier score vs channel average</p>
          </div>

          <div className="flex justify-between text-sm">
            <span>{formatCount(video.views)} views</span>
            <span className="text-muted-foreground">{video.engagement}% engagement</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}