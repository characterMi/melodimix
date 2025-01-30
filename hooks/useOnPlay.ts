import { Song } from "@/types/types";

import { usePlayerStore } from "../store/usePlayerStore";

export const useOnPlay = (songs: Song[]) => {
  const { setId, setIds } = usePlayerStore((state) => ({
    setId: state.setId,
    setIds: state.setIds,
  }));

  const onPlay = (id: string) => {
    setId(id);
    setIds(songs.map((song) => song.id));
  };

  return onPlay;
};

export default useOnPlay;
