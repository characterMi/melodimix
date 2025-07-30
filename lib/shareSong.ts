import toast from "react-hot-toast";

export function handleShare(title: string, artist: string) {
  if (!navigator.share) {
    toast.error("Share not supported on your browser");
    return;
  }

  navigator.share({
    title: "Melodimix - Your Ultimate Music Destination.",
    text: `Listen to ${title} by ${artist ?? "Unknown artist"} in MelodiMix!`,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}search?song_title=${title}`,
  });
}
