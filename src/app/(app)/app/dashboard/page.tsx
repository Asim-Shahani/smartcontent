"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RecentVideos } from "@/components/dashboard/recent-videos";
import { formatCount } from "@/components/discover/video-card";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildDashboard } from "@/mocks/analytics";
import { useAccounts } from "@/store/accounts";
import { platformNames } from "@/types/account";

type Period = "7d" | "30d" | "90d" | "custom";

const pad = (n: number) => String(n).padStart(2, "0");
const toInputDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseDate(s: string) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const ready = useHydrated(useAccounts);
  const accounts = useAccounts((s) => s.accounts);
  const [period, setPeriod] = useState<Period>("30d");
  const [custom, setCustom] = useState({ from: "", to: "" });

  const data = useMemo(() => {
    if (!ready || accounts.length === 0) return null;
    const today = new Date();
    let from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    let to = today;
    if (period === "custom") {
      const f = parseDate(custom.from);
      const t = parseDate(custom.to);
      if (f && t && f <= t) {
        from = f;
        to = t;
      }
    } else {
      const n = period === "7d" ? 7 : period === "90d" ? 90 : 30;
      from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (n - 1));
    }
    return buildDashboard(accounts, { from, to });
  }, [ready, accounts, period, custom]);

  function chooseCustom() {
    if (!custom.from || !custom.to) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);
      setCustom({ from: toInputDate(start), to: toInputDate(now) });
    }
    setPeriod("custom");
  }

  const periods: { value: Period; label: string }[] = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Performance across your verified accounts.
        </p>
      </div>

      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : accounts.length === 0 || !data ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <BarChart3 className="size-8 text-primary" />
          <p className="font-medium">Connect a social account to see your performance</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Verify your TikTok, Instagram or YouTube account to unlock followers, views and
            post analytics. This is optional: Discover, Collections, Hooks and Scripts work
            without it.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/app/settings/social-verification">Connect an account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/discover">Go to Discover</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {accounts.map((a) => `@${a.handle} (${platformNames[a.platform]})`).join(", ")}{" "}
              ·{" "}
              <Link href="/app/settings/social-verification" className="underline">
                manage
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {periods.map((p) => (
                <Button
                  key={p.value}
                  size="sm"
                  variant={period === p.value ? "default" : "outline"}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant={period === "custom" ? "default" : "outline"}
                onClick={chooseCustom}
              >
                Custom
              </Button>
            </div>
          </div>

          {period === "custom" && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Input
                type="date"
                className="w-auto"
                value={custom.from}
                max={toInputDate(new Date())}
                onChange={(e) => setCustom({ ...custom, from: e.target.value })}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                className="w-auto"
                value={custom.to}
                max={toInputDate(new Date())}
                onChange={(e) => setCustom({ ...custom, to: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard label="Total followers" value={data.totalFollowers.toLocaleString("en-US")} />
            <MetricCard label="Followers gained" value={`+${data.followersGained.toLocaleString("en-US")}`} />
            <MetricCard label="Total views" value={formatCount(data.totalViews)} />
            <MetricCard label="Posts" value={String(data.posts)} />
          </div>

          <AnalyticsCharts series={data.series} />
          <RecentVideos videos={data.recent} />

          <p className="text-xs text-muted-foreground">
            Demo data: real numbers appear once the platform connections are live.
          </p>
        </>
      )}
    </div>
  );
}