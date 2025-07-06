import { getPlaylistSongs } from "@/actions/getPlaylistSongs";
import PageContent from "./PageContent";

export async function generateMetadata({
  params,
}: {
  params: { userId: string; playlistId: string };
}) {
  const { playlist } = await getPlaylistSongs(params.playlistId, params.userId);

  return {
    title: playlist
      ? `${playlist.name} by ${playlist.author || "a User"}`
      : "Playlist not found",
    description: playlist
      ? `Checkout the ${playlist.name} by ${playlist.author || "a User"}`
      : "Couldn't find a playlist with this ID.",
  };
}

const UsersPlaylistPage = async ({
  params,
}: {
  params: { userId: string; playlistId: string };
}) => {
  const { userId, playlistId } = params;
  const { data, errMessage, playlist } = await getPlaylistSongs(
    playlistId,
    userId
  );

  return (
    <PageContent songs={data} errMessage={errMessage} playlist={playlist} />
  );
};

export default UsersPlaylistPage;
