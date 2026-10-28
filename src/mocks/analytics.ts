import type { VerifiedAccount } from "@/types/account";
import type { Platform } from "@/types/video";

const DAY = 86_400_000;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Deterministic 0..1 value for (seed, n): the same account and date always give the same number
function rand(seed: number, n: number) {
  let t = (seed + Math.imul(n + 1, 0x9e3779b9)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export type DayPoint = {
  label: string;
  views: number;
  followersGained: number;
  cumViews: number;
  cumFollowers: number;
};

export type RecentVideo = {
  id: string;
  title: string;
  platform: Platform;
  dateLabel: string;
  views: number;
  ratio: number;
  sortKey: number;
};

export type DashboardData = {
  totalFollowers: number;
  followersGained: number;
  totalViews: number;
  posts: number;
  series: DayPoint[];
  recent: RecentVideo[];
};

const titles = [
  "3 mistakes that kill your reach",
  "My honest results after 30 days",
  "The setup I wish I had on day one",
  "Why this keeps going viral",
  "Beginner vs pro: the real difference",
  "I tried the trend so you don't have to",
  "One change that doubled my views",
  "What nobody tells you about posting daily",
];

export function buildDashboard(
  accounts: VerifiedAccount[],
  range: { from: Date; to: Date }
): DashboardData {
  const today = startOfDay(new Date());
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  const dayCount = Math.min(
    366,
    Math.max(1, Math.round((to.getTime() - from.getTime()) / DAY) + 1)
  );

  const seeds = accounts.map((a) => {
    const seed = hash(`${a.platform}:${a.handle}`);
    return {
      a,
      seed,
      scale: 0.5 + ((seed % 100) / 100) * 1.5,
      baseFollowers: 4000 + (seed % 90000),
    };
  });

  const days = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const daysAgo = Math.abs(Math.round((today.getTime() - date.getTime()) / DAY));
    let views = 0;
    let gained = 0;
    let posts = 0;
    for (const x of seeds) {
      const spike = rand(x.seed, daysAgo * 5 + 1) > 0.93 ? 6 : 1;
      views += Math.round((1500 + rand(x.seed, daysAgo * 5) * 14000) * x.scale * spike);
      gained += Math.round(10 + rand(x.seed, daysAgo * 5 + 2) * 250 * x.scale);
      posts += rand(x.seed, daysAgo * 5 + 3) > 0.45 ? 1 : 0;
    }
    return { date, views, gained, posts };
  });

  const baseTotal = seeds.reduce((s, x) => s + x.baseFollowers, 0);
  const totalGained = days.reduce((s, d) => s + d.gained, 0);
  const startFollowers = Math.max(0, baseTotal - totalGained);

  let cumViews = 0;
  let cumFollowers = startFollowers;
  const series: DayPoint[] = days.map((d) => {
    cumViews += d.views;
    cumFollowers += d.gained;
    return {
      label: d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: d.views,
      followersGained: d.gained,
      cumViews,
      cumFollowers,
    };
  });

  const recent: RecentVideo[] = seeds
    .flatMap((x) =>
      Array.from({ length: 4 }, (_, i) => {
        const daysAgo = 1 + i * 3 + Math.floor(rand(x.seed, 900 + i) * 3);
        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo
        );
        const avg = 9000 * x.scale;
        const views = Math.round(avg * (0.3 + rand(x.seed, 800 + i) * 3.2));
        return {
          id: `${x.a.id}-${i}`,
          title: titles[Math.floor(rand(x.seed, 700 + i) * titles.length)],
          platform: x.a.platform,
          dateLabel: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          views,
          ratio: views / avg,
          sortKey: date.getTime(),
        };
      })
    )
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 6);

  return {
    totalFollowers: startFollowers + totalGained,
    followersGained: totalGained,
    totalViews: cumViews,
    posts: days.reduce((s, d) => s + d.posts, 0),
    series,
    recent,
  };
}