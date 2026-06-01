import { getUserPlaylists } from "@/features/playlist/actions";
import { getUserById } from "@/features/user-related/actions";

import PageContent from "./PageContent";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserById(params.userId);

  return {
    title: user ? `${user.name || "Guest"}'s playlists` : "User not found",
    description: user
      ? `Checkout the ${user.name || "Guest"}'s playlists!`
      : "Couldn't find a user with this ID.",
  };
}

const UsersPlaylistPage = async ({
  params,
}: {
  params: { userId: string };
}) => {
  const { userId } = params;
  const { author, playlists } = (await getUserPlaylists(userId)) as {
    playlists: Playlist[];
    author: string;
  };

  return <PageContent playlists={playlists} author={author} />;
};

export default UsersPlaylistPage;
