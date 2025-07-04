"use client";

import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import Options from "../components/UploadedSongOptions";

const PageContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);

  if (songs.length === 0)
    return (
      <NoSongFallback className="-mt-2" fallbackText="You have no songs." />
    );

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-y-2 w-full"
    >
      {songs.map((song) => (
        <div className="flex items-center gap-x-4 w-full" key={song.id}>
          <div className="flex-1 overflow-hidden">
            <SongItem data={song} onClick={(id) => onPlay(id)} />
          </div>

          <Options song={song} />
        </div>
      ))}
    </div>
  );
};

export default PageContent;
