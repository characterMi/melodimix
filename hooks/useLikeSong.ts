import { likeSong } from "@/actions/likeSong";
import { useAuthModal } from "@/store/useAuthModal";
import { useLikedPageData } from "@/store/useLikedPageData";
import { useLikedSongs } from "@/store/useLikedSongs";
import type { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export const useLikeSong = (song: Song) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const { likedSongs, setLikedSongs, removeIdFromLikedSongs } = useLikedSongs();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const { addOne, removeOne } = useLikedPageData((state) => ({
    addOne: state.addOne,
    removeOne: state.removeOne,
  }));
  const [pending, startTransition] = useTransition();

  const isLiked = likedSongs[song.id] ?? false;

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const { session } = useSessionContext();

  const handleLike = async () => {
    if (pending) return;

    if (!session) return onAuthModalOpen();

    startTransition(async () => {
      if (!navigator.onLine) {
        toast.error("No internet connection, please try again later.");
        return;
      }

      // Optimistic update...
      setLikedSongs(song.id, !isLiked);

      // animation when we like a song...
      if (!isLiked) btnRef.current?.classList.add("like-button-animation");

      // Updating the song in DB
      const likeInformation = await likeSong(isLiked, song.id);

      // Updating (the store + liked page data) based on result...
      if (likeInformation.isLiked) {
        setLikedSongs(song.id, true);
        addOne(song);
      } else {
        removeIdFromLikedSongs(song.id);
        removeOne(song.id);
        btnRef.current?.classList.remove("like-button-animation");
      }

      if (likeInformation.error) {
        toast.error(likeInformation.error);
      }

      if (likeInformation.message) {
        toast.success(likeInformation.message);
      }
    });
  };

  return { isLiked, handleLike, pending, Icon, btnRef };
};
