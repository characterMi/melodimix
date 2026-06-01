"use client";

import { useGetUserSongs } from "@/features/user-related/hooks/useGetUserSongs";

import Loader from "../../../components/Loader";
import Library from "../../sidebar/components/Library";
import MobileSidebar from "../../sidebar/components/MobileSidebar";

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
