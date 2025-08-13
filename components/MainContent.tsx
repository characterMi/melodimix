"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!container.current) return;

    const scrollPosition = sessionStorage.getItem(
      `scroll-position-${pathname}`
    );
    if (scrollPosition) {
      container.current.scrollTop = Number(scrollPosition);
    }

    const handleScroll = () => {
      if (!container.current) return;

      const scrollPosition = container.current.scrollTop;
      sessionStorage.setItem(
        `scroll-position-${pathname}`,
        String(scrollPosition)
      );
    };

    container.current.addEventListener("scroll", handleScroll);

    return () => {
      container.current?.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <main className="h-full py-2 overflow-y-auto flex-1" ref={container}>
      {children}
    </main>
  );
};

export default MainContent;
