import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";

type Props = {
  onPlaySong: (type: "next" | "previous") => void;
  handlePlay: () => void;
  isMusicLoading: boolean;
  isMusicPlaying: boolean;
};

const PlayerControls = ({
  onPlaySong,
  handlePlay,
  isMusicLoading,
  isMusicPlaying,
}: Props) => {
  const PauseOrPlayIcon = isMusicPlaying ? BsPauseFill : BsPlayFill;

  return (
    <>
      <div className="flex items-center gap-x-2 sm:hidden absolute -top-full -translate-y-1/4 right-0">
        <AiFillStepBackward
          onClick={() => onPlaySong("previous")}
          size={28}
          className="text-black p-1 rounded-full cursor-pointer bg-white"
        />

        <div
          onClick={handlePlay}
          className="size-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer overflow-hidden"
        >
          {isMusicLoading ? (
            <div className="size-6 rounded-full border-4 animate-spin border-black relative after:size-3 after:bg-white after:absolute after:bottom-3/4 after:rotate-45" />
          ) : (
            <PauseOrPlayIcon size={30} className="text-black" />
          )}
        </div>

        <AiFillStepForward
          onClick={() => onPlaySong("next")}
          size={28}
          className="text-black p-1 rounded-full cursor-pointer bg-white"
        />
      </div>

      <div className="hidden z-10 h-full sm:flex sm:justify-end md:justify-center items-center w-full max-w-[722px] gap-x-6">
        <AiFillStepBackward
          onClick={() => onPlaySong("previous")}
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />

        <div
          onClick={handlePlay}
          className="flex items-center justify-center size-10 rounded-full bg-white p-1 cursor-pointer overflow-hidden"
        >
          {isMusicLoading ? (
            <div className="size-6 rounded-full border-4 animate-spin border-black relative after:size-3 after:bg-white after:absolute after:bottom-3/4 after:rotate-45" />
          ) : (
            <PauseOrPlayIcon size={30} className="text-black" />
          )}
        </div>

        <AiFillStepForward
          onClick={() => onPlaySong("next")}
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
    </>
  );
};

export default PlayerControls;
