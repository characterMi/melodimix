import { getUserById } from "@/actions/getUserById";
import { getUserPlaylists } from "@/actions/getUserPlaylists";
import Loader from "@/components/Loader";
import { Playlist } from "@/types";
import { Suspense } from "react";
import PageContent from "./components/PageContent";

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

async function GetUserPlaylists({ userId }: { userId: string }) {
  const { author, playlists } = (await getUserPlaylists(userId)) as {
    playlists: Playlist[];
    author: string;
  };

  return <PageContent playlists={playlists} author={author} />;
}

const UsersPlaylistPage = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  return (
    <main className="w-full p-6">
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center">
            <Loader />
          </div>
        }
      >
        <GetUserPlaylists userId={userId} />
      </Suspense>
    </main>
  );
};

export default UsersPlaylistPage;
