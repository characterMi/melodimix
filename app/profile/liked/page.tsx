import { getLikedSongsWithoutLimit } from "@/actions/getLikedSongs";
import PageContent from "./PageContent";

export const metadata = {
  title: "MelodiMix | Liked Songs",
  description: "Browse between Your liked Songs!",
};

const LikedPage = async () => {
  const likedSongs = await getLikedSongsWithoutLimit();

  return (
    <div className="px-4">
      <PageContent songs={likedSongs} />
    </div>
  );
};

export default LikedPage;
