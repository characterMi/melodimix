import { likeSong } from "@/actions/likeSong";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikedButton = ({
  songId,
  songTitle,
}: {
  songId: string;
  songTitle: string;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const { onOpen: onAuthModalOpen } = useAuthModal();

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = () => {
      startTransition(async () => {
        const { data, error } = await supabaseClient
          .from("liked_songs")
          .select("*")
          .eq("user_id", user.id)
          .eq("song_id", songId)
          .single();

        if (!error && data) {
          setIsLiked(true);
        }
      });
    };

    fetchData();
  }, [songId, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (pending) return;

    if (!user) return onAuthModalOpen();

    startTransition(async () => {
      const likeInformation = await likeSong(isLiked, user.id, songId);

      setIsLiked(likeInformation.isLiked);

      router.refresh();

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
      className="hover:opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
      onClick={handleLike}
      disabled={pending}
      aria-label={`Like the ${songTitle} song`}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikedButton;
