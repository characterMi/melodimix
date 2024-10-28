import { create } from "zustand";

type PlayType = "next-song" | "shuffle";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  playerType: PlayType;
  setPlayerType: (type: PlayType) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  reset: () => set({ ids: [], activeId: undefined }),
  playerType: "next-song",
  setPlayerType: (type) => set({ playerType: type }),
  volume: 1,
  setVolume: (volume) => set({ volume }),
}));
