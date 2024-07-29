"use client";

import { useGetUserSongs } from "@/hooks/useGetUserSongs";
import { Song } from "@/types/types";
import Library from "./Library";
import Loader from "./Loader";
import MobileSidebar from "./MobileSidebar";

interface Props {
  allSongs: Song[];
  isMobile?: boolean;
}

const UserSongs = ({ allSongs, isMobile }: Props) => {
  // again, because we don't have a lot of songs, we get all songs and we filter them out by user.id, in a large scale project, we would want to use the getSongsByUserId function.
  const { isLoading, songs } = useGetUserSongs(allSongs);

  if (isLoading && !isMobile)
    return <Loader className="flex justify-center w-full mt-5" />;

  return isMobile ? <MobileSidebar songs={songs} /> : <Library songs={songs} />;
};

export default UserSongs;
