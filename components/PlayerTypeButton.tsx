import { BiArrowToRight } from "react-icons/bi";
import { IoShuffleOutline } from "react-icons/io5";
import { PiRepeatOnce } from "react-icons/pi";

import { usePlayerStore, type PlayerType } from "@/store/usePlayerStore";

const PlayerTypeButton = ({ playerType }: { playerType: PlayerType }) => {
  const handleChangePlayerType = usePlayerStore((state) => state.setPlayerType);

  const PlayerTypeIcon =
    playerType === "next-song"
      ? BiArrowToRight
      : playerType === "shuffle"
      ? IoShuffleOutline
      : PiRepeatOnce;

  return (
    <button
      aria-label={
        "Change the mode to " +
        (playerType === "next-song"
          ? "Shuffle"
          : playerType === "shuffle"
          ? "Repeat"
          : "Next song")
      }
      className="cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity"
      onClick={handleChangePlayerType}
    >
      <PlayerTypeIcon size={30} aria-hidden />
    </button>
  );
};

export default PlayerTypeButton;
