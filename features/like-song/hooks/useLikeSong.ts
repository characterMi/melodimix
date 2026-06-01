import { useRef, useTransition } from "react";

import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthModal } from "@/features/auth/store/useAuthModal";
import { useLikedPageData } from "@/features/infinite-scroll/store/useLikedPageData";
import { likeSong } from "@/features/like-song/actions";
import { useLikedSongs } from "@/features/like-song/store/useLikedSongs";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shouldReduceMotion } from "@/lib/reduceMotion";

export const useLikeSong = (song: Song, color: string) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const { likedSongs, setLikedSongs, removeIdFromLikedSongs } = useLikedSongs();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const { addOne: addSongToLikedPage, removeOne: removeSongFromLikedPage } =
    useLikedPageData((state) => ({
      addOne: state.addOne,
      removeOne: state.removeOne,
    }));
  const [pending, startTransition] = useTransition();

  const isLiked = likedSongs[song.id] ?? false;

  const { session } = useSession();

  const handleLike = async () => {
    if (pending) return;

    if (!session) return onAuthModalOpen();

    if (!navigator.onLine) {
      onError("No internet connection, please try again later.");
      return;
    }

    startTransition(async () => {
      // Optimistic update...
      setLikedSongs(song.id, !isLiked);

      // animation when we like a song...
      if (!isLiked && !shouldReduceMotion) {
        btnRef.current?.style.setProperty("--bg-color", color);
        btnRef.current?.classList.add("like-button-animation");
      }

      // Updating the song in DB
      const likeResponse = await likeSong(isLiked, song.id);

      // Updating (the store + liked page data) based on result...
      if (likeResponse.isLiked) {
        setLikedSongs(song.id, true);
        addSongToLikedPage(song);
      } else {
        removeIdFromLikedSongs(song.id);
        removeSongFromLikedPage(song.id);
        btnRef.current?.classList.remove("like-button-animation");
      }

      if (likeResponse.error) {
        onError(likeResponse.error);
      }

      if (likeResponse.message) {
        onSuccess(likeResponse.message);
      }
    });
  };

  return { isLiked, handleLike, pending, btnRef };
};
