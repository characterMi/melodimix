import { getPublicPlaylists } from "@/actions/playlist.actions";
import { getSongs } from "@/actions/song.actions";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import MainContent from "@/components/MainContent";
import { Suspense } from "react";
import SearchBox from "./SearchBox";
import SearchContent from "./SearchContent";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Search",
  description: "Search for playlists and the music you want to listen to !",
};

async function GetSongs() {
  // Initial data
  const [songs, playlists] = await Promise.all([
    getSongs(/* limit= */ 20),
    getPublicPlaylists(),
  ]);

  return <SearchContent songs={songs} playlists={playlists} />;
}

const SearchPage = () => (
  <MainContent>
    <Header className="from-bg-neutral-900">
      <div className="mb-2 flex flex-col gap-y-6">
        <h1 className="text-white font-semibold text-3xl">Search</h1>

        <SearchBox />
      </div>
    </Header>

    <Suspense
      fallback={
        <Loader className="flex justify-center md:px-6 md:justify-start" />
      }
    >
      <GetSongs />
    </Suspense>
  </MainContent>
);

export default SearchPage;
