import { useEffect, useState } from "react";

export function useMediaQuery(query: `(${string})`): boolean {
  const [mediaQuery] = useState(window.matchMedia(query));
  const [matches, setMatches] = useState<boolean>(mediaQuery.matches);

  useEffect(() => {
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return matches;
}
