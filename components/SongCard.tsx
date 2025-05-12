import { useLoadImage } from "@/hooks/useLoadImage";
import type { Song } from "@/types/types";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaPlay, FaShareAlt } from "react-icons/fa";

interface Props {
  data: Song;
  onClick: (id: string) => void;
}

const SongCard = ({ data, onClick }: Props) => {
  const imagePath = useLoadImage(data);

  function handleShare(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();

    if (!navigator.share) {
      toast.error("Share not supported on your browser");
      return;
    }

    navigator.share({
      title: `Melodimix | ${data.title}`,
      text: "Melodimix - Your Ultimate Music Destination.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}search?song_title=${data.title}`,
    });
  }

  return (
    <button
      onClick={() => onClick(data.id)}
      className="relative group flex flex-col text-left rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
      aria-label={"Play the " + data.title + " song"}
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={imagePath || "/images/liked.png"}
          alt={data.title + " poster"}
          width={130}
          height={130}
        />
      </div>

      <div className="flex flex-col items-start w-full py-4 gap-y-1">
        <h1 className="font-semibold truncate w-full">{data.title}</h1>
        <p className="text-neutral-400 text-sm pt-1 w-full truncate">
          By {data.author}
        </p>
      </div>

      <div className="absolute bottom-24 right-5">
        <div
          className="opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md delay-75 transition translate-y-2/4 group-hover:opacity-100 group-hover:-translate-y-2/4 hover:scale-105"
          aria-label="Share the song"
          onClick={handleShare}
        >
          <FaShareAlt className="text-black" />
        </div>

        <div
          className="opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md transition translate-y-1/4 group-hover:opacity-100 group-hover:-translate-y-1/4 hover:scale-105"
          aria-hidden
        >
          <FaPlay className="text-black" />
        </div>
      </div>
    </button>
  );
};
export default SongCard;
