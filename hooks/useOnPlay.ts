import { Song } from "@/types/types";

import { usePlayer } from "./usePlayer";
import { useAuthModal } from "./useAuthModal";
import { useUser } from "./useUser";

export const useOnPlay = (songs: Song[]) => {
  const { setId, setIds } = usePlayer((state) => ({
    setId: state.setId,
    setIds: state.setIds,
  }));
  const authModal = useAuthModal();
  const { subscription, user } = useUser();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    setId(id);
    setIds(songs.map((song) => song.id));
  };

  return onPlay;
};

export default useOnPlay;
