import { create } from "zustand";

type PlayType = "next-song" | "shuffle" | "loop";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  playType: PlayType;
  setPlayType: (type: PlayType) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  reset: () => set({ ids: [], activeId: undefined }),
  playType: "next-song",
  setPlayType: (type) => set({ playType: type }),
  volume: 1,
  setVolume: (volume) => set({ volume }),
}));
