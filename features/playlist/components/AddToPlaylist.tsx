import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import { MdArrowOutward } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthModal } from "@/features/auth/store/useAuthModal";
import { usePlaylistsPageData } from "@/features/infinite-scroll/store/usePlaylistsPageData";
import { updatePlaylist } from "@/features/playlist/actions";
import { usePlaylistModal } from "@/features/playlist/store/usePlaylistModal";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";

import DropdownMenu from "../../../components/DropdownMenu";
import Loader from "../../../components/Loader";

const PlaylistItem = ({
  playlist,
  songId,
}: {
  playlist: Playlist;
  songId: number;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const updatePlaylistStore = usePlaylistsPageData((state) => state.updateOne);

  const handleClick = async () => {
    if (isAdding) return;

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again.",
      );
      return;
    }

    if (playlist.song_ids.includes(songId)) {
      toast(`The song already exists in "${playlist.name}" playlist.`);
      return;
    }

    setIsAdding(true);

    const updatedPlaylist = {
      ...playlist,
      song_ids: [...playlist.song_ids, songId],
    };

    const { error } = await updatePlaylist(updatedPlaylist);

    if (error) {
      onError();
    } else {
      onSuccess(`Song added to the "${playlist.name}" playlist.`);
    }

    setIsAdding(false);
    updatePlaylistStore(updatedPlaylist);
  };

  return (
    <DropdownMenu.Item
      className={cnWithReduceMotion(
        "cursor-pointer hover:opacity-50 focus-visible:opacity-50 opacity-80 outline-none w-full flex items-center justify-between disabled:opacity-25 text-sm font-thin transition-opacity",
      )}
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

  const { session, supabaseClient, isLoading: isUserLoading } = useSession();

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

  return (
    <div
      className={cnWithReduceMotion(
        "flex flex-col gap-y-2 flex-1 w-full pt-2",
        (loading || playlists.length <= 0) && "justify-center items-center",
      )}
    >
      {loading && <Loader className="min-w-8" />}

      {!loading &&
        (playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistItem
              playlist={playlist}
              songId={songId}
              key={playlist.id}
            />
          ))
        ) : (
          <p className="text-neutral-400 text-sm">
            No playlists found.
            {!session && " Login to create one."}
          </p>
        ))}
    </div>
  );
};

const CreatePlaylist = () => {
  const { session, isLoading } = useSession();
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
      className={cnWithReduceMotion(
        "text-white cursor-pointer transition-colors hover:text-neutral-400 focus-visible:text-neutral-400 outline-none",
      )}
      aria-label="Create a new playlist"
      onClick={onOpen}
    >
      <AiOutlinePlus size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

const AddToPlaylist = ({ songId }: { songId: number }) => (
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger
      className={twMerge(
        "cursor-pointer hover:opacity-50 transition-opacity focus-visible:opacity-50 outline-none",
      )}
    >
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

      <DropdownMenu.Group className="flex flex-1 overflow-y-auto flex-col p-0">
        <Playlists songId={songId} />
      </DropdownMenu.Group>
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
);

export default AddToPlaylist;
