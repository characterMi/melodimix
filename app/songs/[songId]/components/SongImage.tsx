"use client";

import { useLoadImage } from "@/hooks/useLoadImage";

import SongCover from "@/components/SongCover";

import type { Song } from "@/types";

const SongImage = ({ song }: { song: Song | null }) => {
  const image = useLoadImage(song);

  return (
    <SongCover
      src={image || "/images/song.png"}
      alt={song ? `${song.title} image` : "Couldn't find the song!"}
      width={500}
      height={500}
      className="object-cover size-36 xss:size-40 sm:size-44 md:size-32 lg:size-44"
      loading="eager"
    />
  );
};

export default SongImage;
