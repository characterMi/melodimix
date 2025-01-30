import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAuthModal = create<AuthModalStore>((setState) => ({
  isOpen: false,
  onOpen: () => setState({ isOpen: true }),
  onClose: () => setState({ isOpen: false }),
}));
