import { updatePlaylist } from "@/actions/updatePlaylist";
import { onError } from "@/lib/onError";
import { useAuthModal } from "@/store/useAuthModal";
import { usePlaylistModal } from "@/store/usePlaylistModal";
import { Playlist } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import { MdArrowOutward } from "react-icons/md";
import DropdownMenu from "./DropdownMenu";
import Loader from "./Loader";

const PlaylistItem = ({
  playlist,
  songId,
}: {
  playlist: Playlist;
  songId: number;
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    if (isAdding) return;

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

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
      is_public: playlist.is_public,
    });

    if (error) {
      onError();
    } else {
      toast.success(`Song added to the "${playlist.name}" playlist.`);
    }

    setIsAdding(false);
  };

  return (
    <DropdownMenu.Item
      className="cursor-pointer hover:opacity-50 focus-visible:opacity-50 opacity-80 outline-none transition-opacity w-full flex items-center justify-between disabled:opacity-25 text-sm font-thin"
      disabled={isAdding}
      onClick={handleClick}
    >
      <p className="truncate flex-1">{playlist.name}</p>

      <MdArrowOutward size={20} aria-hidden />
    </DropdownMenu.Item>
  );
};

const Playlists = ({ songId }: { songId: number }) => {
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
    <div className="flex flex-col gap-y-2 flex-1 w-full pt-2">
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

const CreatePlaylist = () => {
  const { session, isLoading } = useSessionContext();
  const onAuthModalOpen = useAuthModal((state) => state.onOpen);
  const openModal = usePlaylistModal((state) => state.onOpen);

  const onOpen = () => {
    if (isLoading) return;

    if (!session) {
      onAuthModalOpen();
      return;
    }

    openModal();
  };

  return (
    <DropdownMenu.Item
      className="text-white cursor-pointer hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition"
      aria-label="Create a new playlist"
      onClick={onOpen}
    >
      <AiOutlinePlus size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

const AddToPlaylist = ({ songId }: { songId: number }) => (
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger className="cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity">
      Add to playlist
    </DropdownMenu.SubTrigger>

    <DropdownMenu.SubContent className="w-[180px] h-[160px] mx-2">
      <DropdownMenu.Group className="flex items-center justify-between gap-x-2">
        <DropdownMenu.Label className="font-bold text-sm">
          Playlists
        </DropdownMenu.Label>

        <CreatePlaylist />
      </DropdownMenu.Group>
      <DropdownMenu.Separator className="mt-2 mb-1" />

      <DropdownMenu.Group className="flex flex-1 overflow-y-auto flex-col items-center justify-center p-0">
        <Playlists songId={songId} />
      </DropdownMenu.Group>
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
);

export default AddToPlaylist;
