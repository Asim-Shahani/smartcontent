export type Plan = {
  id: "pro" | "visionary" | "titan";
  name: string;
  annualPrice: number;
  monthlyPrice: number;
  credits: number;
  limits: { label: string; value: string }[];
};

export const plans: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    annualPrice: 39,
    monthlyPrice: 49,
    credits: 100,
    limits: [
      { label: "Verified channels", value: "Up to 3" },
      { label: "Refresh speed", value: "Every 12 hours" },
      { label: "Workspaces", value: "Up to 3" },
      { label: "Competitors per workspace", value: "Up to 150" },
      { label: "MCP connector (Claude)", value: "Yes" },
      { label: "API access", value: "No" },
      { label: "Guest access", value: "No" },
      { label: "Collections library", value: "Included" },
    ],
  },
  {
    id: "visionary",
    name: "Visionary",
    annualPrice: 79,
    monthlyPrice: 99,
    credits: 250,
    limits: [
      { label: "Verified channels", value: "Up to 5" },
      { label: "Refresh speed", value: "Every 6 hours" },
      { label: "Workspaces", value: "Up to 5" },
      { label: "Competitors per workspace", value: "Up to 250" },
      { label: "MCP connector (Claude)", value: "Yes" },
      { label: "API access", value: "No" },
      { label: "Guest access", value: "No" },
      { label: "Collections library", value: "Included" },
    ],
  },
  {
    id: "titan",
    name: "Titan",
    annualPrice: 399,
    monthlyPrice: 499,
    credits: 1500,
    limits: [
      { label: "Verified channels", value: "Up to 20" },
      { label: "Refresh speed", value: "Every 1 hour" },
      { label: "Workspaces", value: "Up to 20" },
      { label: "Competitors per workspace", value: "Higher / custom" },
      { label: "MCP connector (Claude)", value: "Yes" },
      { label: "API access", value: "Yes" },
      { label: "Guest access", value: "Yes" },
      { label: "Collections library", value: "Included" },
    ],
  },
];

// v1 default plan: every user gets Pro-level limits and 100 credits
export const defaultPlanId: Plan["id"] = "pro";
export const creditsTotal = 100;
export const creditsUsed = 12;