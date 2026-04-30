import Image from "next/image";
import Link from "next/link";

import { useLoadPlaylistPoster } from "@/hooks/useLoadPlaylistPoster";

import FlipArrow from "@/components/FlipArrow";

import type { Playlist } from "@/types";

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  const poster = useLoadPlaylistPoster(playlist);

  return (
    <Link
      scroll={false}
      href={`/users/${playlist.user_id}/playlists/${playlist.id}`}
      className="flex items-center text-left gap-3 cursor-pointer hover:bg-neutral-800/50 focus-visible:bg-neutral-800/50 outline-none w-full p-2 rounded-md group"
    >
      <div className="rounded-md min-w-12 size-12 relative before:absolute before:-top-[3px] before:left-1/2 before:-translate-x-1/2 before:bg-neutral-800 before:rounded-[4px] before:w-10/12 before:h-full after:absolute after:inset-0 after:bg-neutral-950 after:rounded-md">
        <Image
          src={poster ?? "/images/playlist.png"}
          alt={playlist.name}
          width={100}
          height={100}
          className="object-cover size-12 rounded-md relative z-[1]"
        />
      </div>

      <div className="flex items-center justify-between overflow-hidden w-full gap-2">
        <div className="flex-1 overflow-hidden">
          <p className="text-white whitespace-nowrap select-none truncate">
            {playlist.name}
          </p>

          <p className="text-neutral-400 text-sm font-thin truncate">
            {playlist.song_ids.length <= 0
              ? "No song in this playlist"
              : playlist.song_ids.length === 1
              ? "1 Song"
              : playlist.song_ids.length + " Songs"}
          </p>
        </div>

        <FlipArrow hidden size={28} />
      </div>
    </Link>
  );
};

export default PlaylistCard;
