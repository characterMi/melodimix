"use client";

import NoPlaylistsFallback from "@/components/NoDataFallback";
import PlaylistCard from "@/features/playlist/components/PlaylistCard";

const PageContent = ({
  playlists,
  author,
}: {
  playlists: Playlist[];
  author: string;
}) => {
  if (playlists.length === 0)
    return (
      <NoPlaylistsFallback
        className="-mt-2"
        fallbackText={`${author} doesn't have any public playlist`}
        showButton={false}
      />
    );

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {playlists.map((playlist) => (
        <PlaylistCard playlist={playlist} key={playlist.id} />
      ))}
    </div>
  );
};

export default PageContent;
