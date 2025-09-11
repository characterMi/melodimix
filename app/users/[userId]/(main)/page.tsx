import { getUserSongs } from "@/actions/song.actions";
import type { Song } from "@/types";
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
