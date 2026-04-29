"use client";

import { useRouter } from "next/navigation";

import useOnPlay from "@/hooks/useOnPlay";
import { useSearchData } from "@/hooks/useSearchData";

import FlipArrow from "@/components/FlipArrow";
import PlaylistItem from "@/components/PlaylistItem";
import NoDataFallback from "../../components/NoSongFallback";
import SongItem from "../../components/SongItem";

import type { Playlist, SongWithAuthor } from "@/types";

const SearchContent = ({
  songs,
  playlists,
}: {
  songs: SongWithAuthor[];
  playlists: Playlist[];
}) => {
  const { searchResult, isSearching, searchingFor } = useSearchData(
    {
      songs,
      playlists,
    },
    true
  );

  if (searchResult.length === 0)
    return (
      <NoDataFallback
        className="px-10"
        showButton={false}
        fallbackText="There is no results for given query."
      />
    );

  const componentToRender =
    searchingFor === "songs" ? (
      <SongResults
        key={searchingFor}
        filteredSongs={searchResult as SongWithAuthor[]}
      />
    ) : (
      <PlaylistResults
        key={searchingFor}
        playlists={searchResult as Playlist[]}
      />
    );

  return (
    <div
      className="flex flex-col gap-y-2 w-full px-6"
      aria-busy={isSearching}
      aria-label={isSearching ? "Searching..." : undefined}
    >
      {isSearching ? <Skeleton /> : componentToRender}
    </div>
  );
};

const Skeleton = () => {
  return Array(10)
    .fill(null)
    .map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2" aria-hidden>
        <span className="min-w-12 h-12 bg-neutral-800 animate-pulse rounded-md" />

        <div className="flex flex-col gap-3">
          <span
            className="min-w-16 h-3 bg-neutral-800 animate-pulse rounded-full"
            style={{ width: ~~(Math.random() * 200) + "px" }}
          />

          <span
            className="min-w-14 h-3 bg-neutral-800 animate-pulse rounded-full"
            style={{ width: ~~(Math.random() * 100) + "px" }}
          />
        </div>
      </div>
    ));
};

const SongResults = ({
  filteredSongs,
}: {
  filteredSongs: SongWithAuthor[];
}) => {
  const onPlay = useOnPlay(filteredSongs);

  const router = useRouter();

  return filteredSongs.map((song) => (
    <div key={song.id} className="flex items-center gap-x-4 w-full group">
      <div className="flex-1 overflow-hidden">
        <SongItem
          onClick={(id) => onPlay(id)}
          data={song}
          shouldRunAnimationIfCurrentlyPlaying={false}
        />
      </div>

      <FlipArrow
        onClick={() => router.push(`/songs/${song.id}`, { scroll: false })}
        role="link"
        label={`Go to the ${song.title} song page`}
      />
    </div>
  ));
};

const PlaylistResults = ({ playlists }: { playlists: Playlist[] }) => {
  return playlists.map((playlist) => (
    <PlaylistItem
      firstSongId={playlist.song_ids[0]}
      playlist={playlist}
      key={playlist.id}
    />
  ));
};

export default SearchContent;
