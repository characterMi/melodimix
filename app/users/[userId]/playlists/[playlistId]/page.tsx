import { getPlaylistSongs } from "@/actions/getPlaylistSongs";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import PageContent from "./PageContent";

export async function generateMetadata({
  params,
}: {
  params: { userId: string; playlistId: string };
}) {
  const { data, errMessage, playlist } = await getPlaylistSongs(
    params.playlistId,
    params.userId
  );

  return {
    title: playlist
      ? `${playlist.name} by ${playlist.author || "a User"}`
      : "Playlist not found",
    description: playlist
      ? `Checkout the ${playlist.name} by ${playlist.author || "a User"}`
      : "Couldn't find a playlist with this ID.",
  };
}

async function GetPlaylistSongs({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) {
  const { data, errMessage, playlist } = await getPlaylistSongs(
    playlistId,
    userId
  );

  return (
    <PageContent songs={data} errMessage={errMessage} playlist={playlist} />
  );
}

const UsersPlaylistPage = ({
  params,
}: {
  params: { userId: string; playlistId: string };
}) => {
  const { userId, playlistId } = params;

  return (
    <main className="w-full p-6">
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center">
            <Loader />
          </div>
        }
      >
        <GetPlaylistSongs userId={userId} playlistId={playlistId} />
      </Suspense>
    </main>
  );
};

export default UsersPlaylistPage;
