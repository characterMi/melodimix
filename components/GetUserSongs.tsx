"use client";

import { getSongsByUserId } from "@/actions/getSongsByUserId";
import { useGetSongs } from "@/hooks/useGetSongs";
import Library from "./Library";
import Loader from "./Loader";
import MobileSidebar from "./MobileSidebar";

const GetUserSongs = ({ isMobile }: { isMobile?: boolean }) => {
  const { isLoading, songs } = useGetSongs(getSongsByUserId);

  if (isLoading && !isMobile)
    return <Loader className="flex justify-center w-full mt-5" />;

  return isMobile ? <MobileSidebar songs={songs} /> : <Library songs={songs} />;
};

export default GetUserSongs;
