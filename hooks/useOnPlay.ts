import { Song } from "@/types/types";

import { usePlayerStore } from "../store/usePlayerStore";

export const useOnPlay = (songs: Song[]) => {
  const { setId, setIds } = usePlayerStore((state) => ({
    setId: state.setId,
    setIds: state.setIds,
  }));

  return (id: string) => {
    setId(id);
    setIds(songs.map((song) => song.id));
  };
};

export default useOnPlay;
