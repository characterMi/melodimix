"use client";

import { Fragment } from "react";
import { LuTrash2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import { useGetDownloadedSongs } from "@/features/cache/hooks/useGetDownloadedSongs";
import { useDownloadedSongsModal } from "@/features/cache/store/useDownloadedSongsModal";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";

import Loader from "../../../components/Loader";
import VariantButton from "../../../components/VariantButton";
import Modal from "../../modal/components/Modal";

const DownloadedSongsModal = () => {
  const { isOpen, onClose } = useDownloadedSongsModal();

  return (
    <Modal
      title="Downloaded Songs"
      description=""
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    >
      <div className="h-[30rem]">
        <hr />

        <DownloadedSongs />
      </div>
    </Modal>
  );
};

const DownloadedSongs = () => {
  const { status, rawUrls, deleteSong } = useGetDownloadedSongs();

  return (
    <div
      className={twMerge(
        "flex gap-2 justify-center h-full",
        status !== "loaded" && "items-center",
      )}
    >
      {status === "loading" && <Loader className="min-w-8" />}

      {status === "loaded" && (
        <SongsList rawUrls={rawUrls} deleteSong={deleteSong} />
      )}

      {status === "error" && (
        <p className="text-rose-50">
          Error while getting the downloaded songs! ⚠️
        </p>
      )}
    </div>
  );
};

const SongsList = ({
  rawUrls,
  deleteSong,
}: {
  rawUrls: string[];
  deleteSong: (song: string) => void;
}) => {
  const handleDelete = async (songUrl: string) => {
    const cache = await caches.open("songs");
    const cachedResponse = await cache.match(songUrl);

    if (!cachedResponse) {
      onError("Song not found in the cache.");
      return;
    }

    const result = await cache.delete(songUrl);

    if (result) {
      onSuccess("Song deleted from the cache.");
      deleteSong(songUrl);
    } else {
      onError("Couldn't delete the song.");
    }
  };

  return rawUrls.length <= 0 ? (
    <p className="text-rose-100">There is no song in the cache.</p>
  ) : (
    <div className="space-y-6 w-full py-6">
      {rawUrls.map((url, index) => (
        <Fragment key={url}>
          {index !== 0 && <hr className="border-none h-[1px] bg-neutral-600" />}

          <div className="flex items-center gap-2 justify-between w-full">
            <p className="truncate text-lg font-thin">
              <span className="opacity-50">{index + 1}.</span>{" "}
              {/* Normalized name */}
              {decodeURIComponent(url.split("/").pop()?.slice(5, -37) ?? "")}
            </p>

            <VariantButton
              variant="error"
              aria-label="Delete the song"
              className="size-8 min-w-[32px]"
              onClick={() => handleDelete(url)}
            >
              <LuTrash2 size={20} aria-hidden />
            </VariantButton>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default DownloadedSongsModal;
