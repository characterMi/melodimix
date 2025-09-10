import { deleteSong } from "@/actions/deleteSong";
import DropdownMenu from "@/components/DropdownMenu";
import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useUploadModal } from "@/store/useUploadModal";
import { useUserSongs } from "@/store/useUserSongsStore";
import type { Song } from "@/types";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { twMerge } from "tailwind-merge";

const Options = ({ song }: { song: Song }) => {
  return (
    <DropdownMenu
      triggerProps={{
        element: <BiDotsVerticalRounded size={20} aria-label="Options..." />,
        className: `hover:opacity-50 focus-visible:opacity-50 outline-none ${
          !shouldReduceMotion ? "transition-opacity" : ""
        }`,
        label: `Open options for ${song.title} song`,
      }}
      contentProps={{
        className: "w-[160px] gap-4",
      }}
    >
      <UpdateButton song={song} />

      <DeleteButton songId={song.id} />
    </DropdownMenu>
  );
};

const UpdateButton = ({ song }: { song: Song }) => {
  const openModal = useUploadModal((state) => state.onOpen);

  return (
    <DropdownMenu.Item
      className={twMerge(
        "text-white cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none",
        !shouldReduceMotion && "transition-opacity"
      )}
      onClick={() => openModal(song)}
    >
      <VariantButton
        variant="secondary"
        className="w-full py-4 text-sm gap-1"
        tabIndex={-1}
      >
        Edit song <MdOutlineEdit size={16} />
      </VariantButton>
    </DropdownMenu.Item>
  );
};

const DeleteButton = ({ songId }: { songId: number }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteSongFromUserSongs = useUserSongs((state) => state.deleteSong);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isDeleting) return;

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

    setIsDeleting(true);

    const isDeleted = await deleteSong(songId);

    if (!isDeleted) {
      onError();
    } else {
      onSuccess("Song deleted.");
      deleteSongFromUserSongs(songId);
    }

    setIsDeleting(false);
  };

  return (
    <DropdownMenu.Item
      className={twMerge(
        "text-white cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        !shouldReduceMotion && "transition-opacity"
      )}
      disabled={isDeleting}
      onClick={handleDelete}
    >
      <VariantButton
        variant="error"
        className="w-full py-4 text-sm gap-1"
        tabIndex={-1}
      >
        Delete song{" "}
        {isDeleting ? <Spinner size="small" /> : <FiTrash2 size={16} />}
      </VariantButton>
    </DropdownMenu.Item>
  );
};

export default Options;
