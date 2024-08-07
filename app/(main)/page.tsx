import { getSongs } from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import Loader from "@/components/Loader";
import { Suspense } from "react";
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
    <main className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome back</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              img="/images/liked.png"
              href="/liked"
              name="Liked Songs"
            />
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
    </main>
  );
}
