import type { Platform } from "@/types/video";

export type CollectionCategory = "formats" | "editing" | "visual-hooks" | "signature";

export type CollectionExample = {
  creator: string;
  platform: Platform;
  title: string;
  views: number;
};

export type Collection = {
  id: string;
  name: string;
  category: CollectionCategory;
  hint: string;
  description: string;
  isNew: boolean;
  examples: CollectionExample[];
  breakdown: { label: string; text: string }[];
  transcript: string[];
};