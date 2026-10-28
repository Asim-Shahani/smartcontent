import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Script, ScriptBlocks } from "@/types/script";

function today() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type ScriptsState = {
  scripts: Script[];
  add: (s: Omit<Script, "updatedLabel">) => void;
  save: (id: string, blocks: ScriptBlocks, expanded: boolean) => void;
};

export const useScripts = create<ScriptsState>()(
  persist(
    (set) => ({
      scripts: [],
      add: (s) =>
        set((st) => ({ scripts: [{ ...s, updatedLabel: today() }, ...st.scripts] })),
      // Every save creates a new version
      save: (id, blocks, expanded) =>
        set((st) => ({
          scripts: st.scripts.map((x) =>
            x.id === id
              ? { ...x, blocks, expanded, version: x.version + 1, updatedLabel: today() }
              : x
          ),
        })),
    }),
    { name: "smartcontent-scripts", skipHydration: true }
  )
);

// True once saved scripts have been loaded from the browser
export function useScriptsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub = useScripts.persist.onFinishHydration(() => setReady(true));
    if (useScripts.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  return ready;
}