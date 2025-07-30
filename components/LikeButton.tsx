import { useLikeSong } from "@/hooks/useLikeSong";
import type { Song } from "@/types";

const LikeButton = ({
  song,
  size = "sm",
}: {
  song: Song;
  size?: "sm" | "lg";
}) => {
  const { isLiked, handleLike, pending, Icon, btnRef } = useLikeSong(song);

  return (
    <button
      className="hover:opacity-50 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 focus-visible:opacity-50 outline-none relative duration-200 ease-out"
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
