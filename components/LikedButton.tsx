import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { likeSong } from "@/actions/likeSong";

const LikedButton = ({ songId }: { songId: string }) => {
  const [isLiked, setIsLiked] = useState(false);

  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

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
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    const likeInformation = await likeSong(isLiked, user.id, songId);

    setIsLiked(likeInformation.isLiked);

    if (likeInformation.error) {
      toast.error(likeInformation.error);
    }

    if (likeInformation.message) {
      toast.success(likeInformation.message);
    }

    router.refresh();
  };

  return (
    <button
      className="hover:opacity-75 transition disabled:opacity-5 disabled:cursor-not-allowed"
      onClick={handleLike}
      disabled={pending}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikedButton;
