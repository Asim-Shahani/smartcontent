import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Creator } from "@/types/channel";
import type { Platform } from "@/types/video";

export const COMPETITOR_LIMIT = 150; // default plan = Pro (PRD 4.5)

export const creatorKey = (c: { platform: Platform; handle: string }) =>
  `${c.platform}:${c.handle.toLowerCase()}`;

type AddResult = "added" | "duplicate" | "limit";

type WatchlistState = {
  channels: Creator[];
  add: (c: Creator) => AddResult;
  remove: (key: string) => void;
};

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      channels: [],
      add: (c) => {
        const { channels } = get();
        if (channels.some((x) => creatorKey(x) === creatorKey(c))) return "duplicate";
        if (channels.length >= COMPETITOR_LIMIT) return "limit";
        set({ channels: [c, ...channels] });
        return "added";
      },
      remove: (key) =>
        set((st) => ({ channels: st.channels.filter((x) => creatorKey(x) !== key) })),
    }),
    { name: "smartcontent-watchlist", skipHydration: true }
  )
);