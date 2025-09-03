import { Song } from "@/types";

import { usePlayerStore } from "../store/usePlayerStore";

export const useOnPlay = (songs: Song[]) => {
  const { setId, setIds } = usePlayerStore((state) => ({
    setId: state.setId,
    setIds: state.setIds,
  }));

  return (id: number) => {
    setId(id);
    setIds(songs.map((song) => song.id));
  };
};

export default useOnPlay;
