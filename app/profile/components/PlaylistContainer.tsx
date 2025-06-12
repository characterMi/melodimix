"use client";

import { useRef, useEffect } from "react";
import PlaylistLink from "./PlaylistLink";
import type { Playlist } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Loader from "@/components/Loader";

const ScrollableHeader = ({
  playlistsList,
  children,
}: {
  playlistsList: ({ href: string; name: string; id: string } & Partial<
    Omit<Playlist, "id" | "name">
  >)[];
  children: React.ReactNode;
}) => {
  const playlistContainer = useRef<HTMLDivElement>(null);
  const { session, isLoading: isUserLoading } = useSessionContext();

  useEffect(() => {
    const el = playlistContainer.current;
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

  if (isUserLoading) return <Loader className="ml-4" />;

  if (!session?.user) {
    return (
      <h2 className="m-4">
        Seems like you didn't sign-in 🤔 if that's true, Please first sign-in to
        Your account.
      </h2>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-[1] bg-neutral-900/95 pt-2 md:pt-4 md:backdrop-blur-sm">
        <div
          ref={playlistContainer}
          className="w-full flex h-full overflow-x-auto snap-x snap-mandatory snap-always px-2"
        >
          {playlistsList.map((playlist) => (
            <PlaylistLink key={playlist.href} {...playlist} />
          ))}
        </div>
        <hr className="mb-6 border-none bg-neutral-600 h-[1px]" />
      </div>

      {children}
    </>
  );
};

export default ScrollableHeader;
