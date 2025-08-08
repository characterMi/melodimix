import toast from "react-hot-toast";

export function shareSong(title: string, artist: string, id: string) {
  if (!navigator.share) {
    toast.error("Share not supported on your browser");
    return;
  }

  navigator.share({
    title: "Melodimix - Your Ultimate Music Destination.",
    text: `Listen to ${title} by ${artist ?? "Unknown artist"} in MelodiMix!`,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}songs/${id}`,
  });
}

export function sharePlaylist(name: string, author: string) {
  if (!navigator.share) {
    toast.error("Share not supported on your browser");
    return;
  }

  navigator.share({
    title: "Melodimix - Your Ultimate Music Destination.",
    text: `Checkout ${name} playlist by ${
      author === "Guest" ? "a User" : author
    } in MelodiMix!`,
    url: window.location.href,
  });
}
