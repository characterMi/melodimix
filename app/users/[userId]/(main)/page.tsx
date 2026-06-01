import { getUserSongs } from "@/features/song-related/actions";

import PageContent from "./components/PageContent";

const UsersPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  let songs: Song[];

  try {
    songs = await getUserSongs({ userId, limit: 20, offset: 0 });
  } catch {
    songs = [];
  }

  return <PageContent initialSongs={songs} userId={userId} />;
};

export default UsersPage;
