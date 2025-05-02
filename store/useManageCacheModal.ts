import { create } from "zustand";

interface ManageCacheModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useManageCacheModal = create<ManageCacheModal>((setState) => ({
  isOpen: false,
  onOpen: () => setState({ isOpen: true }),
  onClose: () => setState({ isOpen: false }),
}));
