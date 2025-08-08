import { useEffect, useState } from "react";

export function useMediaQuery(query: `(${string})`): boolean {
  const [mediaQueryState, setMediaQueryState] = useState<MediaQueryList>();

  const [matches, setMatches] = useState<boolean>(
    mediaQueryState?.matches ?? false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    setMediaQueryState(mediaQuery);
    setMatches(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      setMediaQueryState(undefined);
    };
  }, []);

  return matches;
}
