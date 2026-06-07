import { onSuccess } from "@/lib/onSuccess";
import { create } from "zustand";

type UploadModalStore = Omit<ModalStore, "onOpen"> & {
  initialData: Song | undefined;
  onOpen: (data?: Song) => void;
};

export const useUploadModal = create<UploadModalStore>((setState) => ({
  isOpen: false,
  initialData: undefined,
  onOpen: (data?: Song) => {
    if (localStorage.getItem("show-upload-note") !== "false") {
      onSuccess(
        "When started the upload process, do not close the modal, or it'll cancel the uploading.",
        { duration: 5000 },
      );
      localStorage.setItem("show-upload-note", "false");
    }

    setState({ isOpen: true, initialData: data });
  },
  onClose: () => setState({ isOpen: false, initialData: undefined }),
}));
