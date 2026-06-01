import { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { RxDotsVertical } from "react-icons/rx";
import { TbMusicShare } from "react-icons/tb";
import { TiUserAddOutline } from "react-icons/ti";

import { useSessionStore } from "@/features/auth/store/useSessionStore";
import { addSongToInterests } from "@/features/interests/actions";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { deleteSong } from "@/features/song-related/actions";
import { isAdmin } from "@/lib/isAdmin";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shareSong } from "@/lib/share";

import AddToPlaylist from "@/features/playlist/components/AddToPlaylist";
import DropdownMenu from "../../../components/DropdownMenu";

const SongOptions = ({
  song,
  songUrl,
  triggerSize = 24,
  triggerClasses,
  renderShareButton = true,
}: {
  song: Song;
  songUrl: string;
  triggerSize?: number;
  triggerClasses?: string;
  renderShareButton?: boolean;
}) => (
  <DropdownMenu
    triggerProps={{
      element: <RxDotsVertical size={triggerSize} aria-hidden />,
      label: "Options...",
      className: cnWithReduceMotion(
        "cursor-pointer hover:opacity-50 transition-opacity focus-visible:opacity-50 outline-none",
        triggerClasses,
      ),
    }}
    contentProps={{
      className: "w-[200px] gap-4 mb-4",
    }}
  >
    <SaveToDownloads songUrl={songUrl} song={song} />

    <DeleteSongFromCache songUrl={songUrl} />

    <AddToInterests songId={song.id} />

    {renderShareButton && (
      <DropdownMenu.Item
        className={cnWithReduceMotion(
          "font-thin text-sm cursor-pointer transition-opacity hover:opacity-50 focus-visible:opacity-50 outline-none flex xss:hidden sm:flex items-center justify-between",
        )}
        onClick={() => shareSong(song.title, song.artist, song.id)}
      >
        Share
        <TbMusicShare size={18} aria-hidden />
      </DropdownMenu.Item>
    )}

    <DeleteSongFromDB songId={song.id} />

    <DropdownMenu.Separator />

    <AddToPlaylist songId={song.id} />
  </DropdownMenu>
);

const SaveToDownloads = ({
  songUrl,
  song,
}: {
  songUrl: string;
  song: Song;
}) => {
  const handleDownload = async () => {
    const cache = await caches.open("songs");
    const cachedResponse = await cache.match(songUrl);

    if (!cachedResponse) {
      onError("You need to download the song, in order to save it.");
      return;
    }

    const response = cachedResponse.clone();
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${song.title} - ${song.artist}`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu.Item
      className={cnWithReduceMotion(
        "font-thin text-sm cursor-pointer transition-opacity hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
      )}
      onClick={handleDownload}
    >
      Save to Downloads
      <HiOutlineDownload size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

const DeleteSongFromCache = ({ songUrl }: { songUrl: string }) => {
  const handleDelete = async () => {
    const cache = await caches.open("songs");
    const cachedResponse = await cache.match(songUrl);

    if (!cachedResponse) {
      onError("Song not found in the cache.");
      return;
    }

    const result = await cache.delete(songUrl);

    if (result) {
      onSuccess("Song deleted from the cache.");
    } else {
      onError("Couldn't delete the song.");
    }
  };

  return (
    <DropdownMenu.Item
      className={cnWithReduceMotion(
        "font-thin text-sm cursor-pointer transition-opacity hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
      )}
      onClick={handleDelete}
    >
      Delete from cache
      <LuTrash2 size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

const AddToInterests = ({ songId }: { songId: number }) => {
  const session = useSessionStore((state) => state.session);

  const onClick = async () => {
    if (!navigator.onLine) {
      onError("You're currently offline.");
      return;
    }

    if (!session) {
      onError("Unauthenticated user.");
      return;
    }

    const { error } = await addSongToInterests(songId);

    if (error) {
      onError(error);
      return;
    }

    onSuccess("Song added to interests.");
  };

  return (
    <DropdownMenu.Item
      className={cnWithReduceMotion(
        "font-thin text-sm cursor-pointer transition-opacity hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
      )}
      onClick={onClick}
    >
      Add to Interests
      <TiUserAddOutline size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

const DeleteSongFromDB = ({ songId }: { songId: number }) => {
  const user = useSessionStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return;

  if (!isAdmin(user)) return;

  const onClick = async () => {
    if (isDeleting || !user || !isAdmin(user)) return;

    setIsDeleting(true);
    const hasDeleted = await deleteSong(songId, true);

    if (hasDeleted) {
      onSuccess("Song deleted successfully!");
    } else {
      onError("Couldn't delete the song.");
    }

    setIsDeleting(false);
  };

  return (
    <DropdownMenu.Item
      className={cnWithReduceMotion(
        "font-thin !text-rose-500 text-sm transition-opacity cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between disabled:opacity-50",
      )}
      onClick={onClick}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete this song!"}
      <LuTrash2 size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

export default SongOptions;
