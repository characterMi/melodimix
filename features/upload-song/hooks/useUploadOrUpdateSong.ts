import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useSession } from "@/features/auth/hooks/useSession";
import { useHomePageData } from "@/features/infinite-scroll/store/useHomePageData";
import { useUserSongs } from "@/features/user-related/store/useUserSongsStore";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
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
  const abortController = useRef(new AbortController());
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
    [],
  );

  const onPhaseChange = useCallback((newPhase: UploadPhase) => {
    flushSync(() => {
      setPhase(newPhase);
    });
  }, []);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (!isOpen || phase !== "none") return;

      if (!session?.user) {
        onError("Unauthenticated User.");

        return;
      }

      if (!navigator.onLine) {
        onError(
          "You're currently offline, make sure you're online, then try again.",
        );

        return;
      }

      // We need immediate update, can't let react scheduler to run this later, so we prioritize this call over the others
      // by using flushSync
      flushSync(() => {
        abortController.current = new AbortController();
        setPhase("validating");
        onSuccess(
          `Started the process of ${isEditing ? "editing" : "uploading"}, do not close the modal.`,
          { duration: 5 },
        );
      });

      if (isEditing) {
        const { error, updatedSong } = await updateSong(
          formData,
          initialData,
          onPhaseChange,
          onUploadProgress,
          abortController.current,
        );

        setPhase("none");

        if (error) {
          if (error !== "AbortSignal") onError(error);
          return;
        }

        updateUploadedSong(updatedSong!);
      } else {
        const { error, uploadedSong } = await uploadSong(
          formData,
          onPhaseChange,
          onUploadProgress,
          abortController.current,
        );

        setPhase("none");

        if (error) {
          if (error !== "AbortSignal") onError(error);
          return;
        }

        addUploadedSongToUserSongs(uploadedSong!);
        addUploadedSongToSongs(uploadedSong!);
      }

      onSuccess(`Song ${isEditing ? "updated" : "created"}!`);
      router.refresh();
      onClose();
    },
    [isOpen, phase, session, isEditing, initialData],
  );

  const handleCancel = useCallback(() => {
    if (phase === "creating") return;

    abortController.current.abort();
    onSuccess("Operation cancelled.");
  }, [phase]);

  useEffect(() => {
    setUploadProgress({ image: 0, song: 0 });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && phase !== "none") {
      handleCancel();
    }
  }, [isOpen, phase]);

  return {
    isEditing,
    handleSubmit,
    handleCancel,
    phase,
    uploadProgress,
    isUploadModalOpen: isOpen,
    onUploadModalClose: onClose,
    initialData,
  };
};
