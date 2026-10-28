import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CREDITS_PER_MONTH = 100; // PRD: unified allowance for all users in v1

type CreditsState = {
  balance: number;
  charged: string[];
  consume: (actionId: string) => boolean;
  adminSet: (n: number) => void;
};

export const useCredits = create<CreditsState>()(
  persist(
    (set, get) => ({
      balance: CREDITS_PER_MONTH,
      charged: [],
      // Idempotent: the same actionId is never charged twice (PRD FR-BILL-03)
      consume: (actionId) => {
        const { balance, charged } = get();
        if (charged.includes(actionId)) return true;
        if (balance <= 0) return false;
        set({ balance: balance - 1, charged: [...charged, actionId] });
        return true;
      },
      // Admin manual adjustment (PRD FR-BILL-10)
      adminSet: (n) => set({ balance: n }),
    }),
    { name: "smartcontent-credits", skipHydration: true }
  )
);