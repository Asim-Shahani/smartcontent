import type { Platform } from "@/types/video";

export type VerifiedAccount = {
  id: string;
  platform: Platform;
  handle: string;
  verifiedLabel: string;
};

export type PendingVerification = {
  platform: Platform;
  handle: string;
  code: string;
  expiresAt: number;
};

export const platformNames: Record<Platform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
};