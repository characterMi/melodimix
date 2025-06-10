import Loader from "@/components/Loader";
import { Suspense } from "react";
import PageContent from "./PageContent";
import { getPlaylistSongs } from "@/actions/getPlaylistSongs";

export async function generateMetadata({
  params,
}: {
  params: { playlistId: string };
}) {
  const { playlist } = await getPlaylistSongs(params.playlistId);

  return {
    title: `MelodiMix | ${playlist?.name} playlist`,
    description: `Browse between ${playlist?.name} playlist songs!`,
  };
}

async function GetPlaylistSongs({ playlistId }: { playlistId: string }) {
  const {
    data: songs,
    errMessage,
    playlist,
  } = await getPlaylistSongs(playlistId);

  return (
    <div className="px-4">
      <PageContent songs={songs} errMessage={errMessage} playlist={playlist} />
    </div>
  );
}

const PlaylistPage = ({ params }: { params: { playlistId: string } }) => {
  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <GetPlaylistSongs playlistId={params.playlistId} />
    </Suspense>
  );
};

export default PlaylistPage;
