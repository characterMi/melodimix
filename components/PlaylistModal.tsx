import Input from "./Input";
import Modal from "./Modal";
import { usePlaylistModal } from "@/store/usePlaylistModal";
import SearchInput from "./SearchInput";
import { useSearchSong } from "@/hooks/useSearchSong";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import type { Song } from "@/types";
import { TbMinus, TbPlus } from "react-icons/tb";
import Button from "./Button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { revalidatePath } from "@/actions/revalidatePath";

const SongCard = ({
  data,
  isActive,
  onClick,
}: {
  data: Song;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div className="flex items-center text-left gap-x-3 bg-neutral-900/50 hover:bg-neutral-900/20 w-full p-2 rounded-md">
    <div className="flex flex-col gap-y-1 overflow-hidden w-full">
      <p className="text-white text-lg whitespace-nowrap select-none truncate">
        {data.title}
      </p>

      <p className="text-neutral-400 text-sm truncate">{data.author}</p>
    </div>

    <button
      className="cursor-pointer size-6 bg-gradient-to-b from-emerald-700 to-emerald-800 border border-emerald-600 rounded-sm flex items-center justify-center hover:opacity-75 focus-visible:opacity-75 outline-none transition"
      onClick={onClick}
      aria-label={
        isActive
          ? `Remove ${data.title} from playlist`
          : `Add ${data.title} to playlist`
      }
    >
      {isActive ? <TbMinus size={18} /> : <TbPlus size={18} />}
    </button>
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
  const { isOpen, onClose } = usePlaylistModal();
  const [name, setName] = useState("");
  const [songIds, setSongIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { session, supabaseClient } = useSessionContext();

  const onSubmit = async () => {
    if (name.trim() === "") {
      toast.error("Playlist name is required!");
      return;
    }

    if (!session?.user) {
      toast.error("Unauthenticated User.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabaseClient.from("playlists").insert({
      name,
      user_id: session.user.id,
      song_ids: songIds,
    });

    if (error) {
      toast.error("Something went wrong while creating the playlist!");
      return;
    }

    toast.success("Playlist created!");

    onClose();
    setIsSubmitting(false);
    setName("");
    setSongIds([]);
    revalidatePath("/profile");
  };

  return (
    <Modal
      title="Add a playlist"
      description="Create a new playlist."
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
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
        {isSubmitting ? "Creating..." : "Create playlist"}
      </Button>
    </Modal>
  );
};

export default PlaylistModal;
