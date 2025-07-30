import { useLoadImage } from "@/hooks/useLoadImage";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import { twMerge } from "tailwind-merge";
import Author from "./Author";
import SongCover from "./SongCover";

interface SongTitleProps {
  id: string;
  title: string;
  isPlayer?: boolean;
  shouldRunAnimationIfCurrentlyPlaying?: boolean;
}

const SongTitle = ({
  id,
  title,
  isPlayer,
  shouldRunAnimationIfCurrentlyPlaying,
}: SongTitleProps) => {
  const currentlyPlayingSongId = usePlayerStore(
    (state) => state.currentlyPlayingSongId
  );

  return (
    <>
      {shouldRunAnimationIfCurrentlyPlaying &&
        currentlyPlayingSongId === id && (
          <div aria-hidden className="flex gap-[2px] mr-1">
            <span
              className="w-1.5 h-4 bg-green-500 rounded-sm animate-grow origin-bottom"
              style={{ animationDelay: "300ms" }}
            />
            <span
              className="w-1.5 h-4 bg-green-500 rounded-sm animate-grow origin-bottom"
              style={{ animationDelay: "600ms" }}
            />
            <span
              className="w-1.5 h-4 bg-green-500 rounded-sm animate-grow origin-bottom"
              style={{ animationDelay: "0ms" }}
            />
          </div>
        )}

      <p
        className={twMerge(
          "text-white whitespace-nowrap select-none",
          isPlayer ? "scroll-animation w-full child_1" : "truncate",
          shouldRunAnimationIfCurrentlyPlaying &&
            currentlyPlayingSongId === id &&
            "text-green-500"
        )}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </>
  );
};

interface SongItemProps {
  data: Song;
  onClick?: (id: string) => void;
  isPlayer?: boolean;
  showAuthor?: boolean;
  shouldRunAnimationIfCurrentlyPlaying?: boolean;
}

const SongItem = ({
  data,
  onClick,
  isPlayer = false,
  showAuthor = true,
  shouldRunAnimationIfCurrentlyPlaying = true,
}: SongItemProps) => {
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
      tabIndex={!!onClick ? 0 : -1}
    >
      <div className="relative rounded-md min-w-12 h-12 overflow-hidden bg-neutral-950">
        <SongCover
          src={imageUrl || "/images/liked.png"}
          alt={data.title}
          width={50}
          height={50}
        />
      </div>

      <div className="flex flex-col gap-1 overflow-hidden w-full">
        <div
          className={twMerge(
            "flex items-center shrink-0 text-lg scroll-animation__container",
            isPlayer && "w-[200%]"
          )}
        >
          <SongTitle
            id={data.id}
            title={
              (showAuthor
                ? `${data.title} - ${data.artist ?? "Unknown artist"}`
                : data.title) + "&nbsp;"
            }
            isPlayer={isPlayer}
            shouldRunAnimationIfCurrentlyPlaying={
              shouldRunAnimationIfCurrentlyPlaying
            }
          />

          {isPlayer && (
            <p
              className="text-white whitespace-nowrap select-none w-full scroll-animation child_2"
              aria-hidden
            >
              {data.title} &nbsp;
            </p>
          )}
        </div>

        <div className="text-neutral-400 text-sm truncate">
          {showAuthor ? (
            <Author name={data.author} userId={data.user_id} />
          ) : (
            data.artist ?? "Unknown artist"
          )}
        </div>
      </div>
    </button>
  );
};

export default SongItem;
