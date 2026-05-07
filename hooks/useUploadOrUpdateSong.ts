import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { useHomePageData } from "@/store/useHomePageData";
import { useUserSongs } from "@/store/useUserSongsStore";
import { useUploadModal } from "../store/useUploadModal";
import { updateSong } from "../utils/updateSong";
import { uploadSong } from "../utils/uploadSong";

export type UploadPhase =
  | "none"
  | "validating"
  | "creating"
  | "updating"
  | "uploading";

export const useUploadOrUpdateSong = () => {
  const [phase, setPhase] = useState<UploadPhase>("none");
  const [uploadProgress, setUploadProgress] = useState({
    song: 0,
    image: 0,
  });

  const { isOpen, onClose, initialData } = useUploadModal();
  const { addOne: addUploadedSongToSongs, updateOne: updateUploadedSong } =
    useHomePageData((state) => ({
      addOne: state.addOne,
      updateOne: state.updateOne,
    }));
  const addUploadedSongToUserSongs = useUserSongs((state) => state.addOneSong);

  const { session } = useSession();

  const router = useRouter();

  const isEditing = !!initialData;

  const onUploadProgress = useCallback(
    (type: keyof typeof uploadProgress, progress: number) => {
      setUploadProgress((prev) => ({ ...prev, [type]: progress }));
    },
    []
  );

  const handleSubmit = async (formData: FormData) => {
    if (!isOpen || phase !== "none") return;

    if (!session?.user) {
      onError("Unauthenticated User.");

      return;
    }

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

    setPhase("validating");

    if (isEditing) {
      const { error, updatedSong } = await updateSong(
        formData,
        initialData,
        setPhase,
        onUploadProgress
      );

      setPhase("none");

      if (error) {
        onError(error);
        return;
      }

      updateUploadedSong(updatedSong!);
    } else {
      const { error, uploadedSong } = await uploadSong(
        formData,
        setPhase,
        onUploadProgress
      );

      setPhase("none");

      if (error) {
        onError(error);
        return;
      }

      addUploadedSongToUserSongs(uploadedSong!);
      addUploadedSongToSongs(uploadedSong!);
    }

    onSuccess(`Song ${isEditing ? "updated" : "created"}!`);
    router.refresh();
    onClose();
  };

  return {
    isEditing,
    handleSubmit,
    phase,
    uploadProgress,
    isUploadModalOpen: isOpen,
    onUploadModalClose: onClose,
    initialData,
  };
};
