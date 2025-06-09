import Loader from "@/components/Loader";
import { Suspense } from "react";
import PageContent from "./PageContent";
import { getPlaylistSongs } from "@/actions/getPlaylistSongs";

async function GetPlaylistSongs({ playlistId }: { playlistId: string }) {
  const {
    data: songs,
    errMessage,
    playlist,
  } = await getPlaylistSongs(playlistId);

  return (
    <div className="px-2">
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
