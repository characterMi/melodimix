import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { usePlaylistModal } from "@/features/playlist/store/usePlaylistModal";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

type Props = {
  href: string;
  name: string;
  id: "liked" | "uploaded" | "interests" | number;
} & Partial<Omit<Playlist, "name" | "id">>;

const PlaylistLink = ({ href, name, id, ...props }: Props) => {
  const pathname = usePathname();
  const openPlaylistModal = usePlaylistModal((state) => state.onOpen);

  return (
    <Link
      scroll={false}
      draggable={false}
      href={href}
      key={href}
      className={cnWithReduceMotion(
        "text-white snap-start text-nowrap whitespace-nowrap relative group hover:text-emerald-300 focus-visible:text-emerald-300 outline-none pb-4 px-8",
        pathname === href && "border-b border-emerald-500 transition",
      )}
    >
      <h2 className="text-xl font-thin">{name}</h2>

      {/* Playlists are editable, except for "liked", "uploaded", and "interests" songs */}
      {id !== "liked" && id !== "uploaded" && id !== "interests" && (
        <button
          aria-label={`Open options for ${name} playlist`}
          className={cnWithReduceMotion(
            "absolute top-0 left-full transition -translate-x-2/3 opacity-0 hover:opacity-100 hover:text-emerald-300 hover:scale-105 group-hover:opacity-100 focus-visible:text-emerald-300 focus-visible:scale-105 focus-visible:opacity-100 group-focus-visible:opacity-100 outline-none",
            pathname === href ? "block" : "hidden",
          )}
          onClick={() =>
            openPlaylistModal({
              id,
              name,
              user_id: props.user_id!,
              song_ids: props.song_ids!,
              is_public: props.is_public!,
              created_at: props.created_at!,
              poster_path: props.poster_path!,
            })
          }
        >
          <BiDotsVerticalRounded size={20} aria-hidden />
        </button>
      )}
    </Link>
  );
};

export default PlaylistLink;
