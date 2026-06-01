"use client";

import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useRef } from "react";

import { usePlayerStore } from "@/features/player/store/usePlayerStore";
import { useScrollProgress } from "@/features/scroll-container/store/useScrollProgress";

const SaveScrollProgress = ({
  container,
}: {
  container: RefObject<HTMLDivElement>;
}) => {
  const { scrollPositions, setScrollPosition } = useScrollProgress();
  const pathname = usePathname();

  useEffect(() => {
    if (!container.current) return;

    const scrollPosition = scrollPositions[`scroll-position-${pathname}`];
    if (scrollPosition) {
      container.current.scrollTop = scrollPosition;
    }

    const onScrollEnd = (e: Event) => {
      const { scrollTop } = e.currentTarget as HTMLDivElement;
      setScrollPosition(pathname, scrollTop);
    };

    container.current.addEventListener("scrollend", onScrollEnd);

    return () =>
      container.current?.removeEventListener("scrollend", onScrollEnd);
  }, [pathname]);

  return null;
};

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const activeId = usePlayerStore((state) => state.activeId);
  const container = useRef<HTMLDivElement>(null);

  return (
    <section
      className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto"
      style={{ paddingBottom: activeId ? "124px" : "0" }}
      ref={container}
    >
      <SaveScrollProgress container={container} />
      {children}
    </section>
  );
};

export default MainContent;
