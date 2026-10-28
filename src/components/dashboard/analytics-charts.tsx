"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DayPoint } from "@/mocks/analytics";

const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

const tick = { fill: "var(--muted-foreground)", fontSize: 12 };

function SeriesChart({
  title,
  data,
  dataKey,
  type,
}: {
  title: string;
  data: DayPoint[];
  dataKey: keyof DayPoint;
  type: "bar" | "line";
}) {
  const axes = (
    <>
      <CartesianGrid stroke="var(--border)" vertical={false} />
      <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} minTickGap={24} />
      <YAxis
        tick={tick}
        tickLine={false}
        axisLine={false}
        width={44}
        tickFormatter={compact}
        domain={type === "line" ? ["auto", "auto"] : [0, "auto"]}
      />
      <Tooltip
        formatter={(v) => [Number(v).toLocaleString("en-US"), title]}
        contentStyle={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--foreground)",
        }}
        cursor={{ fill: "var(--accent)", opacity: 0.4 }}
      />
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div role="img" aria-label={`${title} chart`}>
          <ResponsiveContainer width="100%" height={220}>
            {type === "bar" ? (
              <BarChart data={data}>
                {axes}
                <Bar dataKey={dataKey} fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data}>
                {axes}
                <Line
                  dataKey={dataKey}
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsCharts({ series }: { series: DayPoint[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SeriesChart title="Views by day" data={series} dataKey="views" type="bar" />
      <SeriesChart title="Cumulative views" data={series} dataKey="cumViews" type="line" />
      <SeriesChart
        title="Followers gained by day"
        data={series}
        dataKey="followersGained"
        type="bar"
      />
      <SeriesChart
        title="Cumulative followers"
        data={series}
        dataKey="cumFollowers"
        type="line"
      />
    </div>
  );
}