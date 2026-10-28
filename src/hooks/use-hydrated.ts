import { useEffect, useState } from "react";

type Persistable = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

// True once a persisted store has loaded from the browser (avoids empty-state flicker)
export function useHydrated(store: Persistable) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub = store.persist.onFinishHydration(() => setReady(true));
    if (store.persist.hasHydrated()) setReady(true);
    return unsub;
  }, [store]);
  return ready;
}