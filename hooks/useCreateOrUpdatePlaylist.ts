import { createPlaylist } from "@/actions/createPlaylist";
import { onError } from "@/lib/onError";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { updatePlaylist } from "../actions/updatePlaylist";
import { useAuthModal } from "../store/useAuthModal";
import { usePlaylistModal } from "../store/usePlaylistModal";

export const useCreateOrUpdatePlaylist = () => {
  const { isOpen, onClose, initialData, clearInitialData } = usePlaylistModal();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [songIds, setSongIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAuthModal = useAuthModal((state) => state.onOpen);
  const { session } = useSessionContext();

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

      router.push(`/profile/playlists/${playlistId}`);
    }

    toast.success(`Playlist ${isEditing ? "updated" : "created"}!`);

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
