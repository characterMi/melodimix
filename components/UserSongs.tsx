"use client";

import { useGetUserSongs } from "@/hooks/useGetUserSongs";
import Library from "./Library";
import Loader from "./Loader";
import MobileSidebar from "./MobileSidebar";

const UserSongs = ({ isMobile }: { isMobile?: boolean }) => {
  const { isSongsLoading, userSongs } = useGetUserSongs();

  if (isSongsLoading && !isMobile)
    return <Loader className="flex justify-center w-full mt-5" />;

  return isMobile ? (
    <MobileSidebar songs={userSongs} isSongsLoading={isSongsLoading} />
  ) : (
    <Library songs={userSongs} />
  );
};

export default UserSongs;
