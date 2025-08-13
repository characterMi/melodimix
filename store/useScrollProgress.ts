import { create } from "zustand";

interface ScrollProgress {
  scrollPositions: Record<`scroll-position-${string}`, number>;
  setScrollPosition: (pathname: string, newPosition: number) => void;
}

export const useScrollProgress = create<ScrollProgress>((setState) => ({
  scrollPositions: {},
  setScrollPosition: (pathname, newPosition) =>
    setState(({ scrollPositions }) => ({
      scrollPositions: {
        ...scrollPositions,
        [`scroll-position-${pathname}`]: newPosition,
      },
    })),
}));
