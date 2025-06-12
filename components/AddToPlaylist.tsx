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
import DropdownMenu from "./DropdownMenu";

const PlaylistItem = ({
  playlist,
  songId,
}: {
  playlist: Playlist;
  songId: string;
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    if (isAdding) return;

    if (playlist.song_ids.includes(songId)) {
      toast(`The song already exists in "${playlist.name}" playlist.`);
      return;
    }

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

      <MdArrowOutward size={20} aria-hidden />
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
    <DropdownMenu
      triggerProps={{
        element: <RiPlayListFill size={24} aria-hidden />,
        className:
          "cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition",
      }}
      contentProps={{
        className: "w-[260px] h-[220px] mb-4",
      }}
    >
      <DropdownMenu.Group className="flex items-center justify-between gap-x-2">
        <DropdownMenu.Label className="font-bold text-xl">
          Playlists
        </DropdownMenu.Label>

        <DropdownMenu.Item
          className="text-white cursor-pointer hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition"
          aria-label="Create a new playlist"
          onClick={() => openModal()}
        >
          <AiOutlinePlus size={20} aria-hidden />
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator className="h-[2px] bg-neutral-800 mt-4 mb-1" />

      <DropdownMenu.Group className="flex flex-1 overflow-y-auto flex-col items-center justify-center pt-5">
        <Playlists songId={songId} />
      </DropdownMenu.Group>
    </DropdownMenu>
  );
};

export default AddToPlaylist;
