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
    aria-label={"Go to " + name + " profile"}
    onClick={(e) => e.stopPropagation()}
    className={twMerge(
      "inline-flex items-center justify-center gap-[2px] hover:opacity-75 focus-visible:opacity-75 outline-none transition",
      shouldHighlight && "font-bold author"
    )}
  >
    {name}

    {shouldHighlight ? (
      <FaArrowUp size={12} className="rotate-45 text-emerald-600" aria-hidden />
    ) : (
      <MdArrowOutward size={14} aria-hidden />
    )}
  </Link>
);

export default Author;
