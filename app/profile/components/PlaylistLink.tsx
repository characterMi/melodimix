import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import { deletePlaylist } from "@/actions/deletePlaylist";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { usePlaylistModal } from "@/store/usePlaylistModal";

import DropdownMenu from "@/components/DropdownMenu";
import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";

import type { Playlist } from "@/types";

type Props = {
  href: string;
  name: string;
  id: "liked" | "uploaded" | "interests" | number;
} & Partial<Pick<Playlist, "song_ids" | "user_id" | "is_public">>;

const PlaylistLink = ({ href, name, id, ...props }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      scroll={false}
      href={href}
      key={href}
      className={twMerge(
        "text-white snap-start text-nowrap whitespace-nowrap relative group hover:text-emerald-300 focus-visible:text-emerald-300 outline-none pb-4 px-8",
        pathname === href && "border-b border-emerald-500",
        !shouldReduceMotion && "transition"
      )}
    >
      <h2 className="text-xl font-thin">{name}</h2>

      {/* Playlists are editable, except for "liked", "uploaded", and "interests" songs */}
      {id !== "liked" && id !== "uploaded" && id !== "interests" && (
        <DropdownMenu
          triggerProps={{
            element: (
              <BiDotsVerticalRounded size={20} aria-label="Options..." />
            ),
            className: `absolute top-0 left-full -translate-x-2/3 opacity-0 hover:opacity-100 hover:text-emerald-300 hover:scale-105 group-hover:opacity-100 focus-visible:text-emerald-300 focus-visible:scale-105 focus-visible:opacity-100 group-focus-visible:opacity-100 outline-none ${
              pathname === href ? "block" : "hidden"
            } ${!shouldReduceMotion ? "transition" : ""}`,
            label: `Open options for ${name} playlist`,
          }}
          contentProps={{
            className: "w-[160px] gap-4",
          }}
        >
          <UpdateButton
            name={name}
            id={id}
            user_id={props.user_id!}
            song_ids={props.song_ids!}
            is_public={props.is_public!}
          />

          <DeleteButton playlistId={id} isPublic={props.is_public!} />
        </DropdownMenu>
      )}
    </Link>
  );
};

const UpdateButton = (
  props: Required<Omit<Props, "href" | "id"> & { id: number }>
) => {
  const openModal = usePlaylistModal((state) => state.onOpen);

  return (
    <DropdownMenu.Item
      className={twMerge(
        "text-white cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none",
        !shouldReduceMotion && "transition-opacity"
      )}
      onClick={() => openModal(props)}
    >
      <VariantButton
        variant="secondary"
        className="w-full py-4 text-sm gap-1"
        tabIndex={-1}
      >
        Edit playlist <MdOutlineEdit size={16} />
      </VariantButton>
    </DropdownMenu.Item>
  );
};

const DeleteButton = ({
  playlistId,
  isPublic,
}: {
  playlistId: number;
  isPublic: boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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

    const isDeleted = await deletePlaylist(playlistId, isPublic);

    if (!isDeleted) {
      onError();
    } else {
      onSuccess("Playlist deleted.");
    }

    router.replace("/profile");
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
        Delete playlist
        {isDeleting ? <Spinner size="small" /> : <FiTrash2 size={16} />}
      </VariantButton>
    </DropdownMenu.Item>
  );
};

export default PlaylistLink;
