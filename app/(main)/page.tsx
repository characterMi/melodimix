import { getSongs } from "@/actions/getSongs";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import LikedImage from "@/public/images/liked.png";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FaPlay } from "react-icons/fa";
import PageContent from "./components/PageContent";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Home page",
  description:
    "MelodiMix: Your Ultimate Music Destination. Discover personalized playlists, seamless streaming, and a vibrant music community. Join us today for the perfect soundtrack to every moment.",
};

async function GetSongs() {
  const songs = await getSongs();

  return (
    <div className="px-6">
      <PageContent songs={songs} />
    </div>
  );
}

export default async function Home() {
  return (
    <section className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome back</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <Link
              href={"/liked"}
              className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4"
            >
              <div className="relative min-h-[64px] min-w-[64px]" aria-hidden>
                <Image
                  src={LikedImage}
                  alt="Liked musics"
                  className="object-cover size-16"
                  width={64}
                  height={64}
                  placeholder="blur"
                />
              </div>

              <p className="font-medium truncate py-5">Liked Songs</p>

              <div
                className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-105"
                aria-hidden
              >
                <FaPlay className="text-black" />
              </div>
            </Link>
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Newest Songs</h1>
        </div>
      </div>

      <Suspense
        fallback={
          <Loader className="p-0 flex justify-center md:px-6 md:justify-start" />
        }
      >
        <GetSongs />
      </Suspense>
    </section>
  );
}
