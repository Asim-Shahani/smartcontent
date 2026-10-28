import type { Platform } from "@/types/video";

export type Creator = {
  handle: string; // lowercase, no @
  name: string;
  platform: Platform;
  niche: string;
  tags: string[];
  followers: number;
  totalViews: number;
};