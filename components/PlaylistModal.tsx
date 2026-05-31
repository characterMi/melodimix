import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { TbMinus, TbPlus } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import { useCreateOrUpdatePlaylist } from "@/hooks/useCreateOrUpdatePlaylist";
import { useSearchData } from "@/hooks/useSearchData";
import { shouldReduceMotion } from "@/lib/reduceMotion";

import Button from "./Button";
import DeleteFileButton from "./DeleteFileButton";
import Input from "./Input";
import Loader from "./Loader";
import Modal from "./Modal";
import SearchInput from "./SearchInput";
import VariantButton from "./VariantButton";

import type { SongWithAuthor } from "@/types";

const SongCard = ({
  data,
  isActive,
  onClick,
}: {
  data: SongWithAuthor;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div className="flex items-center text-left gap-x-3 bg-neutral-900/50 hover:bg-neutral-900/20 w-full py-2 px-4 rounded-md">
    <div className="flex flex-col gap-y-1 overflow-hidden w-full">
      <p className="text-white text-lg whitespace-nowrap select-none truncate">
        {data.title} - {data.artist}
      </p>

      <p className="text-neutral-400 text-sm truncate">{data.author}</p>
    </div>

    <VariantButton
      onClick={onClick}
      aria-label={
        isActive
          ? `Remove ${data.title} from playlist`
          : `Add ${data.title} to playlist`
      }
    >
      {isActive ? <TbMinus size={18} /> : <TbPlus size={18} />}
    </VariantButton>
  </div>
);

const SearchResults = ({
  songIds,
  setSongIds,
}: {
  songIds: number[];
  setSongIds: (ids: number[]) => void;
}) => {
  const { searchResult: filteredSongs, isSearching } = useSearchData();

  return (
    <div
      className={twMerge(
        "w-full flex flex-col gap-2",
        isSearching && "opacity-50",
      )}
    >
      {filteredSongs.length === 0 ? (
        <p className="text-neutral-400 m-2">No song here!</p>
      ) : (
        filteredSongs.map((song) => {
          const isActive = songIds.includes(song.id);

          return (
            <SongCard
              key={song.id}
              data={song as SongWithAuthor}
              isActive={isActive}
              onClick={() => {
                setSongIds(
                  isActive
                    ? songIds.filter((id) => id !== song.id)
                    : [...songIds, song.id],
                );
              }}
            />
          );
        })
      )}
    </div>
  );
};

const ImageUploader = ({
  poster,
  setPoster,
  defaultPoster,
  disabled,
}: {
  poster: null | File;
  setPoster: (file: File | null) => void;
  defaultPoster?: string;
  disabled: boolean;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (!poster) return;

    setIsImageLoading(true);
    const fileObject = URL.createObjectURL(poster);
    setImageSrc(fileObject);

    return () => {
      URL.revokeObjectURL(fileObject);
      setImageSrc("");
    };
  }, [poster]);

  return (
    <div className="size-[250px] rounded-lg bg-neutral-400/10 relative flex flex-col items-center justify-center gap-2 group">
      <input
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={(e) => setPoster(e.target.files?.[0] ?? null)}
        className="opacity-0 size-full absolute top-0 left-0 z-[2] cursor-pointer"
        ref={input}
      />

      <FiUpload size={62} aria-hidden />

      <h3 className="font-semibold mt-4">Select a poster (optional)</h3>

      <p className="text-xs gradient-text opacity-80">
        Click and choose or Drop your file
      </p>

      <div
        aria-label="Selected image container"
        className="rounded-md absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-[95%] border border-dashed z-[1] overflow-hidden"
      >
        {(imageSrc || defaultPoster) && (
          <img
            src={imageSrc || defaultPoster}
            alt={imageSrc ? "Uploaded image" : "Current image"}
            className="size-full overflow-hidden object-cover"
            onLoad={() => setIsImageLoading(false)}
          />
        )}

        {isImageLoading && (
          <div className="absolute top-0 left-0 size-full bg-black/60 flex justify-center items-center backdrop-blur-md">
            <Loader label="The image is being loaded." />
          </div>
        )}
      </div>

      {imageSrc && (
        <DeleteFileButton
          label="Remove the image"
          className="top-[5%] right-[5%] z-[3]"
          onClick={() => {
            if (disabled) return;

            setPoster(null);
            input.current!.value = "";
          }}
        />
      )}
    </div>
  );
};

const PlaylistModal = () => {
  const {
    isEditing,
    isPlaylistModalOpen,
    onPlaylistModalClose,
    initialData,
    name,
    setName,
    isPublic,
    setIsPublic,
    poster,
    setPoster,
    songIds,
    setSongIds,
    isSubmitting,
    onSubmit,
  } = useCreateOrUpdatePlaylist();

  return (
    <Modal
      title={`${isEditing ? "Update" : "Add a"} playlist`}
      description={`${
        isEditing ? "Update " + initialData?.name : "Create a new"
      } playlist.`}
      isOpen={isPlaylistModalOpen}
      handleChange={(open) => !open && onPlaylistModalClose()}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
        placeholder="Playlist name"
        maxLength={100}
        required
        aria-label="Enter the playlist name"
      />

      <div className="my-6 flex gap-2 items-center justify-between">
        <h3 className="font-semibold text-nowrap whitespace-nowrap">
          Is this Playlist public?
        </h3>

        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          disabled={isSubmitting}
          aria-label="Make playlist public"
          className={twMerge(
            "appearance-none size-5 border-2 border-emerald-600 rounded-full checked:bg-emerald-500 checked:border-emerald-500 bg-neutral-700 cursor-pointer",
            !shouldReduceMotion && "transition-colors",
          )}
        />
      </div>

      <ImageUploader
        poster={poster}
        setPoster={setPoster}
        defaultPoster={initialData?.poster_path}
        disabled={isSubmitting}
      />

      <hr className="border-neutral-600 my-4" />

      <div className="mt-6 flex flex-col gap-4">
        <h3 className="font-semibold">Search, and Add songs</h3>

        <SearchInput placeholder="What song do you want to add to your playlist ?" />

        <SearchResults songIds={songIds} setSongIds={setSongIds} />
      </div>

      <hr className="border-neutral-600 my-4" />

      <Button
        onClick={onSubmit}
        disabled={name.trim() === "" || isSubmitting}
        className="w-full mt-4"
        aria-live="polite"
      >
        {isEditing && (isSubmitting ? "Updating..." : "Update playlist")}
        {!isEditing && (isSubmitting ? "Creating..." : "Create playlist")}
      </Button>
    </Modal>
  );
};

export default PlaylistModal;
