import { Suspense } from "react";
import Image from "next/image";
import { getLikedSongs } from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { LikedContent } from "./components/LikedContent";

export const metadata = {
  title: "MelodiMix | Liked Songs",
  description: "Browse between Your liked Songs !",
};

async function GetSongs() {
  const songs = await getLikedSongs();

  return <LikedContent songs={songs} />;
}

const LikedSongsPage = () => {
  return (
    <div className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-4">
            <div className="relative size-32 lg:size-44">
              <Image
                src="/images/liked.png"
                alt="Liked Songs"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>

              <h1 className="text-white text-4xl sm:text-7xl">Liked Songs</h1>
            </div>
          </div>
        </div>
      </Header>

      <Suspense
        fallback={
          <Loader className="p-0 flex justify-center md:px-6 md:justify-start" />
        }
      >
        <GetSongs />
      </Suspense>
    </div>
  );
};
export default LikedSongsPage;
