import { handleShare } from "@/lib/shareSong";
import type { Song } from "@/types";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { TbMusicShare } from "react-icons/tb";
import AddToPlaylist from "./AddToPlaylist";
import DropdownMenu from "./DropdownMenu";

const PlayerOptions = ({
  song,
  songUrl,
  triggerEl,
}: {
  song: Song;
  songUrl: string;
  triggerEl?: React.ReactNode;
}) => {
  const handleDownload = async () => {
    const cache = await caches.open("songs");
    const cachedResponse = await cache.match(songUrl);

    if (!cachedResponse) {
      toast.error("You need to download the song, in order to save it.");
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
    <DropdownMenu
      triggerProps={{
        element: triggerEl ?? <BiDotsVerticalRounded size={24} aria-hidden />,
        label: "Options...",
        className:
          "cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition",
      }}
      contentProps={{
        className: "w-[200px] gap-3 mb-4",
      }}
    >
      <DropdownMenu.Item
        className="font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity flex items-center justify-between"
        onClick={handleDownload}
      >
        Save to Downloads
        <HiOutlineDownload size={18} aria-hidden />
      </DropdownMenu.Item>

      <DropdownMenu.Item
        className="font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity flex items-center justify-between"
        onClick={() => handleShare(song.title, song.artist, song.id)}
      >
        Share
        <TbMusicShare size={18} aria-hidden />
      </DropdownMenu.Item>

      <DropdownMenu.Separator />

      <AddToPlaylist songId={song.id} />
    </DropdownMenu>
  );
};

export default PlayerOptions;
