import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useUploadModal = create<UploadModalStore>((setState) => ({
  isOpen: false,
  onOpen: () => setState({ isOpen: true }),
  onClose: () => setState({ isOpen: false }),
}));
