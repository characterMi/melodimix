"use client";

import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import { useOnPlay } from "@/hooks/useOnPlay";
import type { Song } from "@/types";
import Options from "../components/UploadedSongOptions";

const PageContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0)
    return (
      <NoSongFallback className="-mt-2" fallbackText="You have no songs." />
    );

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {songs.map((song) => (
        <div className="flex items-center gap-x-4 w-full" key={song.id}>
          <div className="flex-1 overflow-hidden">
            <SongItem
              data={song}
              onClick={(id) => onPlay(id)}
              showAuthor={false}
            />
          </div>

          <Options song={song} />
        </div>
      ))}
    </div>
  );
};

export default PageContent;
