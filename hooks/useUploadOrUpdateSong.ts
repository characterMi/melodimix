import { useHomePageData } from "@/store/useHomePageData";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { useUploadModal } from "../store/useUploadModal";
import { updateSong } from "../utils/updateSong";
import { uploadSong } from "../utils/uploadSong";

export const useUploadOrUpdateSong = () => {
  const [isUploading, startTransition] = useTransition();
  const { isOpen, onClose, clearInitialData, initialData } = useUploadModal();
  const { addOne: addUploadedSongToSongs, updateOne: updateUploadedSong } =
    useHomePageData((state) => ({
      addOne: state.addOne,
      updateOne: state.updateOne,
    }));
  const { session } = useSessionContext();
  const router = useRouter();

  const isEditing = !!initialData;

  const handleSubmit = (formData: FormData) => {
    if (!isOpen || isUploading) return;

    if (!session?.user) {
      toast.error("Unauthenticated User.", {
        ariaProps: { role: "alert", "aria-live": "polite" },
      });

      return;
    }

    startTransition(async () => {
      try {
        if (isEditing) {
          const { error, updatedSong } = await updateSong(formData, {
            id: initialData.id,
            img_path: initialData.img_path,
            song_path: initialData.song_path,
          });

          if (error) {
            toast.error(error);
            return;
          }

          updateUploadedSong(updatedSong!);
        } else {
          const { error, uploadedSong } = await uploadSong(formData);

          if (error) {
            toast.error(error);
            return;
          }

          addUploadedSongToSongs(uploadedSong!);
        }

        toast.success(`Song ${isEditing ? "updated" : "created"}!`);
        router.refresh();
        onClose();
      } catch (error: any) {
        console.error(error);

        toast.error("Something went wrong.");
      }
    });
  };

  useEffect(() => {
    if (!isOpen) {
      clearInitialData();
    }
  }, [isOpen]);

  return {
    isEditing,
    handleSubmit,
    isUploading,
    isUploadModalOpen: isOpen,
    onUploadModalClose: onClose,
    initialData,
  };
};
