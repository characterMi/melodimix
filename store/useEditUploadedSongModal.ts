import { create } from "zustand";

type InitialData = {
  title: string;
  author: string;
};

interface EditUploadedSongModalStore {
  isOpen: boolean;
  onOpen: (data: InitialData) => void;
  onClose: () => void;
}

export const useEditUploadedSongModal = create<
  EditUploadedSongModalStore & {
    initialData: InitialData;
  }
>((set) => ({
  isOpen: false,
  initialData: {} as InitialData,
  onOpen: (data) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false }),
}));
