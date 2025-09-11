"use client";

import FlipArrow from "@/components/FlipArrow";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SongWithAuthor } from "@/types";
import { useRouter } from "next/navigation";

const PageContent = ({
  songs,
  error,
}: {
  songs: SongWithAuthor[];
  error: string | null;
}) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);

  const router = useRouter();

  if (error || songs.length <= 0) {
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText={error || "User doesn't have any interests."}
        showButton={!!error}
      />
    );
  }

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col gap-2">
        {songs.map((song) => (
          <div className="flex items-center gap-x-4 w-full group">
            <div className="flex-1 overflow-hidden">
              <SongItem data={song} onClick={(id) => onPlay(id)} />
            </div>

            <FlipArrow
              onClick={() =>
                router.push(`/songs/${song.id}`, { scroll: false })
              }
              role="link"
              label={`Go to the ${song.title} song page`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageContent;
