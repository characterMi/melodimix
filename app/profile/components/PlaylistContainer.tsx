"use client";

import { useRef, useEffect } from "react";
import PlaylistLink from "./PlaylistLink";
import type { Playlist } from "@/types";

const ScrollableHeader = ({
  playlistsList,
}: {
  playlistsList: ({ href: string; name: string; id: string } & Partial<
    Omit<Playlist, "id" | "name">
  >)[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="sticky top-0 z-[1] bg-neutral-900/95 pt-2 md:pt-4 md:backdrop-blur-sm">
      <div
        ref={scrollRef}
        className="w-full flex h-full overflow-x-auto snap-x snap-mandatory snap-always px-2"
      >
        {playlistsList.map((playlist) => (
          <PlaylistLink key={playlist.href} {...playlist} />
        ))}
      </div>
      <hr className="mb-6 border-none bg-neutral-600 h-[1px]" />
    </div>
  );
};

export default ScrollableHeader;
