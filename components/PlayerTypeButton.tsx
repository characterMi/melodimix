import { BiArrowToRight } from "react-icons/bi";
import { IoShuffleOutline } from "react-icons/io5";
import { PiRepeatOnce } from "react-icons/pi";

import { shouldReduceMotion } from "@/lib/reduceMotion";
import { usePlayerStore, type PlayerType } from "@/store/usePlayerStore";
import { twMerge } from "tailwind-merge";

const PlayerTypeButton = ({ playerType }: { playerType: PlayerType }) => {
  const handleChangePlayerType = usePlayerStore((state) => state.setPlayerType);

  const PlayerTypeIcon =
    playerType === "sequential"
      ? BiArrowToRight
      : playerType === "shuffle"
      ? IoShuffleOutline
      : PiRepeatOnce;

  return (
    <button
      aria-label={
        "Change the mode to " +
        (playerType === "sequential"
          ? "Shuffle"
          : playerType === "shuffle"
          ? "Repeat"
          : "Sequential")
      }
      className={twMerge(
        "cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none",
        !shouldReduceMotion && "transition-opacity"
      )}
      onClick={handleChangePlayerType}
    >
      <PlayerTypeIcon size={30} aria-hidden />
    </button>
  );
};

export default PlayerTypeButton;
