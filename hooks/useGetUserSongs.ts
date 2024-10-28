import { Song } from "@/types/types";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export function useGetUserSongs(songs: Song[]) {
  const { isLoading, user } = useUser();

  const [userSongs, setUserSongs] = useState<Song[]>([]);

  useEffect(() => {
    (() => {
      const userSongs = songs.filter((song) => song.user_id === user?.id);

      setUserSongs(userSongs);
    })();
  }, [user]);

  if (isLoading) return { songs: [], isLoading: true };

  if (!isLoading && !user) return { songs: [], isLoading: false };

  return { songs: userSongs };
}
