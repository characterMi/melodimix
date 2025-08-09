"use client";

import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { twMerge } from "tailwind-merge";

interface Props {
  name: string;
  userId: string;
  shouldHighlight?: true;
}

const Author = ({ name, userId, shouldHighlight }: Props) => (
  <Link
    href={`/users/${userId}`}
    onClick={(e) => e.stopPropagation()}
    className={twMerge(
      "inline-flex items-center gap-[2px] hover:opacity-50 focus-visible:opacity-50 outline-none transition truncate",
      shouldHighlight && "font-bold"
    )}
  >
    <span className="truncate gradient-text">{name}</span>

    {shouldHighlight ? (
      <FaArrowUp
        className="rotate-45 text-emerald-600 min-w-3 min-h-3"
        size={12}
        aria-hidden
      />
    ) : (
      <MdArrowOutward size={14} aria-hidden className="min-w-3 min-h-3" />
    )}
  </Link>
);

export default Author;
