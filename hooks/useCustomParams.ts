import { useEffect } from "react";

const getCleanParamValue = (value: string) => {
  const decoded = decodeURIComponent(value);

  // Protocol handlers...
  const parts = decoded.split("://");
  return parts.length > 1 ? parts[1].replace(/\/$/, "") : decoded;
};

export const useCustomParams = (
  type: "search" | "listen",
  handler: (newValue: string) => void
) => {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (type === "search") {
      const songTitle = searchParams.get("song_title");
      if (!songTitle) return;

      handler(getCleanParamValue(songTitle));

      return;
    }

    // type === "listen"
    const songId = searchParams.get("song_id");
    if (!songId) return;

    const newValue = getCleanParamValue(songId);
    if (isNaN(Number(newValue))) return;

    handler(newValue);
  }, []);
};
