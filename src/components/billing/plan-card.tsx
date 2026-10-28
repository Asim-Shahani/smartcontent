"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Plan } from "@/mocks/plans";

type Props = {
  plan: Plan;
  billing: "annual" | "monthly";
  isCurrent?: boolean;
};

export function PlanCard({ plan, billing, isCurrent }: Props) {
  const [notified, setNotified] = useState(false);
  const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;

  return (
    <Card className={isCurrent ? "border-primary" : undefined}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          {plan.name}
          <Badge variant="secondary">Coming soon</Badge>
          {isCurrent && <Badge>Your plan</Badge>}
        </CardTitle>
        <CardDescription>{plan.credits} credits per month</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>
          <span className="text-3xl font-semibold">${price}</span>
          <span className="text-muted-foreground">/mo</span>
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {plan.limits.slice(0, 4).map((l) => (
            <li key={l.label}>
              {l.label}: <span className="text-foreground">{l.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              View details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{plan.name} plan</DialogTitle>
              <DialogDescription>
                Read-only preview. Billing is not available yet.
              </DialogDescription>
            </DialogHeader>
            <dl className="divide-y divide-border text-sm">
              {plan.limits.map((l) => (
                <div key={l.label} className="flex justify-between py-2">
                  <dt className="text-muted-foreground">{l.label}</dt>
                  <dd>{l.value}</dd>
                </div>
              ))}
            </dl>
          </DialogContent>
        </Dialog>

        <Button
          className="flex-1"
          disabled={notified}
          onClick={() => setNotified(true)}
        >
          {notified ? "You're on the list" : "Notify me"}
        </Button>
      </CardFooter>
    </Card>
  );
}