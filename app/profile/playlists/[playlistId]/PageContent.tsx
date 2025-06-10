"use client";

import { updatePlaylist } from "@/actions/updatePlaylist";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import Spinner from "@/components/Spinner";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Playlist, Song } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const DeleteButton = ({
  songTitle,
  newData,
}: {
  songTitle: string;
  newData: Playlist;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    const { error } = await updatePlaylist(newData);

    if (error) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Playlist updated.");
    }

    setIsDeleting(false);
  };

  return (
    <button
      className="cursor-pointer size-8 bg-gradient-to-b from-rose-900 to-rose-950 border border-rose-800 rounded-sm flex items-center justify-center hover:opacity-75 focus-visible:opacity-75 outline-none transition"
      onClick={handleClick}
      aria-label={`Remove ${songTitle} from playlist`}
      disabled={isDeleting}
    >
      {isDeleting ? <Spinner /> : <FiTrash2 size={20} />}
    </button>
  );
};

const PageContent = ({
  songs,
  errMessage,
  playlist,
}: {
  songs: Song[];
  errMessage?: string;
  playlist?: Playlist;
}) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);

  if (errMessage)
    return <NoSongFallback className="-mt-2" fallbackText={errMessage} />;

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-y-2 w-full"
    >
      {songs.map((song) => (
        <div className="flex items-center gap-x-4 w-full">
          <div className="flex-1 overflow-hidden">
            <SongItem data={song} onClick={(id) => onPlay(id)} />
          </div>

          <DeleteButton
            songTitle={song.title}
            newData={{
              id: playlist!.id,
              user_id: playlist!.user_id,
              name: playlist!.name,
              song_ids: songs
                .filter((currSong) => song.id !== currSong.id)
                .map((song) => song.id),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PageContent;
