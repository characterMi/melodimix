"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiSearch } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import Loader from "./Loader";

const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  const supabaseClient = useSupabaseClient();

  const { user, isLoading: isUserLoading } = useUser();

  const handleLogOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out !");
    }
  };

  const { onOpen } = useAuthModal();

  const AuthButtons = user ? (
    <Button
      onClick={handleLogOut}
      className="bg-white px-6 py-2 flex gap-x-2 items-center"
    >
      Logout
      <FiLogOut />
    </Button>
  ) : (
    <>
      <div>
        <Button
          className="bg-transparent text-neutral-300 font-medium"
          onClick={onOpen}
        >
          Sign up
        </Button>
      </div>

      <div>
        <Button className="bg-white px-6 py-2" onClick={onOpen}>
          Login
        </Button>
      </div>
    </>
  );

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
            className="rounded-full bg-black flex items-center justify-center hover:opacity-35 transition"
            aria-label="Go back to the previous page (from browser's history)"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>

          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-35 transition"
            aria-label="Go to the next page (from browser's history)"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>

        <div className="flex md:hidden gap-x-2 items-center">
          <Link
            href="/"
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-35 transition"
            aria-label="Go to home page"
          >
            <HiHome size={20} className="text-black" />
          </Link>

          <Link
            href="/search"
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-35 transition"
            aria-label="Go to search page"
          >
            <BiSearch size={20} className="text-black" />
          </Link>
        </div>

        <div className="flex justify-between items-center gap-x-4">
          {isUserLoading ? (
            <Loader className="scale-[.65] m-0 p-0" />
          ) : (
            AuthButtons
          )}
        </div>
      </nav>

      {children}
    </header>
  );
};
export default Header;
