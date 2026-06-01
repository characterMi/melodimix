"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { usePlaylistsPageData } from "@/features/infinite-scroll/store/usePlaylistsPageData";
import { useOnPlay } from "@/features/player/hooks/useOnPlay";
import { updatePlaylist } from "@/features/playlist/actions";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";

import NoSongFallback from "@/components/NoDataFallback";
import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";
import SongItem from "@/features/song-related/components/SongItem";

const DeleteSongFromPlaylistButton = ({
  songTitle,
  newData,
}: {
  songTitle: string;
  newData: Playlist;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const updatePlaylistStore = usePlaylistsPageData((state) => state.updateOne);

  const handleClick = async () => {
    if (isDeleting) return;

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again.",
      );
      return;
    }

    setIsDeleting(true);

    const { error } = await updatePlaylist(newData);

    if (error) {
      onError();
    } else {
      onSuccess("Playlist updated.");
    }

    setIsDeleting(false);
    updatePlaylistStore(newData);
  };

  return (
    <VariantButton
      variant="error"
      onClick={handleClick}
      aria-label={`Remove ${songTitle} from playlist`}
      disabled={isDeleting}
      className="size-8"
    >
      {isDeleting ? <Spinner /> : <FiTrash2 size={20} />}
    </VariantButton>
  );
};

const PageContent = ({
  songs,
  errMessage,
  playlist,
}: {
  songs: SongWithAuthor[];
  errMessage?: string;
  playlist?: Playlist;
}) => {
  const onPlay = useOnPlay(songs);

  if (errMessage || songs.length === 0)
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText={errMessage || "No song in this playlist."}
      />
    );

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {songs.map((song) => (
        <div className="flex items-center gap-x-4 w-full" key={song.id}>
          <div className="flex-1 overflow-hidden">
            <SongItem data={song} onClick={(id) => onPlay(id)} />
          </div>

          <DeleteSongFromPlaylistButton
            songTitle={song.title}
            newData={{
              ...playlist!,
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
