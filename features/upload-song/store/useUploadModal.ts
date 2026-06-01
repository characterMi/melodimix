import { create } from "zustand";

type UploadModalStore = Omit<ModalStore, "onOpen"> & {
  initialData: Song | undefined;
  onOpen: (data?: Song) => void;
};

export const useUploadModal = create<UploadModalStore>((setState) => ({
  isOpen: false,
  initialData: undefined,
  onOpen: (data?: Song) => setState({ isOpen: true, initialData: data }),
  onClose: () => setState({ isOpen: false, initialData: undefined }),
}));
