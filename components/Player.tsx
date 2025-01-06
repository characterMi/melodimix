"use client";

import { useGetSongById } from "@/hooks/useGetSongById";
import { useLoadSongUrl } from "@/hooks/useLoadSongUrl";
import { usePlayer } from "@/hooks/usePlayer";
import { useEffect } from "react";
import Loader from "./Loader";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const activeId = usePlayer((state) => state.activeId);

  const { song, isLoading } = useGetSongById(activeId);

  const songUrl = useLoadSongUrl(song!);

  useEffect(() => {
    if (activeId) {
      navigator.setAppBadge?.(1);
    }

    return () => {
      navigator.clearAppBadge?.();
    };
  }, [activeId]);

  if (!song || !songUrl || !activeId) return null;

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 pt-4 sm:pt-0 rounded-t-2xl px-4 player">
      <section className="h-full w-full relative">
        <PlayerContent song={song} songUrl={songUrl} key={songUrl} />
        {isLoading && (
          <section
            className="w-full h-28 z-50 bg-black/60 backdrop-blur-sm"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </section>
        )}
      </section>
    </div>
  );
};
export default Player;
