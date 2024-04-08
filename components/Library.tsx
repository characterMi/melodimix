"use client";

import type { Song } from "@/types/types";
import { useRouter } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import { RxReload } from "react-icons/rx";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import SongItem from "./SongItem";
import useOnPlay from "@/hooks/useOnPlay";

const Library = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const router = useRouter();

  const authModal = useAuthModal();

  const uploadModal = useUploadModal();

  const { user } = useUser();

  const handleClick = () => {
    if (!user) return authModal.onOpen();

    return uploadModal.onOpen();
  };

  if (songs.length === 0) {
    return (
      <div className="flex gap-x-2 items-center text-neutral-400 m-4">
        <h1 className="flex flex-col gap-y-2">No song here !</h1>
        <button
          className="flex items-center gap-x-1 underline"
          onClick={() => router.refresh()}
        >
          Refresh
          <RxReload />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />

          <p className="text-neutral-400 font-medium text-sm">Your Library</p>
        </div>

        <AiOutlinePlus
          onClick={handleClick}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>

      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((song) => (
          <SongItem onClick={(id) => onPlay(id)} key={song.id} data={song} />
        ))}
      </div>
    </div>
  );
};
export default Library;
