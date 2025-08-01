import { useCustomParams } from "@/hooks/useCustomParams";
import { useMobilePlayer } from "@/hooks/useMobilePlayer";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useCallback } from "react";

const SongInitializer = () => {
  const setId = usePlayerStore((state) => state.setId);
  const { openMobilePlayer } = useMobilePlayer();

  const handler = useCallback((songId: string) => {
    setId(songId);
    openMobilePlayer();
  }, []);

  useCustomParams("listen", handler);

  return null;
};

export default SongInitializer;
