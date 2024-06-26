import { Manifest } from "next/dist/lib/metadata/types/manifest-types";

export default function manifest(): Manifest {
  return {
    name: "MelodiMix",
    short_name: "MelodiMix",
    description:
      "MelodiMix: Your Ultimate Music Destination. Discover personalized playlists, seamless streaming, and a vibrant music community. Join us today for the perfect soundtrack to every moment.",
    start_url: ".",
    orientation: "portrait",
    theme_color: "#065f46",
    display: "standalone",
    scope: ".",
    icons: [
      {
        src: "/icons/melodimix-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/melodimix-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/melodimix-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/melodimix-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    background_color: "#171717",
    screenshots: [
      {
        src: "/images/melodi-mix_first.png",
        sizes: "800x500",
        type: "image/png",
        // @ts-ignore
        form_factor: "wide",
      },
      {
        src: "/images/melodi-mix_responsive.png",
        sizes: "380x825",
        type: "image/png",
      },
    ],
  };
}
