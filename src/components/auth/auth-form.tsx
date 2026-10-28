"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  // UI only for now: real authentication comes with the backend
  function submit() {
    router.push(isSignup ? "/onboarding" : "/app/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignup
            ? "You get 100 credits every month. No payment needed."
            : "Log in to continue to Smart Content."}
        </p>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="w-full" onClick={submit}>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" onClick={submit}>
          Continue with Apple
        </Button>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        {!isSignup && (
          <Link
            href="/forgot-password"
            className="block text-right text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </Link>
        )}
        <Button className="w-full" onClick={submit}>
          {isSignup ? "Sign up" : "Log in"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-foreground underline"
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}