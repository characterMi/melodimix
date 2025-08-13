"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const scrollPositions = useRef<Record<`scroll-position${string}`, number>>(
    {}
  );
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!container.current) return;

    const scrollPosition =
      scrollPositions.current[`scroll-position-${pathname}`];
    if (scrollPosition) {
      container.current.scrollTop = scrollPosition;
    }

    const onScrollEnd = (e: Event) => {
      const { scrollTop } = e.currentTarget as HTMLDivElement;
      scrollPositions.current[`scroll-position-${pathname}`] = scrollTop;
    };

    container.current.addEventListener("scrollend", onScrollEnd);

    return () =>
      container.current?.removeEventListener("scrollend", onScrollEnd);
  }, [pathname]);

  return (
    <main className="h-full py-2 overflow-y-auto flex-1" ref={container}>
      {children}
    </main>
  );
};

export default MainContent;
