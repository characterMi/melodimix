"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { RiUserFill } from "react-icons/ri";

import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthModal } from "@/features/auth/store/useAuthModal";
import { useLikedPageData } from "@/features/infinite-scroll/store/useLikedPageData";
import { useLikedSongs } from "@/features/like-song/store/useLikedSongs";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useUserModal } from "@/features/user-related/store/useUserModal";
import { useUserSongs } from "@/features/user-related/store/useUserSongsStore";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";

import Button from "../../../components/Button";
import Loader from "../../../components/Loader";

const AuthButtons = () => {
  const pathname = usePathname();
  const isInProfilePage = pathname.startsWith("/profile");

  const router = useRouter();

  const clearLikedSongs = useLikedSongs((state) => state.clearLikedSongs);
  const setUserSongs = useUserSongs((state) => state.setUserSongs);
  const clearLikedPageData = useLikedPageData((state) => state.removeAll);
  const onAuthModalOpen = useAuthModal((state) => state.onOpen);
  const onUserModalOpen = useUserModal((state) => state.onOpen);

  const { session, isLoading: isUserLoading, supabaseClient } = useSession();

  const handleLogOut = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      onError("There was an error when logging you out, try again!", error);
      return;
    }

    onSuccess("Logged out !");
    router.refresh();
    clearLikedSongs();
    setUserSongs([]);
    clearLikedPageData();
  };

  const AuthButtons = session?.user ? (
    <>
      <Button
        onClick={handleLogOut}
        className="bg-none bg-white px-6 py-[6px] flex gap-x-2 items-center"
      >
        Logout
        <FiLogOut aria-hidden />
      </Button>

      {isInProfilePage ? (
        <Button
          onClick={onUserModalOpen}
          aria-label="Open user modal"
          className="rounded-full p-2 bg-none bg-white flex items-center justify-center"
        >
          <BiDotsVerticalRounded size={20} aria-hidden />
        </Button>
      ) : (
        <Link
          scroll={false}
          href="/profile"
          className={cnWithReduceMotion(
            "rounded-full p-[9px] bg-white flex transition-opacity items-center justify-center hover:opacity-50 focus-visible:opacity-50 outline-none",
          )}
          aria-label="Go to profile page"
        >
          <RiUserFill size={20} className="text-black" aria-hidden />
        </Link>
      )}
    </>
  ) : (
    <>
      <Button
        className="bg-none text-neutral-300 font-medium text-nowrap py-[6px] whitespace-nowrap"
        onClick={onAuthModalOpen}
      >
        Sign up
      </Button>

      <Button
        className="bg-none bg-white px-6 py-[6px] text-nowrap whitespace-nowrap"
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
