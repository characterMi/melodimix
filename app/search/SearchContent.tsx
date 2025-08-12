"use client";

import { twMerge } from "tailwind-merge";

import useOnPlay from "@/hooks/useOnPlay";
import { useSearchSong } from "@/hooks/useSearchSong";
import { usePlayerStore } from "@/store/usePlayerStore";

import FlipArrow from "@/components/FlipArrow";
import NoSongFallback from "../../components/NoSongFallback";
import SongItem from "../../components/SongItem";

import type { Song } from "@/types";
import { useRouter } from "next/navigation";

const SearchContent = ({ songs }: { songs: Song[] }) => {
  const { filteredSongs, isSearching } = useSearchSong(songs);
  const activeId = usePlayerStore((state) => state.activeId);
  const onPlay = useOnPlay(filteredSongs);

  const router = useRouter();

  if (filteredSongs.length === 0)
    return (
      <NoSongFallback
        className="px-6"
        showButton={false}
        fallbackText="There is no results for given query."
      />
    );

  return (
    <div
      className={twMerge(
        "flex flex-col gap-y-2 w-full px-6",
        activeId && "mb-28",
        isSearching && "opacity-50"
      )}
    >
      {filteredSongs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full group">
          <div className="flex-1 overflow-hidden">
            <SongItem
              onClick={(id) => onPlay(id)}
              data={song}
              shouldRunAnimationIfCurrentlyPlaying={false}
            />
          </div>

          <FlipArrow
            onClick={() => router.push(`/songs/${song.id}`, { scroll: false })}
            role="link"
            label={`Go to the ${song.title} song page`}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
