import { useLikeSong } from "@/hooks/useLikeSong";

const LikeButton = ({
  songId,
  songTitle,
  initialIsLiked,
}: {
  songId: string;
  songTitle: string;
  initialIsLiked?: true;
}) => {
  const { isLiked, handleLike, pending, Icon, btnRef } = useLikeSong(
    songId,
    initialIsLiked
  );

  return (
    <button
      className="hover:opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 focus-visible:opacity-75 outline-none relative duration-200 ease-out"
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
