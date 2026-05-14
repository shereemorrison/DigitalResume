import { useEffect, useState } from "react";

/** Client-only matchMedia; false on first SSR paint. */
export function useMediaMinWidth(minPx: number): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(min-width: ${minPx}px)`).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minPx}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minPx]);

  return matches;
}
