import { getSongs } from "@/actions/getSongs";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import SearchInput from "@/components/SearchInput";
import { Suspense } from "react";
import SearchContent from "./SearchContent";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Search",
  description: "Search for the music You want to Listen to !",
};

async function GetSongs() {
  // i could get the search term with query params and use the getSongByTitle function to get the searched song, and i should do that in a large scale project, but in this case, i don't have lots of musics, so i just store the search term in a zustand context and i filter out all songs using the searchValue state. this way, we improved the performance by not calling the database every time user searches for something.
  const songs = await getSongs();

  return <SearchContent songs={songs} />;
}

const SearchPage = () => {
  return (
    <section className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white font-semibold text-3xl">Search</h1>

          <SearchInput />
        </div>
      </Header>

      <Suspense
        fallback={
          <Loader className="p-0 flex justify-center md:px-6 md:justify-start" />
        }
      >
        <GetSongs />
      </Suspense>
    </section>
  );
};

export default SearchPage;
