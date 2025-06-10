import { getLikedSongsWithoutLimit } from "@/actions/getLikedSongs";
import Loader from "@/components/Loader";
import PageContent from "./PageContent";
import { Suspense } from "react";

export const metadata = {
  title: "MelodiMix | Liked Songs",
  description: "Browse between Your liked Songs!",
};

async function GetLikedSongs() {
  const likedSongs = await getLikedSongsWithoutLimit();

  return (
    <div className="px-4">
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
