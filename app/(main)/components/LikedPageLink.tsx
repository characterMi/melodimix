"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import LikedImage from "@/public/images/liked.png";

const LikedPageLink = () => (
  <Link
    scroll={false}
    href={"/liked"}
    className={cnWithReduceMotion(
      "relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 focus-visible:bg-neutral-100/20 outline-none pr-4 transition",
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
      className={cnWithReduceMotion(
        "absolute opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-105 group-focus-visible:opacity-100 focus-visible:scale-105 transition",
      )}
      aria-hidden
    >
      <FaPlay className="text-black" />
    </div>
  </Link>
);

export default LikedPageLink;
