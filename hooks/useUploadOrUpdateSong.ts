import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const { current: onPhaseChange } = useRef((phase: UploadPhase) =>
    setPhase(phase)
  );

  const { isOpen, onClose, clearInitialData, initialData } = useUploadModal();
  const { addOne: addUploadedSongToSongs, updateOne: updateUploadedSong } =
    useHomePageData((state) => ({
      addOne: state.addOne,
      updateOne: state.updateOne,
    }));
  const addUploadedSongToUserSongs = useUserSongs((state) => state.addOneSong);

  const { session } = useSession();

  const router = useRouter();

  const isEditing = !!initialData;

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

    if (isEditing) {
      const { error, updatedSong } = await updateSong(
        formData,
        {
          id: initialData.id,
          img_path: initialData.img_path,
          song_path: initialData.song_path,
          created_at: initialData.created_at,
        },
        onPhaseChange
      );

      setPhase("none");

      if (error) {
        onError(error);
        return;
      }

      updateUploadedSong(updatedSong!);
    } else {
      const { error, uploadedSong } = await uploadSong(formData, onPhaseChange);

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

  useEffect(() => {
    if (!isOpen) {
      clearInitialData();
    }
  }, [isOpen]);

  return {
    isEditing,
    handleSubmit,
    phase,
    isUploadModalOpen: isOpen,
    onUploadModalClose: onClose,
    initialData,
  };
};
