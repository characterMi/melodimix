import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Loader from "./Loader";
import { usePlaylistModal } from "@/store/usePlaylistModal";
import { RiPlayListFill } from "react-icons/ri";
import { MdArrowOutward } from "react-icons/md";
import { updatePlaylist } from "@/actions/updatePlaylist";
import { Playlist } from "@/types";
import toast from "react-hot-toast";

const PlaylistItem = ({
  playlist,
  songId,
}: {
  playlist: Playlist;
  songId: string;
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);

    const { error } = await updatePlaylist({
      id: playlist.id,
      name: playlist.name,
      user_id: playlist.user_id,
      song_ids: [...playlist.song_ids, songId],
    });

    if (error) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Song added to playlist.");
    }

    setIsAdding(false);
  };

  return (
    <DropdownMenu.Item
      className="cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition w-full flex items-center justify-between disabled:opacity-50"
      disabled={isAdding}
      onClick={handleClick}
    >
      <p className="truncate flex-1">{playlist.name}</p>

      <MdArrowOutward size={20} />
    </DropdownMenu.Item>
  );
};

const Playlists = ({ songId }: { songId: string }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    session,
    supabaseClient,
    isLoading: isUserLoading,
  } = useSessionContext();

  useEffect(() => {
    if (!session) {
      if (!isUserLoading) setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("playlists")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.log(error);
      } else {
        setPlaylists(data);
      }

      setLoading(false);
    })();
  }, [session, isUserLoading]);

  if (loading) return <Loader className="min-w-8" />;

  return playlists.length > 0 ? (
    <div className="flex flex-col gap-y-4 flex-1 w-full p-2">
      {playlists.map((playlist) => (
        <PlaylistItem playlist={playlist} songId={songId} key={playlist.id} />
      ))}
    </div>
  ) : (
    <p className="text-neutral-400 text-sm">
      No playlists found.
      {!session && " Login to create one."}
    </p>
  );
};

const AddToPlaylist = ({ songId }: { songId: string }) => {
  const openModal = usePlaylistModal((state) => state.onOpen);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Add to playlist"
        className="cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition"
      >
        <RiPlayListFill size={24} aria-hidden />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-neutral-900 border border-neutral-700 py-2 px-3 rounded-lg shadow-2xl w-[260px] h-[220px] mb-4 flex flex-col z-[2]">
        <div className="flex items-center justify-between gap-x-2">
          <DropdownMenu.Label className="font-bold text-xl">
            Playlists
          </DropdownMenu.Label>

          <DropdownMenu.Item
            className="text-white cursor-pointer hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition"
            aria-label="Create a new playlist"
            onClick={openModal}
          >
            <AiOutlinePlus size={20} aria-hidden />
          </DropdownMenu.Item>
        </div>
        <DropdownMenu.Separator className="h-[1px] bg-neutral-800 my-2" />

        <div className="flex flex-1 overflow-y-auto flex-col items-center justify-center">
          <Playlists songId={songId} />
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddToPlaylist;
