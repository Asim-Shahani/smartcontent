export type Platform = "tiktok" | "instagram" | "youtube";

export type Video = {
  id: string;
  title: string;
  creator: string;
  platform: Platform;
  postedLabel: string;
  views: number;
  engagement: number; // percent
  outlierScore: number; // multiple of the channel's own average
  niche: string;
};