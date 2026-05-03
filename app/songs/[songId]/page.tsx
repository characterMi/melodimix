import { getArtistSongs, getSong } from "@/actions/song.actions";
import Loader from "@/components/Loader";
import MainContent from "@/components/MainContent";
import { openGraph, twitter } from "@/constants";
import { getCleanParamValue } from "@/lib/getCleanParamValue";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import PageContent from "./components/PageContent";
import PageHeader from "./components/PageHeader";
import SongButtons from "./components/SongButtons";

export async function generateMetadata({
  params,
}: {
  params: { songId: string };
}): Promise<Metadata> {
  const cleanSongId = getCleanParamValue(params.songId);
  const song = await getSong(cleanSongId);

  if (!song) {
    return {
      title: "Song not found.",
      description: "Couldn't find a song with this ID.",
    };
  }

  const supabase = createClientComponentClient();
  const songUrl = supabase.storage.from("songs").getPublicUrl(song.song_path)
    .data.publicUrl;
  const title = `Listen to ${song.title} by ${song.artist}`,
    description = `Checkout ${song.title} by ${song.artist} and find more songs by this artist!`;

  return {
    title,
    description,
    openGraph: openGraph({
      title,
      description,
      type: "music.song",
      audio: [songUrl],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}songs/${cleanSongId}`,
    }),
    twitter: twitter({
      title,
      description,
      card: "player",
      players: [
        {
          playerUrl: songUrl,
          streamUrl: songUrl,
          width: 512,
          height: 512,
        },
      ],
    }),
  };
}

async function GetArtistSongs({ artist }: { artist: string | undefined }) {
  const songs = await getArtistSongs(artist);

  return (
    <div className="p-6 mt-4">
      <PageContent songs={songs} artist={artist} />
    </div>
  );
}

const SongIdPage = async ({ params }: { params: { songId: string } }) => {
  const cleanSongId = getCleanParamValue(params.songId);
  const song = await getSong(cleanSongId);

  return (
    <MainContent>
      <PageHeader song={song} />

      {song && (
        <div className="px-6 w-full flex flex-wrap items-center gap-2 justify-between">
          <SongButtons song={song} />
        </div>
      )}

      <Suspense
        fallback={
          <Loader className="flex justify-center md:px-6 md:justify-start" />
        }
      >
        <GetArtistSongs artist={song?.artist} />
      </Suspense>
    </MainContent>
  );
};

export default SongIdPage;
