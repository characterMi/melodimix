"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getAverageColor } from "@/features/player/lib/getAverageColor";
import { usePlayerStore } from "@/features/player/store/usePlayerStore";
import {
  type ColorEntity,
  useSongColors,
} from "@/features/player/store/useSongColors";
import { changeThemeColor } from "@/features/pwa/lib/changeThemeColor";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useLoadImage } from "@/features/song-related/hooks/useLoadImage";

import Header from "@/components/Header";
import Author from "@/features/song-related/components/Author";
import SongCover from "@/features/song-related/components/SongCover";

const PageHeader = ({ song }: { song: SongWithAuthor | null }) => {
  const { colors, setColors } = useSongColors((state) => ({
    colors: state.colors[song?.id ?? NaN],
    setColors: state.setSongColors,
  }));

  const image = useLoadImage(song);

  return (
    <Header
      className={cnWithReduceMotion("transition duration-200")}
      styles={{
        background: `linear-gradient(180deg, ${
          colors?.medium ?? "transparent"
        }, transparent)`,
      }}
    >
      <UpdateThemeColor color={colors} />

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
  );
};

const UpdateThemeColor = ({ color }: { color: ColorEntity | undefined }) => {
  const pathname = usePathname();
  const isMobilePlayerOpen = usePlayerStore(
    (state) => state.isMobilePlayerOpen,
  );

  useEffect(() => {
    if (isMobilePlayerOpen) return;

    changeThemeColor(color?.medium ?? "#171717");
  }, [pathname, color, isMobilePlayerOpen]);

  return null;
};

export default PageHeader;
