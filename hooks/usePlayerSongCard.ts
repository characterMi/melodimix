import { changeThemeColor } from "@/lib/changeThemeColor";
import { usePlayerStore } from "@/store/usePlayerStore";
import { ColorEntity } from "@/store/useSongColors";
import { useCallback, useEffect, useRef } from "react";

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

    changeThemeColor(colors?.medium ?? defaultColor);

    // The reason we don't use router is because the router causes reload on offline mode.
    window.history.pushState(
      { isMobilePlayerOpen: true },
      "",
      window.location.href + "?isMobilePlayerOpen=true",
    );
    setIsMobilePlayerOpen(true);
  }, [isMobilePlayerOpen, colors, defaultColor]);

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

  return {
    isMobilePlayerOpen,
    openMobilePlayer,
    openMobilePlayerButton,
    closeMobilePlayerButton,
  };
};
