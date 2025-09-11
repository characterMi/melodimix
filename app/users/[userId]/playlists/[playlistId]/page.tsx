import { getPlaylistSongs } from "@/actions/song.actions";
import { openGraph, twitter } from "@/constants";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import PageContent from "./PageContent";

export async function generateMetadata({
  params,
}: {
  params: { userId: string; playlistId: string };
}): Promise<Metadata> {
  const { playlist, data } = await getPlaylistSongs(
    params.playlistId,
    params.userId
  );

  if (!playlist) {
    return {
      title: "Playlist not found",
      description: "Couldn't find a playlist with this ID.",
    };
  }

  const supabase = createClientComponentClient();

  const title = `${playlist.name} by ${playlist.author || "a User"}`,
    description = `Checkout the "${playlist.name}" playlist by ${
      playlist.author || "a User"
    }`;
  const songs = data.map((song, index) => {
    return {
      url: supabase.storage.from("songs").getPublicUrl(song.song_path).data
        .publicUrl,
      username: song.author,
      disc: 1,
      track: index + 1,
    };
  });

  return {
    title,
    description,
    openGraph: openGraph({
      title,
      description,
      type: "music.playlist",
      creators: [`${process.env.NEXT_PUBLIC_BASE_URL}users/${params.userId}`],
      songs,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/${params.userId}/playlists/${params.playlistId}`,
    }),
    twitter: twitter({
      title,
      description,
    }),
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
