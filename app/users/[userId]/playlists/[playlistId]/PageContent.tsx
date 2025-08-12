"use client";

import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { sharePlaylist } from "@/lib/share";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Playlist, Song } from "@/types";
import Link from "next/link";
import { IoShareSocialOutline } from "react-icons/io5";

type Props = {
  songs: Song[];
  playlist?: Playlist & { author: string };
  errMessage?: string;
};

const PageContent = ({ songs, errMessage, playlist }: Props) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);
  const playlistSongsCount = playlist?.song_ids.length || 0;

  if (errMessage || songs.length <= 0)
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText={
          errMessage ||
          (playlistSongsCount > 0
            ? `${playlistSongsCount} ${
                playlistSongsCount === 1 ? "song" : "songs"
              } has been deleted!`
            : "No song in this playlist.")
        }
        showButton={!!errMessage}
      />
    );

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-6 w-full"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-thin inline mr-4">
          <span className="font-bold">{playlist?.name}</span> by{" "}
          <Link
            scroll={false}
            href={`/users/${playlist?.user_id}`}
            className="gradient-text hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity"
          >
            {playlist?.author}
          </Link>
        </h2>

        <button
          className="hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity mt-2"
          aria-label="Share the playlist"
          onClick={() => sharePlaylist(playlist!.name, playlist!.author)}
        >
          <IoShareSocialOutline className="text-white -mb-1.5 sm:-mb-1 size-7" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {songs.map((song) => (
          <SongItem data={song} onClick={(id) => onPlay(id)} key={song.id} />
        ))}
      </div>

      {songs.length < playlistSongsCount && (
        <p className="text-neutral-500 text-center">
          {playlistSongsCount - songs.length} songs has been deleted!
        </p>
      )}
    </div>
  );
};

export default PageContent;
