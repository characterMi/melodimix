import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { revalidatePath } from "../actions/revalidatePath";
import { updatePlaylist } from "../actions/updatePlaylist";
import { useAuthModal } from "../store/useAuthModal";
import { usePlaylistModal } from "../store/usePlaylistModal";

export const useCreateOrUpdatePlaylist = () => {
  const { isOpen, onClose, initialData, clearInitialData } = usePlaylistModal();
  const [name, setName] = useState("");
  const [songIds, setSongIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAuthModal = useAuthModal((state) => state.onOpen);
  const { session, supabaseClient } = useSessionContext();

  const isEditing = !!initialData;

  const onSubmit = async () => {
    if (!session?.user) {
      openAuthModal();
      return;
    }

    const trimmedName = name.trim();

    if (trimmedName === "") {
      toast.error("Playlist name is required!");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("Playlist name is too long!");
      return;
    }

    setIsSubmitting(true);

    if (isEditing) {
      const { error } = await updatePlaylist({
        id: initialData.id,
        name: trimmedName,
        user_id: session.user.id,
        song_ids: songIds,
      });

      if (error) {
        toast.error("Something went wrong while updating the playlist!");
        setIsSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabaseClient.from("playlists").insert({
        name: trimmedName,
        user_id: session.user.id,
        song_ids: songIds,
      });

      if (error) {
        toast.error("Something went wrong while creating the playlist!");
        setIsSubmitting(false);
        return;
      }
    }

    toast.success(`Playlist ${isEditing ? "updated" : "created"}!`);

    onClose();
    setIsSubmitting(false);
    setName("");
    setSongIds([]);
    revalidatePath("/profile");
    isEditing && revalidatePath(`/profile/playlists/${initialData.id}`);
  };

  useEffect(() => {
    if (isEditing) {
      setName(initialData.name);
      setSongIds(initialData.song_ids);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
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
    songIds,
    setSongIds,
    isSubmitting,
    onSubmit,
  };
};
