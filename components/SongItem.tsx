import type { Song } from "@/types/types";
import Image from "next/image";
import { useLoadImage } from "@/hooks/useLoadImage";

interface Props {
  data: Song;
  onClick?: (id: string) => void;
  player?: boolean;
}

const SongItem = ({ data, onClick, player }: Props) => {
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

      <div className="flex flex-col gap-y-1 overflow-hidden w-full">
        <div
          className={`flex items-center shrink-0 text-lg scroll-animation__container ${
            player && "w-[200%]"
          }`}
        >
          <h1
            className={`text-white whitespace-nowrap select-none truncate ${
              player && "scroll-animation w-full child_1"
            }`}
          >
            {data.title}
          </h1>

          {player && (
            <h1
              className="text-white whitespace-nowrap select-none truncate w-full scroll-animation child_2"
              aria-hidden="true"
            >
              {data.title}
            </h1>
          )}
        </div>

        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
      </div>
    </div>
  );
};
export default SongItem;
