import { Suspense } from "react";
import { getSongs } from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import Loader from "@/components/Loader";
import PageContent from "./components/PageContent";

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

      <Suspense fallback={<Loader />}>
        <GetSongs />
      </Suspense>
    </main>
  );
}
