import Image from "next/image";
import { Suspense } from "react";

import { getPublicPlaylists } from "@/actions/playlist.actions";
import PlaylistImage from "@/public/images/playlist.png";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import MainContent from "@/components/MainContent";
import { PlaylistsContent } from "./PlaylistsContent";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Public Playlists",
  description: "Checkout public playlists created by other users!",
};

async function GetPlaylists() {
  const playlists = await getPublicPlaylists();

  return <PlaylistsContent initialPlaylists={playlists} />;
}

const PlaylistsPage = () => {
  return (
    <MainContent>
      <Header>
        <div className="mt-20 flex flex-col md:flex-row items-center gap-x-4">
          <div className="relative size-36 min-w-36 xss:size-40 xss:min-w-40 sm:size-44 sm:min-w-44 md:size-32 md:min-w-32 lg:size-44 lg:min-w-44 shadow-2xl">
            <Image
              src={PlaylistImage}
              alt="Public Playlists"
              width={100}
              height={100}
              className="object-cover size-36 xss:size-40 sm:size-44 md:size-32 lg:size-44"
              placeholder="blur"
              loading="eager"
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">
              Public Playlists
            </p>

            <h1 className="text-white text-4xl sm:text-7xl md:text-5xl lg:text-7xl">
              Playlists
            </h1>
          </div>
        </div>
      </Header>

      <Suspense
        fallback={
          <Loader className="flex justify-center md:px-6 md:justify-start" />
        }
      >
        <GetPlaylists />
      </Suspense>
    </MainContent>
  );
};
export default PlaylistsPage;
