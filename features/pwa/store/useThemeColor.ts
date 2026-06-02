import { create } from "zustand";

type Store = {
  meta: HTMLMetaElement | null;
  setMetaElement: (el: HTMLMetaElement | null) => void;
};

export const useThemeColor = create<Store>((setState) => ({
  meta: null,
  setMetaElement: (meta) => setState({ meta }),
}));
