"use client";

import { useGetUserSongs } from "@/hooks/useGetUserSongs";

import Library from "./Library";
import Loader from "./Loader";
import MobileSidebar from "./MobileSidebar";

const UserSongs = ({ isMobile }: { isMobile?: boolean }) => {
  const { isSongsLoading, userSongs } = useGetUserSongs();

  if (isSongsLoading && !isMobile) {
    return (
      <div className="h-screen w-full flex justify-center">
        <Loader className="mt-5" />
      </div>
    );
  }

  return isMobile ? (
    <MobileSidebar songs={userSongs} isSongsLoading={isSongsLoading} />
  ) : (
    <Library songs={userSongs} />
  );
};

export default UserSongs;
