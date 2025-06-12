import { useLikeSong } from "@/hooks/useLikeSong";
import type { Song } from "@/types";

const LikeButton = ({ song }: { song: Song }) => {
  const { isLiked, handleLike, pending, Icon, btnRef } = useLikeSong(song);

  return (
    <button
      className="hover:opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 focus-visible:opacity-75 outline-none relative duration-200 ease-out"
      onClick={handleLike}
      disabled={pending}
      aria-label={`Like the ${song.title} song`}
      ref={btnRef}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
