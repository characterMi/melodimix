import { getUserSongs } from "@/actions/getUserSongs";
import PageContent from "./PageContent";

export const metadata = {
  title: "Profile",
  description: "Browse between Your Playlists!",
};

const ProfilePage = async () => {
  const userSongs = await getUserSongs(null);

  return (
    <div className="px-4">
      <PageContent songs={userSongs} />
    </div>
  );
};

export default ProfilePage;
