import { useLikeSong } from "@/hooks/useLikeSong";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import type { Song } from "@/types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

const LikeButton = ({
  song,
  size = "sm",
}: {
  song: Song;
  size?: "sm" | "lg";
}) => {
  const { isLiked, handleLike, pending, btnRef } = useLikeSong(song);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      className={twMerge(
        "hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 focus-visible:opacity-50 outline-none relative ease-out",
        !shouldReduceMotion && "transition duration-200"
      )}
      onClick={handleLike}
      disabled={pending}
      aria-label={`Like the ${song.title} song`}
      ref={btnRef}
    >
      <Icon
        color={isLiked ? "#22c55e" : "white"}
        size={size === "sm" ? 25 : 28}
      />
    </button>
  );
};

export default LikeButton;
