import { useLoadImage } from "@/hooks/useLoadImage";
import type { Song } from "@/types/types";
import { twMerge } from "tailwind-merge";
import SongCover from "./SongCover";

interface Props {
  data: Song;
  onClick?: (id: string) => void;
  player?: boolean;
}

const SongItem = ({ data, onClick, player }: Props) => {
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    if (onClick) {
      onClick(data.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center text-left gap-x-3 cursor-pointer hover:bg-neutral-800/50 focus-visible:bg-neutral-800/50 outline-none w-full p-2 rounded-md"
      aria-label={"Play the " + data.title + " song"}
    >
      <div className="relative rounded-md min-w-12 h-12 overflow-hidden bg-neutral-950">
        <SongCover
          src={imageUrl || "/images/liked.png"}
          alt={data.title}
          width={50}
          height={50}
        />
      </div>

      <div className="flex flex-col gap-y-1 overflow-hidden w-full">
        <div
          className={twMerge(
            "flex items-center shrink-0 text-lg scroll-animation__container",
            player && "w-[200%]"
          )}
        >
          <p
            className={twMerge(
              "text-white whitespace-nowrap select-none",
              player ? "scroll-animation w-full child_1" : "truncate"
            )}
          >
            {data.title} &nbsp;
          </p>

          {player && (
            <p
              className="text-white whitespace-nowrap select-none w-full scroll-animation child_2"
              aria-hidden
            >
              {data.title} &nbsp;
            </p>
          )}
        </div>

        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
      </div>
    </button>
  );
};

export default SongItem;
