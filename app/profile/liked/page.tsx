import { getLikedSongsWithoutLimit } from "@/actions/getLikedSongs";
import Loader from "@/components/Loader";
import PageContent from "./PageContent";
import { Suspense } from "react";

async function GetLikedSongs() {
  const likedSongs = await getLikedSongsWithoutLimit();

  return (
    <div className="px-2">
      <PageContent songs={likedSongs} />
    </div>
  );
}

const LikedPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <GetLikedSongs />
    </Suspense>
  );
};

export default LikedPage;
