import { getArtistSongs } from "@/actions/getArtistSongs";
import { getSong } from "@/actions/getSong";
import Author from "@/components/Author";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import MainContent from "@/components/MainContent";
import { openGraph, twitter } from "@/constants";
import { getCleanParamValue } from "@/lib/getCleanParamValue";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import PageContent from "./components/PageContent";
import SongButtons from "./components/SongButtons";
import SongImage from "./components/SongImage";

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
  const title = `Listen to the ${song.title} by ${song.artist}`,
    description = `Checkout the ${song.title} by ${song.artist} and find more songs by this artist!`;

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
      <Header>
        <div className="mt-20 mb-6 flex flex-col md:flex-row items-center gap-4 overflow-hidden">
          <div className="relative size-36 min-w-36 xss:size-40 xss:min-w-40 sm:size-44 sm:min-w-44 md:size-32 md:min-w-32 lg:size-44 lg:min-w-44 shadow-2xl">
            <SongImage song={song} />
          </div>

          <div className="flex flex-col mt-4 gap-2 lg:gap-4 md:mt-0 md:text-left w-full md:truncate">
            {song && (
              <div className="hidden md:block font-semibold text-sm">
                <Author
                  name={song.author}
                  userId={song.user_id}
                  shouldHighlight
                />
              </div>
            )}

            <h1 className="text-white text-3xl xss:text-4xl sm:text-5xl md:text-4xl lg:text-5xl truncate !leading-tight font-semibold">
              {song ? song.title : "Song not found"}
            </h1>

            {song && (
              <div className="w-full flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm text-neutral-400 truncate">
                  <h2 className="truncate">{song.artist}</h2>

                  <span aria-hidden>•</span>

                  <p>{new Date(song.created_at).getFullYear()}</p>
                </div>

                <div className="block md:hidden font-semibold text-sm">
                  <Author
                    name={song.author}
                    userId={song.user_id}
                    shouldHighlight
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Header>

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
