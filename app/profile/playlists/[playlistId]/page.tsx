import { getPlaylistSongs } from "@/actions/getPlaylistSongs";
import PageContent from "./PageContent";

export async function generateMetadata({
  params,
}: {
  params: { playlistId: string };
}) {
  const { playlist } = await getPlaylistSongs(params.playlistId);

  return {
    title: `MelodiMix | ${
      playlist ? `${playlist.name} playlist` : "Playlist not found"
    }`,
    description: playlist
      ? `Browse between ${playlist.name} playlist songs!`
      : "Couldn't find a playlist with this ID.",
  };
}

const PlaylistPage = async ({ params }: { params: { playlistId: string } }) => {
  const {
    data: songs,
    errMessage,
    playlist,
  } = await getPlaylistSongs(params.playlistId);

  return (
    <div className="px-4">
      <PageContent songs={songs} errMessage={errMessage} playlist={playlist} />
    </div>
  );
};

export default PlaylistPage;
