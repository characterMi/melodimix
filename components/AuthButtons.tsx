"use client";

import { useAuthModal } from "@/store/useAuthModal";
import { useLikedSongs } from "@/store/useLikedSongs";
import { useUserModal } from "@/store/useUserModal";
import { useSessionContext } from "@supabase/auth-helpers-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { RiUserFill } from "react-icons/ri";
import Button from "./Button";
import Loader from "./Loader";

const AuthButtons = ({ router }: { router: AppRouterInstance }) => {
  const pathname = usePathname();
  const isInProfilePage = pathname.startsWith("/profile");

  const clearLikedSongs = useLikedSongs((state) => state.clearLikedSongs);
  const onAuthModalOpen = useAuthModal((state) => state.onOpen);
  const onUserModalOpen = useUserModal((state) => state.onOpen);

  const {
    session,
    isLoading: isUserLoading,
    supabaseClient,
  } = useSessionContext();

  const handleLogOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      toast.error("There was an error when logging you out, try again!", {
        ariaProps: { role: "alert", "aria-live": "assertive" },
      });
      return;
    }

    toast.success("Logged out !");
    router.refresh();
    clearLikedSongs();
  };

  const AuthButtons = session?.user ? (
    <>
      <Button
        onClick={handleLogOut}
        className="bg-white px-6 py-[6px] flex gap-x-2 items-center"
      >
        Logout
        <FiLogOut aria-hidden />
      </Button>

      <Link
        href="/profile"
        className="rounded-full p-[9px] bg-white flex items-center justify-center hover:opacity-35 focus-visible:opacity-35 transition outline-none"
        aria-label="Go to profile page"
      >
        <RiUserFill size={20} className="text-black" aria-hidden />
      </Link>

      {isInProfilePage && (
        <Button
          onClick={onUserModalOpen}
          className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-35 focus-visible:opacity-35 transition outline-none"
        >
          <BiDotsVerticalRounded size={20} aria-hidden />
        </Button>
      )}
    </>
  ) : (
    <>
      <Button
        className="bg-transparent text-neutral-300 font-medium text-nowrap py-[6px]"
        onClick={onAuthModalOpen}
      >
        Sign up
      </Button>

      <Button
        className="bg-white px-6 py-[6px] text-nowrap"
        onClick={onAuthModalOpen}
      >
        Login
      </Button>
    </>
  );

  return (
    <div className="flex justify-between items-center gap-x-2">
      {isUserLoading ? <Loader className="m-0 min-w-[38px]" /> : AuthButtons}
    </div>
  );
};

export default AuthButtons;
