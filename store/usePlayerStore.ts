import toast from "react-hot-toast";
import { create } from "zustand";

export type PlayerType = "sequential" | "shuffle" | "repeat";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id?: string) => void;
  setIds: (ids: string[]) => void;
  currentlyPlayingSongId?: string;
  setCurrentlyPlayingSongId: (id?: string) => void;
  playerType: PlayerType;
  setPlayerType: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMobilePlayerOpen: boolean;
  setIsMobilePlayerOpen: (isOpen: boolean) => void;
}

const initialPlayerType = (() => {
  if (typeof localStorage === "undefined") return "sequential";

  const initialPlayerType = localStorage.getItem("player-type");
  const isInitialPlayerTypeValid =
    initialPlayerType === "sequential" ||
    initialPlayerType === "shuffle" ||
    initialPlayerType === "repeat";

  return isInitialPlayerTypeValid ? initialPlayerType : "sequential";
})();

export const usePlayerStore = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id) => set({ activeId: id }),
  setIds: (ids) => set({ ids }),
  currentlyPlayingSongId: undefined,
  setCurrentlyPlayingSongId: (id) => set({ currentlyPlayingSongId: id }),
  playerType: initialPlayerType,
  setPlayerType: () =>
    set(({ playerType }) => {
      if (playerType === "sequential") {
        toast.success('"Shuffle"');
        localStorage.setItem("player-type", "shuffle");
        return { playerType: "shuffle" };
      } else if (playerType === "shuffle") {
        toast.success('"Repeat"');
        localStorage.setItem("player-type", "repeat");
        return { playerType: "repeat" };
      } else {
        toast.success('"Sequential"');
        localStorage.setItem("player-type", "sequential");
        return { playerType: "sequential" };
      }
    }),
  volume: 1,
  setVolume: (volume) => set({ volume }),
  isMobilePlayerOpen: false,
  setIsMobilePlayerOpen: (isOpen) => set({ isMobilePlayerOpen: isOpen }),
}));
