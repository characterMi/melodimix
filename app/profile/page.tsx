import { getUserSongs } from "@/actions/getUserSongs";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import PageContent from "./components/PageContent";

async function GetUserSongs() {
  const userSongs = await getUserSongs();

  return (
    <div className="px-4">
      <PageContent songs={userSongs} />
    </div>
  );
}

const ProfilePage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <GetUserSongs />
    </Suspense>
  );
};

export default ProfilePage;
