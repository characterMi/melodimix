import { BiArrowToRight } from "react-icons/bi";
import { IoShuffleOutline } from "react-icons/io5";
import { PiRepeatOnce } from "react-icons/pi";

import {
  usePlayerStore,
  type PlayerType,
} from "@/features/player/store/usePlayerStore";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

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
      className={cnWithReduceMotion(
        "cursor-pointer hover:opacity-50 transition-opacity focus-visible:opacity-50 outline-none",
      )}
      onClick={handleChangePlayerType}
    >
      <PlayerTypeIcon size={30} aria-hidden />
    </button>
  );
};

export default PlayerTypeButton;
