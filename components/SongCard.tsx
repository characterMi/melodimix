import { useLoadImage } from "@/hooks/useLoadImage";
import type { Song } from "@/types/types";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

interface Props {
  data: Song;
  onClick: (id: string) => void;
}

const SongCard = ({ data, onClick }: Props) => {
  const imagePath = useLoadImage(data);
  return (
    <div
      onClick={() => onClick(data.id)}
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={imagePath || "/images/liked.png"}
          alt={data.title}
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
        <button
          className="opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md transition translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105"
          aria-label={`Play the ${data.title} song`}
        >
          <FaPlay className="text-black" />
        </button>
      </div>
    </div>
  );
};
export default SongCard;
