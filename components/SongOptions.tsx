import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { shareSong } from "@/lib/share";
import type { Song } from "@/types";
import { HiOutlineDownload } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { RxDotsVertical } from "react-icons/rx";
import { TbMusicShare } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import AddToPlaylist from "./AddToPlaylist";
import DropdownMenu from "./DropdownMenu";

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
        className: "w-[200px] gap-3 mb-4",
      }}
    >
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

      <DropdownMenu.Item
        className={twMerge(
          "font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none flex items-center justify-between",
          !shouldReduceMotion && "transition-opacity"
        )}
        onClick={handleDelete}
      >
        Delete the song
        <LuTrash2 size={18} aria-hidden />
      </DropdownMenu.Item>

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
};

export default SongOptions;
