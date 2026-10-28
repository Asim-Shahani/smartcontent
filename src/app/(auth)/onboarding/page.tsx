import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your first workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Everything you research lives inside a workspace.
        </p>
      </div>
      <Input defaultValue="My Workspace" />
      <Button asChild className="w-full">
        <Link href="/app/dashboard">Continue to dashboard</Link>
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Want your own stats?{" "}
        <Link
          href="/app/settings/social-verification"
          className="text-foreground underline"
        >
          Connect a social account
        </Link>{" "}
        (optional)
      </p>
    </div>
  );
}