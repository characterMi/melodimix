"use client";

import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Playlist, Song } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoShareSocial } from "react-icons/io5";

const PageContent = ({
  songs,
  errMessage,
  playlist,
}: {
  songs: Song[];
  errMessage?: string;
  playlist?: Playlist & { author?: string };
}) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);
  const playlistSongsCount = playlist?.song_ids.length || 0;

  if (errMessage || songs.length === 0)
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText={
          errMessage ||
          (songs.length < playlistSongsCount
            ? `${playlistSongsCount - songs.length} songs has been deleted!`
            : "") + "No song in this playlist."
        }
      />
    );

  function handleShare() {
    if (!navigator.share) {
      toast.error("Share not supported on your browser");
      return;
    }

    navigator.share({
      title: "Melodimix - Your Ultimate Music Destination.",
      text: `Checkout ${playlist?.name} playlist by ${
        playlist?.author ?? "a User"
      }`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/${playlist?.user_id}/playlists/${playlist?.id}`,
    });
  }

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-6 w-full"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-thin inline mr-2">
          <span className="font-bold">{playlist?.name}</span> by{" "}
          <Link
            href={`/users/${playlist?.user_id}`}
            className="gradient-text hover:opacity-75 focus-visible:opacity-75 outline-none transition-opacity"
          >
            {playlist?.author}
          </Link>
        </h2>

        <button
          className="hover:opacity-75 focus-visible:opacity-75 outline-none transition-opacity mt-2"
          aria-label="Share the playlist"
          onClick={handleShare}
        >
          <IoShareSocial className="text-white -mb-1 size-5 sm:size-7" />
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
