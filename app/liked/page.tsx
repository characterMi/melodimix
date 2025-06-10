import { getLikedSongs } from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import LikedImage from "@/public/images/liked.png";
import Image from "next/image";
import { Suspense } from "react";
import { LikedContent } from "./components/LikedContent";
import type { Song } from "@/types";

export const metadata = {
  title: "Liked Songs",
  description: "Browse between Your liked Songs !",
};

async function GetSongs() {
  let songs: Song[];

  try {
    songs = await getLikedSongs();
  } catch {
    songs = [];
  }

  return <LikedContent initialSongs={songs} />;
}

const LikedSongsPage = () => {
  return (
    <section className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20 flex flex-col md:flex-row items-center gap-x-4">
          <div
            className="relative size-32 lg:size-44"
            aria-labelledby="like-title"
          >
            <Image
              src={LikedImage}
              alt="Liked Songs"
              width={100}
              height={100}
              className="object-cover size-32 lg:size-44"
              placeholder="blur"
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">Playlist</p>

            <h1
              className="text-white text-4xl sm:text-7xl md:text-5xl lg:text-7xl"
              id="like-title"
            >
              Liked Songs
            </h1>
          </div>
        </div>
      </Header>

      <Suspense
        fallback={
          <Loader className="flex justify-center md:px-6 md:justify-start" />
        }
      >
        <GetSongs />
      </Suspense>
    </section>
  );
};
export default LikedSongsPage;
