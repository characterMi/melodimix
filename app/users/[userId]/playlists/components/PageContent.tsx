"use client";

import NoPlaylistsFallback from "@/components/NoSongFallback";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Playlist } from "@/types";
import PlaylistItem from "./PlaylistItem";

const PageContent = ({
  playlists,
  author,
}: {
  playlists: Playlist[];
  author: string;
}) => {
  const activeId = usePlayerStore((state) => state.activeId);

  if (playlists.length === 0)
    return (
      <NoPlaylistsFallback
        className="-mt-2"
        fallbackText={`${author} doesn't have any public playlist`}
        showButton={false}
      />
    );

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-y-2 w-full"
    >
      {playlists.map((playlist) => (
        <PlaylistItem
          playlist={playlist}
          firstSongId={playlist.song_ids[0]}
          key={playlist.id}
        />
      ))}
    </div>
  );
};

export default PageContent;
