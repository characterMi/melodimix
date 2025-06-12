import { deleteSong } from "@/actions/deleteSong";
import DropdownMenu from "@/components/DropdownMenu";
import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";
import { useEditUploadedSongModal } from "@/store/useEditUploadedSongModal";
import type { Song } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

const Options = ({ song }: { song: Song }) => {
  return (
    <DropdownMenu
      triggerProps={{
        element: <BiDotsVerticalRounded size={20} aria-hidden />,
        className:
          "hover:opacity-75 focus-visible:opacity-75 outline-none transition-opacity",
        label: `Open options for ${song.title} song`,
      }}
      contentProps={{
        className: "w-[160px] gap-4",
      }}
    >
      <UpdateButton title={song.title} author={song.author} />

      <DeleteButton songId={song.id} />
    </DropdownMenu>
  );
};

const UpdateButton = ({ title, author }: { title: string; author: string }) => {
  const openModal = useEditUploadedSongModal((state) => state.onOpen);

  return (
    <DropdownMenu.Item className="text-white cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition-opacity">
      <VariantButton
        variant="secondary"
        className="w-full py-4 text-sm gap-1"
        tabIndex={-1}
        onClick={() => {
          openModal({ title, author });
        }}
      >
        Edit song <MdOutlineEdit size={16} />
      </VariantButton>
    </DropdownMenu.Item>
  );
};

const DeleteButton = ({ songId }: { songId: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isDeleting) return;

    try {
      setIsDeleting(true);

      const isDeleted = await deleteSong(songId);

      if (!isDeleted) {
        toast.error("Something went wrong.");
      } else {
        toast.success("Song deleted.");
      }
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu.Item
      className="text-white cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDeleting}
    >
      <VariantButton
        variant="error"
        className="w-full py-4 text-sm gap-1"
        tabIndex={-1}
        onClick={handleDelete}
      >
        Delete song{" "}
        {isDeleting ? <Spinner size="small" /> : <FiTrash2 size={16} />}
      </VariantButton>
    </DropdownMenu.Item>
  );
};

export default Options;
