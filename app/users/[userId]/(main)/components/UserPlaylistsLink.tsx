"use client";

import { shouldReduceMotion } from "@/lib/reduceMotion";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const UserPlaylistsLink = ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => (
  <Link
    scroll={false}
    href={`/users/${userId}/playlists`}
    className={twMerge(
      "font-semibold text-sm gradient-text outline-none hover:opacity-50 focus-visible:opacity-50 inline-block",
      !shouldReduceMotion && "transition-opacity"
    )}
  >
    {name === "Guest" ? "User" : name}'s playlists
  </Link>
);

export default UserPlaylistsLink;
