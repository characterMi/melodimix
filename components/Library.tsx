import type { Song } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import { getSongsByUserId } from "@/actions/getSongsByUserId";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import Loader from "./Loader";
import SongItem from "./SongItem";

function GetUserSongs() {
  const [songs, setSongs] = useState<Song[] | null>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSongsByUserId();

        data.length === 0 ? setSongs(null) : setSongs(data);
      } catch (error) {
        toast.error("Failed to fetch");
      }
    })();
  }, []);

  if (songs === null) {
    return <h1 className="text-neutral-400 text-xl m-4">No song here !</h1>;
  }

  if (songs.length === 0) {
    return <Loader className="m-auto mt-5" />;
  }

  return (
    <div className="flex flex-col gap-y-2 mt-4 px-3">
      {songs.map((song) => (
        <SongItem onClick={() => {}} key={song.id} data={song} />
      ))}
    </div>
  );
}

const Library = () => {
  const authModal = useAuthModal();

  const uploadModal = useUploadModal();

  const { user } = useUser();

  const handleClick = () => {
    if (!user) return authModal.onOpen();

    return uploadModal.onOpen();
  };

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

      <GetUserSongs />
    </div>
  );
};
export default Library;
