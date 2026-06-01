"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FaShareAlt } from "react-icons/fa";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useLoadImage } from "@/features/song-related/hooks/useLoadImage";
import { shareSong } from "@/lib/share";

import Author from "@/features/song-related/components/Author";
import PlayButton from "@/features/song-related/components/PlayButton";
import SongCover from "@/features/song-related/components/SongCover";

interface Props {
  data: SongWithAuthor;
  onClick: (id: number) => void;
}

const SongCard = ({ data, onClick }: Props) => {
  const imagePath = useLoadImage(data);

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    shareSong(data.title, data.artist, data.id);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      shareSong(data.title, data.artist, data.id);
    }
  }

  return (
    <button
      onClick={() => onClick(data.id)}
      className={cnWithReduceMotion(
        "relative group transition-colors flex flex-col text-left rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 focus-visible:bg-neutral-400/10 outline-none p-3",
      )}
      aria-label={"Play the " + data.title + " song"}
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden bg-neutral-950">
        <SongCover
          src={imagePath || "/images/song.png"}
          alt={"Cover art for: " + data.title}
          width={130}
          height={130}
          className="w-full"
        />
      </div>

      <div className="absolute bottom-24 right-5">
        <div
          className={cnWithReduceMotion(
            "opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md translate-y-2/4 group-hover:opacity-100 group-hover:-translate-y-2/4 hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:-translate-y-2/4 focus-visible:opacity-100 focus-visible:translate-y-3/4 focus-visible:scale-105 outline-none transition delay-75",
          )}
          aria-label="Share the song"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
        >
          <FaShareAlt className="text-black" />
        </div>

        <SongPageLink song={data} />
      </div>

      <div className="flex flex-col items-start w-full py-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.title} - {data.artist ?? "Unknown artist"}
        </p>

        <div className="text-neutral-400 text-sm pt-1 w-full truncate flex items-center gap-1">
          By <Author name={data.author} userId={data.user_id} shouldHighlight />
        </div>
      </div>
    </button>
  );
};

const SongPageLink = ({ song }: { song: Song }) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      router.push(`/songs/${song.id}`, { scroll: false });
    });
  };

  return (
    <PlayButton
      className={cnWithReduceMotion(
        "opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md translate-y-1/4 group-hover:opacity-100 group-hover:-translate-y-1/4 group-focus-visible:opacity-100 group-focus-visible:-translate-y-1/4 transition focus-visible:-translate-y-1/4 focus-visible:opacity-100",
        isLoading && "p-3",
      )}
      aria-label={`Go to the ${song.title} page`}
      onClick={onClick}
      role="link"
    >
      {isLoading && (
        <div
          aria-label="Loading..."
          className="size-full rounded-full animate-spin after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:size-2/3 after:bg-green-500 after:rounded-full"
          style={{
            backgroundImage: "conic-gradient(#22c55e 20%, #000000)",
          }}
        />
      )}
    </PlayButton>
  );
};

export default SongCard;
