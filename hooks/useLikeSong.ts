import { likeSong } from "@/actions/likeSong";
import { useAuthModal } from "@/store/useAuthModal";
import { useLikedSongs } from "@/store/useLikedSongs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export const useLikeSong = (songId: string, initialIsLiked?: true) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const { likedSongs, setLikedSongs, removeIdFromLikedSongs } = useLikedSongs();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const [isLiked, setIsLiked] = useState(
    initialIsLiked || likedSongs[songId] || false
  );
  const [pending, startTransition] = useTransition();

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const router = useRouter();

  const { session } = useSessionContext();
  const user = session?.user;

  useEffect(() => {
    if (!user?.id) return;

    if (likedSongs[songId]) {
      setIsLiked(true);
      return;
    }
  }, [user?.id]);

  useEffect(() => {
    if (likedSongs[songId]) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likedSongs]);

  const handleLike = async () => {
    if (pending) return;

    if (!user) return onAuthModalOpen();

    startTransition(async () => {
      try {
        // Optimistic update...
        setLikedSongs(songId, !isLiked);

        // Simple animation when we like a song...
        if (!isLiked) btnRef.current?.classList.add("like-button-animation");
        else btnRef.current?.classList.remove("like-button-animation");

        // Updating the song in DB
        const likeInformation = await likeSong(isLiked, user.id, songId);

        // Updating the store based on result
        (likeInformation.isLiked ? setLikedSongs : removeIdFromLikedSongs)(
          songId,
          true
        );

        router.refresh();

        if (likeInformation.error) {
          toast.error(likeInformation.error);
        }

        if (likeInformation.message) {
          toast.success(likeInformation.message);
        }
      } catch {
        if (!navigator.onLine) {
          toast.error("No internet connection, please try again later.");
          return;
        }

        toast.error("Something went wrong, please try again later.");
      }
    });
  };

  return { isLiked, handleLike, pending, Icon, btnRef };
};
