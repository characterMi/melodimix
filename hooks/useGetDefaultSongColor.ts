import { defaultColors } from "@/constants";
import { useSongColors } from "@/store/useSongColors";
import { usePathname } from "next/navigation";

export const useGetDefaultSongColor = () => {
  const pathname = usePathname();
  const isInSongsPage = pathname.startsWith("/songs/");
  const defaultColor = useSongColors((state) => {
    if (isInSongsPage) {
      return (
        state.colors[Number(pathname.split("/").pop()) || -1]?.medium ||
        defaultColors.medium
      );
    }

    return defaultColors.medium;
  });

  return defaultColor;
};
