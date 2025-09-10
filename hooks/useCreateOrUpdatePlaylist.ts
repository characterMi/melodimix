import { createPlaylist } from "@/actions/createPlaylist";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updatePlaylist } from "../actions/updatePlaylist";
import { useAuthModal } from "../store/useAuthModal";
import { usePlaylistModal } from "../store/usePlaylistModal";
import { useSession } from "./useSession";

export const useCreateOrUpdatePlaylist = () => {
  const { isOpen, onClose, initialData, clearInitialData } = usePlaylistModal();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [songIds, setSongIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAuthModal = useAuthModal((state) => state.onOpen);
  const { session } = useSession();

  const router = useRouter();

  const isEditing = !!initialData;

  const onSubmit = async () => {
    if (!session?.user) {
      openAuthModal();
      return;
    }

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

    setIsSubmitting(true);

    if (isEditing) {
      const { error, message } = await updatePlaylist({
        id: initialData.id,
        name,
        is_public: isPublic,
        user_id: session.user.id,
        song_ids: songIds,
      });

      if (error) {
        onError(message);
        setIsSubmitting(false);
        return;
      }
    } else {
      const { error, message, playlistId } = await createPlaylist({
        name,
        isPublic: isPublic,
        songIds,
      });

      if (error) {
        onError(message);
        setIsSubmitting(false);
        return;
      }

      router.push(`/profile/playlists/${playlistId}`, { scroll: false });
    }

    onSuccess(`Playlist ${isEditing ? "updated" : "created"}!`);

    onClose();
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isEditing) {
      setName(initialData.name);
      setIsPublic(initialData.is_public);
      setSongIds(initialData.song_ids);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setIsPublic(false);
      setSongIds([]);
      clearInitialData();
    }
  }, [isOpen]);

  return {
    isEditing,
    isPlaylistModalOpen: isOpen,
    onPlaylistModalClose: onClose,
    initialData,
    name,
    setName,
    isPublic,
    setIsPublic,
    songIds,
    setSongIds,
    isSubmitting,
    onSubmit,
  };
};
