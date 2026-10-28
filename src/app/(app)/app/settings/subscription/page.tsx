"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanCard } from "@/components/billing/plan-card";
import { plans, defaultPlanId } from "@/mocks/plans";
import { CREDITS_PER_MONTH, useCredits } from "@/store/credits";

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const remaining = useCredits((s) => s.balance);
  const adminSet = useCredits((s) => s.adminSet);
  const creditsTotal = CREDITS_PER_MONTH;
  const percentUsed = Math.round(((creditsTotal - remaining) / creditsTotal) * 100);
  const currentPlan = plans.find((p) => p.id === defaultPlanId);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm">
        <Info className="mt-0.5 size-4 text-primary" />
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Billing coming soon.</span>{" "}
          Everyone has full access during v1. Paid plans can&apos;t be purchased yet.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan: {currentPlan?.name} (default)</CardTitle>
          <CardDescription>
            {remaining} of {creditsTotal} credits remaining this month. Credits reset monthly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${percentUsed}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Plans</h2>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <Button
            size="sm"
            variant={billing === "annual" ? "default" : "ghost"}
            onClick={() => setBilling("annual")}
          >
            Yearly
          </Button>
          <Button
            size="sm"
            variant={billing === "monthly" ? "default" : "ghost"}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            isCurrent={plan.id === defaultPlanId}
          />
        ))}
      </div>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
        Dev tools (admin credit adjustment):
        <Button size="sm" variant="outline" onClick={() => adminSet(0)}>Set to 0</Button>
        <Button size="sm" variant="outline" onClick={() => adminSet(CREDITS_PER_MONTH)}>Reset to 100</Button>
      </div></div>
  );
}