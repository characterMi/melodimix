"use client";

import { deleteInterest } from "@/actions/interests.actions";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";
import { useOnPlay } from "@/hooks/useOnPlay";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const DeleteInterest = ({
  songTitle,
  songId,
}: {
  songTitle: string;
  songId: number;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (isDeleting) return;

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

    setIsDeleting(true);

    const { error } = await deleteInterest(songId);

    if (error) {
      onError(error);
    } else {
      onSuccess("Success!");
    }

    setIsDeleting(false);
  };

  return (
    <VariantButton
      variant="error"
      onClick={handleClick}
      aria-label={`Remove ${songTitle} from interests`}
      disabled={isDeleting}
      className="size-8"
    >
      {isDeleting ? <Spinner /> : <FiTrash2 size={20} />}
    </VariantButton>
  );
};

const PageContent = ({
  songs,
  error,
}: {
  songs: Song[];
  error: string | null;
}) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);

  if (error || songs.length === 0) {
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText={error || "You don't have any interests."}
      />
    );
  }

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-y-2 w-full"
    >
      {songs.map((song) => (
        <div className="flex items-center gap-x-4 w-full" key={song.id}>
          <div className="flex-1 overflow-hidden">
            <SongItem
              data={song}
              onClick={(id) => onPlay(id)}
              showAuthor={false}
            />
          </div>

          <DeleteInterest songTitle={song.title} songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default PageContent;
