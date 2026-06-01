import { useCallback, useEffect, useRef } from "react";

import { changeThemeColor } from "@/features/player/lib/changeThemeColor";
import { usePlayerStore } from "@/features/player/store/usePlayerStore";
import { ColorEntity } from "@/features/player/store/useSongColors";

export const usePlayerSongCard = (
  colors: ColorEntity | undefined,
  defaultColor: string,
) => {
  const closeMobilePlayerButton = useRef<HTMLButtonElement>(null);
  const openMobilePlayerButton = useRef<HTMLButtonElement>(null);

  const { isMobilePlayerOpen, setIsMobilePlayerOpen } = usePlayerStore(
    (state) => ({
      isMobilePlayerOpen: state.isMobilePlayerOpen,
      setIsMobilePlayerOpen: state.setIsMobilePlayerOpen,
    }),
  );

  const openMobilePlayer = useCallback(() => {
    if (isMobilePlayerOpen) return;

    changeThemeColor(colors?.medium ?? "#000000");

    // The reason we don't use router is because the router causes reload on offline mode.
    window.history.pushState(
      { isMobilePlayerOpen: true },
      "",
      window.location.href + "?isMobilePlayerOpen=true",
    );
    setIsMobilePlayerOpen(true);
  }, [isMobilePlayerOpen, colors]);

  useEffect(() => {
    if (!isMobilePlayerOpen) return;

    closeMobilePlayerButton.current?.focus();

    const onPopState = () => {
      changeThemeColor(defaultColor);
      setIsMobilePlayerOpen(false);
      openMobilePlayerButton.current?.focus();
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [isMobilePlayerOpen, defaultColor]);

  useEffect(() => {
    if (isMobilePlayerOpen) {
      changeThemeColor(colors?.medium ?? "#000000");
    } else {
      changeThemeColor(defaultColor);
    }
  }, [isMobilePlayerOpen, colors, defaultColor]);

  return {
    isMobilePlayerOpen,
    openMobilePlayer,
    openMobilePlayerButton,
    closeMobilePlayerButton,
  };
};
