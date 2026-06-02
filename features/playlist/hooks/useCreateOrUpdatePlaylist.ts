import { useAuthModal } from "@/features/auth/store/useAuthModal";
import { usePlaylistsPageData } from "@/features/infinite-scroll/store/usePlaylistsPageData";
import { createPlaylist, updatePlaylist } from "@/features/playlist/actions";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "../../auth/hooks/useSession";
import { usePlaylistModal } from "../store/usePlaylistModal";

export const useCreateOrUpdatePlaylist = () => {
  const { isOpen, onClose, initialData } = usePlaylistModal();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [poster, setPoster] = useState<File | null>(null);
  const [songIds, setSongIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addPlaylistToPlaylists, updatePlaylistsStore } = usePlaylistsPageData(
    (state) => ({
      addPlaylistToPlaylists: state.addOne,
      updatePlaylistsStore: state.updateOne,
    }),
  );
  const openAuthModal = useAuthModal((state) => state.onOpen);
  const { session } = useSession();

  const router = useRouter();

  const isEditing = !!initialData;

  const onSubmit = async () => {
    if (isSubmitting) return;

    if (!session?.user) {
      openAuthModal();
      return;
    }

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again.",
      );
      return;
    }

    setIsSubmitting(true);

    if (isEditing) {
      const updatedPlaylist = {
        id: initialData.id,
        name,
        is_public: isPublic,
        user_id: session.user.id,
        song_ids: songIds,
        created_at: initialData.created_at,
        poster_path: initialData.poster_path,
      };

      const { error, message } = await updatePlaylist(updatedPlaylist, poster);

      if (error) {
        onError(message);
        setIsSubmitting(false);
        return;
      }

      updatePlaylistsStore(updatedPlaylist);
    } else {
      const { error, message, playlist } = await createPlaylist({
        name,
        isPublic: isPublic,
        songIds,
        playlistPoster: poster,
      });

      if (error) {
        onError(message);
        setIsSubmitting(false);
        return;
      }

      router.push(`/profile/playlists/${playlist.id}`, { scroll: false });
      addPlaylistToPlaylists(playlist);
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
      setPoster(null);
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
    poster,
    setPoster,
    songIds,
    setSongIds,
    isSubmitting,
    onSubmit,
  };
};
