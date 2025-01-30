import { Song } from "@/types/types";
import { useEffect, useState } from "react";
import { useUploadedSongs } from "../store/useUploadedSongs";
import { useUser } from "./useUser";

export function useGetUserSongs(songs: Song[]) {
  const { isLoading, user } = useUser();
  const uploadedSongs = useUploadedSongs((state) => state.uploadedSongs);

  const [userSongs, setUserSongs] = useState<Song[]>([]);

  useEffect(() => {
    (() => {
      const userSongs = songs.filter((song) => song.user_id === user?.id);

      setUserSongs(userSongs);
    })();
  }, [user, uploadedSongs]);

  if (isLoading) return { songs: [], isLoading: true };

  if (!isLoading && !user) return { songs: [], isLoading: false };

  return { songs: userSongs };
}
