"use client";

import { shouldReduceMotion } from "@/lib/reduceMotion";
import LikedImage from "@/public/images/liked.png";
import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const LikedPageLink = () => (
  <Link
    scroll={false}
    href={"/liked"}
    className={twMerge(
      "relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 focus-visible:bg-neutral-100/20 outline-none pr-4",
      !shouldReduceMotion && "transition"
    )}
  >
    <div className="relative min-h-[64px] min-w-[64px]" aria-hidden>
      <Image
        src={LikedImage}
        alt="Liked musics"
        className="object-cover size-16"
        width={64}
        height={64}
        placeholder="blur"
      />
    </div>

    <p className="font-medium truncate py-5">Liked Songs</p>

    <div
      className={twMerge(
        "absolute opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-105 group-focus-visible:opacity-100 focus-visible:scale-105",
        !shouldReduceMotion && "transition"
      )}
      aria-hidden
    >
      <FaPlay className="text-black" />
    </div>
  </Link>
);

export default LikedPageLink;
