import { HiOutlineDownload } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { RxDotsVertical } from "react-icons/rx";
import { TbMusicShare } from "react-icons/tb";
import { TiUserAddOutline } from "react-icons/ti";
import { twMerge } from "tailwind-merge";

import { addSongToInterests } from "@/actions/interests.actions";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { shareSong } from "@/lib/share";
import { useSessionStore } from "@/store/useSessionStore";

import AddToPlaylist from "./AddToPlaylist";
import DropdownMenu from "./DropdownMenu";

import type { Song } from "@/types";

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
      className: twMerge(
        "cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none",
        !shouldReduceMotion && "transition-opacity",
        triggerClasses
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
        className={twMerge(
          "font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none flex xss:hidden sm:flex items-center justify-between",
          !shouldReduceMotion && "transition-opacity"
        )}
        onClick={() => shareSong(song.title, song.artist, song.id)}
      >
        Share
        <TbMusicShare size={18} aria-hidden />
      </DropdownMenu.Item>
    )}

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
      className={twMerge(
        "font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
        !shouldReduceMotion && "transition-opacity"
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
      className={twMerge(
        "font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
        !shouldReduceMotion && "transition-opacity"
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

    onSuccess("Song added to profile.");
  };

  return (
    <DropdownMenu.Item
      className={twMerge(
        "font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
        !shouldReduceMotion && "transition-opacity"
      )}
      onClick={onClick}
    >
      Add to Interests
      <TiUserAddOutline size={18} aria-hidden />
    </DropdownMenu.Item>
  );
};

export default SongOptions;
