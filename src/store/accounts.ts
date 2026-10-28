import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PendingVerification, VerifiedAccount } from "@/types/account";
import type { Platform } from "@/types/video";

export const VERIFIED_CHANNEL_LIMIT = 3; // default plan = Pro limits (PRD 4.5)

type AddResult = "added" | "duplicate" | "limit";

type AccountsState = {
  accounts: VerifiedAccount[];
  pending: PendingVerification | null;
  setPending: (p: PendingVerification) => void;
  clearPending: () => void;
  addAccount: (platform: Platform, handle: string) => AddResult;
  removeAccount: (id: string) => void;
};

export const useAccounts = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: [],
      pending: null,
      setPending: (pending) => set({ pending }),
      clearPending: () => set({ pending: null }),
      addAccount: (platform, handle) => {
        const clean = handle.trim().replace(/^@/, "").toLowerCase();
        const { accounts } = get();
        if (accounts.some((a) => a.platform === platform && a.handle === clean)) {
          return "duplicate";
        }
        if (accounts.length >= VERIFIED_CHANNEL_LIMIT) return "limit";
        const verifiedLabel = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        set({
          accounts: [
            ...accounts,
            { id: `acc_${Date.now()}`, platform, handle: clean, verifiedLabel },
          ],
        });
        return "added";
      },
      removeAccount: (id) =>
        set((st) => ({ accounts: st.accounts.filter((a) => a.id !== id) })),
    }),
    { name: "smartcontent-accounts", skipHydration: true }
  )
);