import type { IconType } from "react-icons";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const PlayerControls = ({
  isMobilePlayer,
  isSongLoading,
  onPlaySong,
  handlePlay,
  isSoundLoading,
  isMusicPlaying,
  icon: Icon,
}: {
  isMobilePlayer?: true;
  isSongLoading: boolean;
  onPlaySong: (type: "previous" | "next") => void;
  handlePlay: () => void;
  isMusicPlaying: boolean;
  isSoundLoading: boolean;
  icon: IconType;
}) => (
  <div
    className={twMerge(
      "z-[1] h-full flex justify-center sm:justify-end md:justify-center items-center w-full max-w-[722px] gap-4",
      !isMobilePlayer && "hidden sm:flex"
    )}
  >
    <button
      aria-label="Previous song"
      className="text-black sm:text-neutral-400 size-[32px] sm:size-[24px] p-2 sm:p-0 rounded-full bg-white sm:bg-transparent cursor-pointer hover:opacity-50 sm:hover:text-white focus-visible:opacity-50 sm:focus-visible:text-white outline-none transition"
      onClick={() => onPlaySong("previous")}
    >
      <FaBackwardStep className="w-full h-full" aria-hidden />
    </button>

    <button
      onClick={handlePlay}
      className="flex items-center justify-center size-14 sm:size-10 rounded-full bg-white p-1 cursor-pointer overflow-hidden relative hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity"
      aria-label={(isMusicPlaying ? "Pause" : "Play") + " the song"}
      aria-pressed={isMusicPlaying}
    >
      <Icon
        size={30}
        className={twMerge(
          "text-black transition-opacity",
          isSongLoading || isSoundLoading ? "opacity-0" : "opacity-100"
        )}
        aria-hidden
      />

      <div
        className={twMerge(
          "absolute size-6 rounded-full border-4 animate-spin border-black after:size-3 after:bg-white after:absolute after:bottom-3/4 after:rotate-45 transition-opacity",
          isSongLoading || isSoundLoading ? "opacity-100" : "opacity-0"
        )}
      >
        {(isSongLoading || isSoundLoading) && (
          <p className="sr-only">Loading the song...</p>
        )}
      </div>
    </button>

    <button
      onClick={() => onPlaySong("next")}
      className="text-black sm:text-neutral-400 size-[32px] sm:size-[24px] p-2 sm:p-0 rounded-full bg-white sm:bg-transparent cursor-pointer hover:opacity-50 sm:hover:text-white focus-visible:opacity-50 sm:focus-visible:text-white outline-none transition"
      aria-label="Next song"
    >
      <FaForwardStep className="w-full h-full" aria-hidden />
    </button>
  </div>
);

export default PlayerControls;
