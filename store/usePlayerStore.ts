import toast from "react-hot-toast";
import { create } from "zustand";

export type PlayerType = "next-song" | "shuffle" | "repeat";

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

export const usePlayerStore = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id) => set({ activeId: id }),
  setIds: (ids) => set({ ids }),
  currentlyPlayingSongId: undefined,
  setCurrentlyPlayingSongId: (id) => set({ currentlyPlayingSongId: id }),
  playerType: (() => {
    if (typeof localStorage === "undefined") return "next-song";

    const initialPlayerType = localStorage.getItem("player-type");
    const isInitialPlayerTypeValid =
      initialPlayerType === "next-song" ||
      initialPlayerType === "shuffle" ||
      initialPlayerType === "repeat";

    return isInitialPlayerTypeValid ? initialPlayerType : "next-song";
  })(),
  setPlayerType: () =>
    set(({ playerType }) => {
      if (playerType === "next-song") {
        toast.success('"Shuffle"');
        localStorage.setItem("player-type", "shuffle");
        return { playerType: "shuffle" };
      } else if (playerType === "shuffle") {
        toast.success('"Repeat"');
        localStorage.setItem("player-type", "repeat");
        return { playerType: "repeat" };
      } else {
        toast.success('"Next song"');
        localStorage.setItem("player-type", "next-song");
        return { playerType: "next-song" };
      }
    }),
  volume: 1,
  setVolume: (volume) => set({ volume }),
  isMobilePlayerOpen: false,
  setIsMobilePlayerOpen: (isOpen) => set({ isMobilePlayerOpen: isOpen }),
}));
