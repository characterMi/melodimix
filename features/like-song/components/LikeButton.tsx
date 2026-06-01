"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useLikeSong } from "../hooks/useLikeSong";

const LikeButton = ({
  song,
  size = "sm",
  color = "#22c55e",
}: {
  song: Song;
  size?: "sm" | "lg";
  color?: string;
}) => {
  const { isLiked, handleLike, pending, btnRef } = useLikeSong(song, color);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      className={cnWithReduceMotion(
        "hover:opacity-50 disabled:opacity-50 transition duration-200 disabled:cursor-not-allowed active:scale-90 focus-visible:opacity-50 outline-none relative ease-out",
      )}
      style={{
        // @ts-ignore
        "--bg-color": color,
      }}
      onClick={handleLike}
      disabled={pending}
      aria-label={`Like the ${song.title} song`}
      ref={btnRef}
    >
      <Icon color={isLiked ? color : "white"} size={size === "sm" ? 25 : 28} />
    </button>
  );
};

export default LikeButton;
