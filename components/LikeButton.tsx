import { likeSong } from "@/actions/likeSong";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeButton = ({
  songId,
  songTitle,
}: {
  songId: string;
  songTitle: string;
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const { likedSongs, setLikedSongs, removeIdFromLikedSongs } = useLikedSongs();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const { user } = useUser();

  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!user?.id) return;

    const likedSongsSet = new Set(likedSongs);

    if (likedSongsSet.has(songId)) {
      setIsLiked(true);
      return;
    }

    (() => {
      startTransition(async () => {
        const { data, error } = await supabaseClient
          .from("liked_songs")
          .select("*")
          .eq("user_id", user.id)
          .eq("song_id", songId)
          .single();

        if (!error && data) {
          setLikedSongs(songId);
          setIsLiked(true);
        }
      });
    })();
  }, [user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (pending) return;

    if (!user) return onAuthModalOpen();

    startTransition(async () => {
      const likeInformation = await likeSong(isLiked, user.id, songId);

      setIsLiked(likeInformation.isLiked);
      (likeInformation.isLiked ? setLikedSongs : removeIdFromLikedSongs)(
        songId
      );

      router.refresh();

      if (likeInformation.isLiked)
        btnRef.current?.classList.add("like-button-animation");
      else btnRef.current?.classList.remove("like-button-animation");

      if (likeInformation.error) {
        toast.error(likeInformation.error);
      }

      if (likeInformation.message) {
        toast.success(likeInformation.message);
      }
    });
  };

  return (
    <button
      className="hover:opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 relative duration-200 ease-out"
      onClick={handleLike}
      disabled={pending}
      aria-label={`Like the ${songTitle} song`}
      ref={btnRef}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
