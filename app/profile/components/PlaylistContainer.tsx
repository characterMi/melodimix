"use client";

import Loader from "@/components/Loader";
import { usePlaylistModal } from "@/store/usePlaylistModal";
import type { Playlist } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import PlaylistLink from "./PlaylistLink";

const PlaylistContainer = ({
  playlistsList,
  children,
}: {
  playlistsList: ({
    href: string;
    name: string;
    id: number | "liked" | "uploaded";
  } & Partial<Pick<Playlist, "song_ids" | "user_id" | "is_public">>)[];
  children: React.ReactNode;
}) => {
  const openPlaylistModal = usePlaylistModal((state) => state.onOpen);

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
        Seems like you're not logged in 🤔 if that's true, Please first login to
        Your account.
      </h2>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-[1] bg-neutral-900/95 pt-2 md:pt-4 md:backdrop-blur-sm">
        <div
          ref={playlistContainer}
          className="w-full flex h-full overflow-x-auto snap-x snap-mandatory snap-always pl-2 pr-12"
        >
          {playlistsList.map((playlist) => (
            <PlaylistLink key={playlist.href} {...playlist} />
          ))}
        </div>

        <button
          onClick={() => openPlaylistModal()}
          className="absolute top-0 right-0 w-12 h-[calc(100%-1px)] pb-2 bg-neutral-900 flex items-center justify-center outline-none hover:text-neutral-400 focus-visible:text-neutral-400 transition after:absolute after:top-0 after:right-full after:w-6 after:h-full after:bg-gradient-to-l after:from-neutral-900 after:to-transparent after:pointer-events-none"
        >
          <AiOutlinePlus size={24} aria-hidden />
        </button>

        <hr className="mb-6 border-none bg-neutral-600 h-[1px]" />
      </div>

      {children}
    </>
  );
};

export default PlaylistContainer;
