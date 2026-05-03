import { create } from "zustand";

export type ColorEntity =
  | {
      light: string;
      medium: string;
      dark: string;
    }
  | undefined;

type Store = {
  colors: {
    [index in number]: ColorEntity;
  };
  setSongColors: (songId: number, colors: ColorEntity) => void;
};

export const useSongColors = create<Store>((setState) => ({
  colors: {},
  setSongColors: (songId, colors) =>
    setState((prev) => ({ colors: { ...prev, [songId]: colors } })),
}));
