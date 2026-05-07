"use client";

import { twMerge } from "tailwind-merge";

import { useLoadImage } from "@/hooks/useLoadImage";
import { getAverageColor } from "@/lib/getAverageColor";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useSongColors } from "@/store/useSongColors";

import Author from "@/components/Author";
import Header from "@/components/Header";
import SongCover from "@/components/SongCover";

import type { SongWithAuthor } from "@/types";
import Head from "next/head";

const PageHeader = ({ song }: { song: SongWithAuthor | null }) => {
  const { colors, setColors } = useSongColors((state) => ({
    colors: state.colors[song?.id ?? NaN],
    setColors: state.setSongColors,
  }));

  const image = useLoadImage(song);

  return (
    <>
      <Head>
        <meta name="theme-color" content={colors?.medium ?? "#065f46"} />
      </Head>

      <Header
        className={twMerge(!shouldReduceMotion && "transition duration-200")}
        styles={{
          background: `linear-gradient(180deg, ${
            colors?.medium ?? "transparent"
          }, transparent)`,
        }}
      >
        <div className="mt-20 mb-6 flex flex-col md:flex-row items-center gap-4 overflow-hidden">
          <div className="relative size-36 min-w-36 xss:size-40 xss:min-w-40 sm:size-44 sm:min-w-44 md:size-32 md:min-w-32 lg:size-44 lg:min-w-44 shadow-2xl">
            <SongCover
              src={image || "/images/song.png"}
              alt={song ? `${song.title} image` : "Couldn't find the song!"}
              width={500}
              height={500}
              className="object-cover size-36 xss:size-40 sm:size-44 md:size-32 lg:size-44"
              loading="eager"
              onLoad={
                colors
                  ? undefined
                  : (e) => {
                      if (!song) return;

                      setColors(song.id, getAverageColor(e.currentTarget));
                    }
              }
            />
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
    </>
  );
};

export default PageHeader;
