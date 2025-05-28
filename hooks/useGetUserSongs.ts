import { Song } from "@/types/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useUploadedSongs } from "../store/useUploadedSongs";

export function useGetUserSongs(songs: Song[]) {
  const { isLoading, session } = useSessionContext();
  const uploadedSongs = useUploadedSongs((state) => state.uploadedSongs);
  const user = session?.user;

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
