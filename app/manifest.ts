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
        src: "/images/d1.png",
        sizes: "1440x900",
        type: "image/png",
        // @ts-ignore
        form_factor: "wide",
      },
      {
        src: "/images/d2.png",
        sizes: "1440x900",
        type: "image/png",
        // @ts-ignore
        form_factor: "wide",
      },
      {
        src: "/images/d3.png",
        sizes: "1440x900",
        type: "image/png",
        // @ts-ignore
        form_factor: "wide",
      },
      {
        src: "/images/1.jpg",
        sizes: "1080x2260",
        type: "image/jpg",
      },
      {
        src: "/images/2.jpg",
        sizes: "1080x2260",
        type: "image/jpg",
      },
    ],
    shortcuts: [
      {
        name: "Explore",
        short_name: "Explore",
        description: "Explore",
        url: "/",
        icons: [
          {
            src: "/icons/melodimix-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Liked Songs",
        short_name: "Liked Songs",
        description: "Liked Songs",
        url: "/liked",
        icons: [
          {
            src: "/icons/liked-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Profile",
        short_name: "Profile",
        description: "Profile",
        url: "/profile",
        icons: [
          {
            src: "/icons/profile-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    protocol_handlers: [
      {
        protocol: "web+melodimixsearch",
        url: "/search?song_title=%s",
      },
      {
        protocol: "web+melodimixlisten",
        url: "/?song_id=%s",
      },
    ],
    categories: ["Song", "Song player", "Music player", "Spotify clone"],
  };
}
