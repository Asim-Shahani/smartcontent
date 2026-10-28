import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Hook } from "@/types/hook";

type SavedHooksState = {
  saved: Hook[];
  toggle: (hook: Hook) => void;
};

export const useSavedHooks = create<SavedHooksState>()(
  persist(
    (set) => ({
      saved: [],
      toggle: (hook) =>
        set((st) =>
          st.saved.some((h) => h.id === hook.id)
            ? { saved: st.saved.filter((h) => h.id !== hook.id) }
            : { saved: [hook, ...st.saved] }
        ),
    }),
    { name: "smartcontent-hooks", skipHydration: true }
  )
);