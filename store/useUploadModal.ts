import type { Song } from "@/types";
import { create } from "zustand";

type UploadModalStore = Omit<ModalStore, "onOpen"> & {
  initialData: Song | undefined;
  clearInitialData: () => void;
  onOpen: (data?: Song) => void;
};

export const useUploadModal = create<UploadModalStore>((setState) => ({
  isOpen: false,
  initialData: undefined,
  clearInitialData: () => setState({ initialData: undefined }),
  onOpen: (data?: Song) => setState({ isOpen: true, initialData: data }),
  onClose: () => setState({ isOpen: false }),
}));
