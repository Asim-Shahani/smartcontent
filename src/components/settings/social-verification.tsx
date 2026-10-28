"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHydrated } from "@/hooks/use-hydrated";
import { confirmVerification, startVerification } from "@/lib/api/verification";
import { VERIFIED_CHANNEL_LIMIT, useAccounts } from "@/store/accounts";
import { platformNames } from "@/types/account";
import type { Platform } from "@/types/video";

const platforms: Platform[] = ["tiktok", "instagram", "youtube"];

export function SocialVerification() {
  const ready = useHydrated(useAccounts);
  const accounts = useAccounts((s) => s.accounts);
  const pending = useAccounts((s) => s.pending);
  const setPending = useAccounts((s) => s.setPending);
  const clearPending = useAccounts((s) => s.clearPending);
  const addAccount = useAccounts((s) => s.addAccount);
  const removeAccount = useAccounts((s) => s.removeAccount);

  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState<"start" | "verify" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justVerified, setJustVerified] = useState<string | null>(null);
  const [bioHasCode, setBioHasCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const atLimit = accounts.length >= VERIFIED_CHANNEL_LIMIT;

  async function onStart() {
    const clean = handle.trim().replace(/^@/, "");
    if (!clean) {
      setError("Enter your handle first.");
      return;
    }
    if (accounts.some((a) => a.platform === platform && a.handle === clean.toLowerCase())) {
      setError("This account is already verified.");
      return;
    }
    setError(null);
    setJustVerified(null);
    setBusy("start");
    const { code, expiresAt } = await startVerification();
    setPending({ platform, handle: clean, code, expiresAt });
    setBusy(null);
  }

  async function onVerify() {
    if (!pending) return;
    const current = pending;
    setBusy("verify");
    setError(null);
    const res = await confirmVerification({
      expiresAt: current.expiresAt,
      bioHasCode,
    });
    setBusy(null);

    if (!res.ok) {
      setError(
        res.reason === "expired"
          ? "This code has expired. Cancel and generate a new one."
          : `We couldn't find the code in @${current.handle}'s ${platformNames[current.platform]} bio. Make sure you saved the change, wait a minute, then press Verify again.`
      );
      return;
    }

    const result = addAccount(current.platform, current.handle);
    if (result === "limit") {
      setError(`You've reached the ${VERIFIED_CHANNEL_LIMIT} verified channels included in your plan.`);
      return;
    }
    clearPending();
    setHandle("");
    setBioHasCode(false);
    setJustVerified(`@${current.handle}`);
  }

  async function copyCode() {
    if (!pending) return;
    await navigator.clipboard.writeText(pending.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function cancel() {
    clearPending();
    setError(null);
    setBioHasCode(false);
  }

  if (!ready) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Connecting an account is optional. It unlocks your personal dashboard. We verify
        ownership with a code in your bio, so we never ask for your password.
      </p>

      {justVerified && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/40 bg-card p-4 text-sm">
          <p>
            <span className="font-medium">{justVerified} is verified.</span> Your dashboard
            is unlocked.
          </p>
          <Button asChild size="sm">
            <Link href="/app/dashboard">Open dashboard</Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Verified accounts
            <Badge variant="secondary">
              {accounts.length} of {VERIFIED_CHANNEL_LIMIT}
            </Badge>
          </CardTitle>
          <CardDescription>Your plan includes up to {VERIFIED_CHANNEL_LIMIT} verified channels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No verified accounts yet.</p>
          ) : (
            accounts.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-md border border-border p-3 text-sm"
              >
                <Badge variant="secondary">{platformNames[a.platform]}</Badge>
                <span className="flex-1 font-medium">@{a.handle}</span>
                <span className="text-xs text-muted-foreground">
                  Verified {a.verifiedLabel}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove @${a.handle}`}
                  onClick={() => removeAccount(a.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify a new account</CardTitle>
          <CardDescription>
            {pending ? "Step 2 of 2: place the code in your bio" : "Step 1 of 2: choose a platform and enter your handle"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pending ? (
            <div className="space-y-4">
              <p className="text-sm">
                Add this code to the bio of{" "}
                <span className="font-medium">@{pending.handle}</span> on{" "}
                {platformNames[pending.platform]}, save it, then press Verify.
              </p>
              <div className="flex items-center gap-2">
                <code className="rounded-md border border-border bg-muted px-3 py-2 text-lg tracking-widest">
                  {pending.code}
                </code>
                <Button size="icon" variant="ghost" onClick={copyCode} aria-label="Copy code">
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The code expires in 30 minutes. You can remove it from your bio after
                verification.
              </p>
              <label className="flex items-center gap-2 rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={bioHasCode}
                  onChange={(e) => setBioHasCode(e.target.checked)}
                />
                Dev only: pretend the code is in my bio (the real bio check arrives with the backend)
              </label>
              <div className="flex gap-2">
                <Button onClick={onVerify} disabled={busy === "verify"}>
                  {busy === "verify" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Checking bio...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
                <Button variant="ghost" onClick={cancel} disabled={busy === "verify"}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={platform === p ? "default" : "outline"}
                    onClick={() => setPlatform(p)}
                  >
                    {platformNames[p]}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="@yourhandle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !atLimit) onStart();
                }}
              />
              {atLimit && (
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the {VERIFIED_CHANNEL_LIMIT} verified channels included
                  in your plan. Remove one to add another.
                </p>
              )}
              <Button onClick={onStart} disabled={atLimit || busy === "start"}>
                {busy === "start" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Generating...
                  </>
                ) : (
                  "Generate code"
                )}
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}