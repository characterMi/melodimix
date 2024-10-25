import { Song } from "@/types/types";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export function useGetUserSongs(songs: Song[]) {
  const { isLoading: isUserLoading, user } = useUser();

  if (isUserLoading) return { songs: [], isLoading: true };

  if (!isUserLoading && !user) return { songs: [], isLoading: false };

  const [userSongs, setUserSongs] = useState<Song[]>([]);

  useEffect(() => {
    (() => {
      const userSongs = songs.filter((song) => song.user_id === user?.id);

      setUserSongs(userSongs);
    })();
  }, [user]);

  return { songs: userSongs };
}
