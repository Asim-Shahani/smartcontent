export const VERIFICATION_TTL_MS = 30 * 60 * 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mirrors POST /verify/start: generate a unique code, store code + handle + expiry
export async function startVerification() {
  await wait(600);
  const code = "SC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return { code, expiresAt: Date.now() + VERIFICATION_TTL_MS };
}

type ConfirmResult = { ok: true } | { ok: false; reason: "expired" | "not_found" };

// Mirrors POST /verify/confirm: fetch the bio via the platform API and check for the code.
// Mock: the caller says whether the code is "in the bio". The real backend replaces this.
export async function confirmVerification(args: {
  expiresAt: number;
  bioHasCode: boolean;
}): Promise<ConfirmResult> {
  await wait(1500);
  if (Date.now() > args.expiresAt) return { ok: false, reason: "expired" };
  return args.bioHasCode ? { ok: true } : { ok: false, reason: "not_found" };
}