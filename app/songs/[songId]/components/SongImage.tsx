"use client";

import Image from "next/image";

import { useLoadImage } from "@/hooks/useLoadImage";

import type { Song } from "@/types";

const SongImage = ({ song }: { song: Song | null }) => {
  const image = useLoadImage(song);

  return (
    <Image
      src={image || "/images/song.png"}
      alt={song ? `${song.title} image` : "Couldn't find the song!"}
      width={500}
      height={500}
      className="object-cover size-32 sm:size-44 md:size-32 lg:size-44"
      loading="eager"
    />
  );
};

export default SongImage;
