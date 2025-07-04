"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import AuthButtons from "./AuthButtons";

const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <header
      className={twMerge(
        "h-fit bg-gradient-to-b from-emerald-800 p-6",
        className
      )}
    >
      <nav className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-35 focus-visible:opacity-35 transition outline-none p-[1.5px]"
            aria-label="Go back to the previous page (from browser's history)"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>

          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-35 focus-visible:opacity-35 transition outline-none p-[1.5px]"
            aria-label="Go to the next page (from browser's history)"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>

        <div className="flex md:hidden gap-x-2 items-center">
          <Link
            href="/"
            className="rounded-full p-[9px] bg-white flex items-center justify-center hover:opacity-35 focus-visible:opacity-35 transition outline-none"
            aria-label="Go to home page"
          >
            <HiHome size={20} className="text-black" aria-hidden />
          </Link>

          <Link
            href="/search"
            className="rounded-full p-[9px] bg-white flex items-center justify-center hover:opacity-35 focus-visible:opacity-35 transition outline-none"
            aria-label="Go to search page"
          >
            <BiSearch size={20} className="text-black" aria-hidden />
          </Link>
        </div>

        <AuthButtons router={router} />
      </nav>

      {children}
    </header>
  );
};

export default Header;
