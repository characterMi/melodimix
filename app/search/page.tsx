import { FC, Suspense } from "react";
import { getSongsByTitle } from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "@/components/SearchContent";
import Loader from "@/components/Loader";

interface SearchPageProps {
  searchParams: {
    title: string;
  };
}

async function GetSongs({ title }: { title: string }) {
  const songs = await getSongsByTitle(title);

  return <SearchContent songs={songs} />;
}

const SearchPage: FC<SearchPageProps> = ({ searchParams: { title } }) => {
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
        <GetSongs title={title} />
      </Suspense>
    </section>
  );
};

export default SearchPage;
