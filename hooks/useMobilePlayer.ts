import { usePlayerStore } from "@/store/usePlayerStore";
import { useCallback } from "react";

export const useMobilePlayer = () => {
  const { isMobilePlayerOpen, setIsMobilePlayerOpen } = usePlayerStore(
    (state) => ({
      isMobilePlayerOpen: state.isMobilePlayerOpen,
      setIsMobilePlayerOpen: state.setIsMobilePlayerOpen,
    })
  );

  const openMobilePlayer = useCallback(() => {
    if (isMobilePlayerOpen) return;

    const url = new URL(window.location.href);

    url.searchParams.set("isMobilePlayerOpen", "true");

    // The reason we don't use router is because the router causes reload on offline mode.
    window.history.pushState({ isMobilePlayerOpen: true }, "", url);
    setIsMobilePlayerOpen(true);
  }, [isMobilePlayerOpen]);

  return { isMobilePlayerOpen, setIsMobilePlayerOpen, openMobilePlayer };
};
