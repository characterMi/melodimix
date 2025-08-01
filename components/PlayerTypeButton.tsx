import type { PlayerType } from "@/store/usePlayerStore";
import type { IconType } from "react-icons";

const PlayerTypeButton = ({
  icon: Icon,
  playerType,
  handleChangePlayerType,
}: {
  icon: IconType;
  playerType: PlayerType;
  handleChangePlayerType: () => void;
}) => (
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
    <Icon size={30} aria-hidden />
  </button>
);

export default PlayerTypeButton;
