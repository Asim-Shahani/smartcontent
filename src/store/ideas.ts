import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Idea } from "@/types/idea";

type IdeasState = {
  ideas: Idea[];
  add: (idea: Idea) => void;
  toggleShortlist: (id: string) => void;
};

export const useIdeas = create<IdeasState>()(
  persist(
    (set) => ({
      ideas: [],
      // Ignored if the idea already exists, so re-opening an analysis never duplicates it
      add: (idea) =>
        set((st) =>
          st.ideas.some((i) => i.id === idea.id) ? st : { ideas: [idea, ...st.ideas] }
        ),
      toggleShortlist: (id) =>
        set((st) => ({
          ideas: st.ideas.map((i) =>
            i.id === id ? { ...i, shortlisted: !i.shortlisted } : i
          ),
        })),
    }),
    { name: "smartcontent-ideas", skipHydration: true }
  )
);