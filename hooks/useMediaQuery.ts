import { useEffect, useState } from "react";

export function useMediaQuery(query: `(${string})`): boolean {
  const [mediaQuery] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(query);
  });

  const [matches, setMatches] = useState<boolean>(mediaQuery?.matches ?? false);

  useEffect(() => {
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery?.addEventListener("change", handler);

    return () => mediaQuery?.removeEventListener("change", handler);
  }, []);

  return matches;
}
