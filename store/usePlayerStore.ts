import { create } from "zustand";

type PlayerType = "next-song" | "shuffle" | "repeat";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id?: string) => void;
  setIds: (ids: string[]) => void;
  currentlyPlayingSongId?: string;
  setCurrentlyPlayingSongId: (id: string) => void;
  playerType: PlayerType;
  setPlayerType: (type: PlayerType) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id) => set({ activeId: id }),
  setIds: (ids) => set({ ids }),
  currentlyPlayingSongId: undefined,
  setCurrentlyPlayingSongId: (id) => set({ currentlyPlayingSongId: id }),
  playerType: "next-song",
  setPlayerType: (type) => set({ playerType: type }),
  volume: 1,
  setVolume: (volume) => set({ volume }),
}));
