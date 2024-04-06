import type { Song } from "@/types/types";
import Image from "next/image";
import { useLoadImage } from "@/hooks/useLoadImage";

interface Props {
  data: Song;
  onClick?: (id: string) => void;
}

const SongItem = ({ data, onClick }: Props) => {
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-w-12 h-12 overflow-hidden">
        <Image
          src={imageUrl || "/images/liked.png"}
          alt={data.title}
          width={50}
          height={50}
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col gap-y-1 overflow-hidden">
        <h1 className="text-white text-lg truncate">{data.title}</h1>
        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
      </div>
    </div>
  );
};
export default SongItem;
