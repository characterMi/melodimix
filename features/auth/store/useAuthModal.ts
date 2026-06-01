import { create } from "zustand";

export const useAuthModal = create<ModalStore>((setState) => ({
  isOpen: false,
  onOpen: () => setState({ isOpen: true }),
  onClose: () => setState({ isOpen: false }),
}));
