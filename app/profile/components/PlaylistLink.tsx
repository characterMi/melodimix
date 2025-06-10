import DropdownMenu from "@/components/DropdownMenu";
import VariantButton from "@/components/VariantButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useUpdatePlaylistModal } from "@/store/usePlaylistModal";
import type { Playlist } from "@/types";

type Props = { href: string; name: string; id: string } & Partial<
  Omit<Playlist, "id" | "name">
>;

const PlaylistLink = ({ href, name, id, ...props }: Props) => {
  const pathname = usePathname();
  const { openModal, setInitialData } = useUpdatePlaylistModal((state) => ({
    openModal: state.onOpen,
    setInitialData: state.setInitialData,
  }));

  return (
    <Link
      href={href}
      key={href}
      className={twMerge(
        "text-white snap-start text-nowrap relative group hover:text-emerald-300 focus-visible:text-emerald-300 outline-none transition-all pb-4 px-8",
        pathname === href && "border-b border-emerald-500"
      )}
    >
      <h2 className="text-xl font-thin">{name}</h2>

      {/* Playlists are editable, except for "liked" and "uploaded" songs */}
      {id !== "liked" && id !== "uploaded" && (
        <DropdownMenu
          triggerProps={{
            element: <BiDotsVerticalRounded size={20} aria-hidden />,
            className: `absolute top-0 left-full -translate-x-2/3 opacity-0 transition hover:opacity-100 hover:text-emerald-300 hover:scale-105 group-hover:opacity-100 focus-visible:text-emerald-300 focus-visible:scale-105 focus-visible:opacity-100 group-focus-visible:opacity-100 outline-none transition ${
              pathname === href ? "block" : "hidden"
            }`,
            label: `Open options for ${name} playlist`,
          }}
          contentProps={{
            className: "w-[160px] gap-4",
          }}
        >
          <DropdownMenu.Item
            className="text-white cursor-pointer hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition"
            aria-label={`Edit ${name} playlist`}
          >
            <VariantButton
              variant="secondary"
              className="w-full py-4 text-sm gap-1"
              tabIndex={-1}
              onClick={() => {
                setInitialData({
                  id,
                  name,
                  user_id: props.user_id!,
                  song_ids: props.song_ids!,
                });
                openModal();
              }}
            >
              Edit playlist <MdOutlineEdit size={16} />
            </VariantButton>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="text-white cursor-pointer hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition"
            aria-label={`Delete ${name} playlist`}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <VariantButton
              variant="error"
              className="w-full py-4 text-sm gap-1"
              tabIndex={-1}
            >
              Delete playlist <FiTrash2 size={16} />
            </VariantButton>
          </DropdownMenu.Item>
        </DropdownMenu>
      )}
    </Link>
  );
};

export default PlaylistLink;
