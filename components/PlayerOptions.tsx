import { handleShare } from "@/lib/shareSong";
import type { Song } from "@/types";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { TbMusicShare } from "react-icons/tb";
import AddToPlaylist from "./AddToPlaylist";
import DropdownMenu from "./DropdownMenu";

const PlayerOptions = ({ song, songUrl }: { song: Song; songUrl: string }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(songUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to download: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.title} - ${song.artist}`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        "Couldn't download the song! checkout browser console for more information."
      );
      console.error(error);
    }
  };

  return (
    <DropdownMenu
      triggerProps={{
        element: <BiDotsVerticalRounded size={24} aria-hidden />,
        className:
          "cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition",
      }}
      contentProps={{
        className: "w-[200px] gap-3 mb-4",
      }}
    >
      <DropdownMenu.Item
        className="font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity flex items-center justify-between"
        onClick={handleDownload}
      >
        Download
        <HiOutlineDownload size={18} aria-hidden />
      </DropdownMenu.Item>

      <DropdownMenu.Item
        className="font-thin text-sm cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity flex items-center justify-between"
        onClick={() => handleShare(song.title, song.artist)}
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
