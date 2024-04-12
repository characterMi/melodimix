"use client";

import { usePlayer } from "@/hooks/usePlayer";
import { useGetSongById } from "@/hooks/useGetSongById";
import { useLoadSongUrl } from "@/hooks/useLoadSongUrl";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const { activeId } = usePlayer();

  const { song } = useGetSongById(activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 rounded-t-2xl px-4">
      <PlayerContent song={song} songUrl={songUrl} key={songUrl} />
    </div>
  );
};
export default Player;
