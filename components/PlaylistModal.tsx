import { useCreateOrUpdatePlaylist } from "@/hooks/useCreateOrUpdatePlaylist";
import { useSearchSong } from "@/hooks/useSearchSong";
import type { Song } from "@/types";
import { TbMinus, TbPlus } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import SearchInput from "./SearchInput";
import VariantButton from "./VariantButton";

const SongCard = ({
  data,
  isActive,
  onClick,
}: {
  data: Song;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div className="flex items-center text-left gap-x-3 bg-neutral-900/50 hover:bg-neutral-900/20 w-full py-2 px-4 rounded-md">
    <div className="flex flex-col gap-y-1 overflow-hidden w-full">
      <p className="text-white text-lg whitespace-nowrap select-none truncate">
        {data.title}
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
  songIds: string[];
  setSongIds: (ids: string[]) => void;
}) => {
  const { filteredSongs, isSearching } = useSearchSong();

  return (
    <div
      className={twMerge(
        "w-full flex flex-col gap-2",
        isSearching && "opacity-50"
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
              data={song}
              isActive={isActive}
              onClick={() => {
                setSongIds(
                  isActive
                    ? songIds.filter((id) => id !== song.id)
                    : [...songIds, song.id]
                );
              }}
            />
          );
        })
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
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist name"
        maxLength={100}
        required
        aria-label="Enter the playlist name"
      />

      <div className="my-6 flex gap-2 items-center justify-between">
        <h3 className="text-lg font-semibold text-nowrap">
          Is this Playlist public?
        </h3>

        <input
          name="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          aria-label="Make playlist public"
          className="appearance-none size-5 border border-emerald-600 rounded-md checked:bg-emerald-500 checked:border-emerald-500 bg-neutral-700 transition-all cursor-pointer"
        />
      </div>

      <hr className="border-neutral-600 my-4" />

      <div className="mt-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Search, and Add songs</h3>

        <SearchInput />

        <SearchResults songIds={songIds} setSongIds={setSongIds} />
      </div>

      <hr className="border-neutral-600 my-4" />

      <Button
        onClick={onSubmit}
        disabled={name.trim() === "" || isSubmitting}
        className="w-full mt-4"
      >
        {isEditing && (isSubmitting ? "Updating..." : "Update playlist")}
        {!isEditing && (isSubmitting ? "Creating..." : "Create playlist")}
      </Button>
    </Modal>
  );
};

export default PlaylistModal;
