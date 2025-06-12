import type { Song } from "@/types";
import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  initialData: Song | undefined;
  clearInitialData: () => void;
  onOpen: (data?: Song) => void;
  onClose: () => void;
}

export const useUploadModal = create<UploadModalStore>((setState) => ({
  isOpen: false,
  initialData: undefined,
  clearInitialData: () => setState({ initialData: undefined }),
  onOpen: (data?: Song) => setState({ isOpen: true, initialData: data }),
  onClose: () => setState({ isOpen: false }),
}));
