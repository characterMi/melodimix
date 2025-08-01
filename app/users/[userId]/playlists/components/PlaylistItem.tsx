import type { Playlist } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

const PlaylistItem = ({
  playlist,
  firstSongId,
}: {
  playlist: Playlist;
  firstSongId: string;
}) => {
  const hasFetched = useRef(false);
  const [playlistThumbnail, setPlaylistThumbnail] = useState("");

  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (hasFetched.current) return;

    (async () => {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("img_path")
        .eq("id", firstSongId)
        .single();

      if (!error && data) {
        const imagePath = supabaseClient.storage
          .from("images")
          .getPublicUrl(data.img_path);

        setPlaylistThumbnail(imagePath.data.publicUrl);
      } else {
        setPlaylistThumbnail("/images/playlist.png");
      }

      hasFetched.current = true;
    })();
  }, []);

  return (
    <Link
      href={`/users/${playlist.user_id}/playlists/${playlist.id}`}
      className="flex items-center text-left gap-3 cursor-pointer hover:bg-neutral-800/50 focus-visible:bg-neutral-800/50 outline-none w-full p-2 rounded-md group"
    >
      <div className="rounded-md min-w-16 size-16 relative before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:bg-neutral-800 before:rounded-[4px] before:w-10/12 before:h-full after:absolute after:inset-0 after:bg-neutral-950 after:rounded-md">
        {playlistThumbnail && (
          <Image
            src={playlistThumbnail}
            alt={playlist.name}
            width={100}
            height={100}
            className="object-cover size-16 rounded-md relative z-[1]"
          />
        )}
      </div>

      <div className="flex items-center justify-between overflow-hidden w-full gap-2">
        <div className="flex-1 overflow-hidden">
          <p className="text-white whitespace-nowrap select-none truncate text-xl">
            {playlist.name}
          </p>

          <p className="text-neutral-400 text-sm truncate">
            {playlist.song_ids.length <= 0
              ? "No song in this playlist"
              : playlist.song_ids.length === 1
              ? "1 Song"
              : playlist.song_ids.length + " Songs"}
          </p>
        </div>

        <div className="text-white h-[28px] overflow-hidden relative">
          <MdArrowOutward
            size={28}
            aria-hidden
            className="group-hover:-translate-y-full group-focus-visible:-translate-y-full transition-transform"
          />
          <MdArrowOutward
            size={28}
            aria-hidden
            className="absolute top-0 left-0 translate-y-full w-full h-full group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
};

export default PlaylistItem;
