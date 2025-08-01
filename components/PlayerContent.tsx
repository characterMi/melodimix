import { TbMusicShare } from "react-icons/tb";

import { usePlayer } from "@/hooks/usePlayer";
import { handleShare } from "@/lib/shareSong";

import Duration from "./Duration";
import LikeButton from "./LikeButton";
import PlayerControls from "./PlayerControls";
import PlayerSongCard from "./PlayerSongCard";
import PlayerTypeButton from "./PlayerTypeButton";
import Slider from "./Slider";

import type { Song } from "@/types";

const PlayerContent = ({
  song,
  songUrl,
  isSongLoading,
}: {
  song: Song;
  songUrl: string;
  isSongLoading: boolean;
}) => {
  const { handlers, icons, sound, state } = usePlayer(song, songUrl);

  const { handleChangePlayerType, handlePlay, onPlaySong, toggleMute } =
    handlers;
  const { PauseOrPlayIcon, PlayerTypeIcon, VolumeIcon } = icons;
  const { isSoundLoading, isMusicPlaying, playerType } = state;

  return (
    <>
      <Duration song={sound.song} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-full relative">
        <PlayerSongCard
          song={song}
          songUrl={songUrl}
          handleChangePlayerType={handleChangePlayerType}
          playerType={playerType}
          playerTypeIcon={PlayerTypeIcon}
        >
          <div className="flex items-center justify-between gap-1">
            <div
              className="flex flex-col gap-1 overflow-hidden w-full"
              aria-live="polite"
            >
              <h3 className="text-2xl xss:text-3xl font-semibold truncate">
                {song.title}
              </h3>
              <p className="text-xs xss:text-sm font-thin opacity-80 truncate">
                {song.artist}
              </p>
            </div>

            <button
              aria-label="Share the song"
              onClick={() => handleShare(song.title, song.artist)}
              className="cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition hidden xss:block"
            >
              <TbMusicShare size={28} aria-hidden />
            </button>
          </div>

          <Duration song={sound.song} isMobilePlayer />

          <div className="w-full flex items-center justify-between">
            <LikeButton song={song} size="lg" />

            <PlayerControls
              isMobilePlayer
              isSongLoading={isSongLoading}
              onPlaySong={onPlaySong}
              handlePlay={handlePlay}
              isMusicPlaying={isMusicPlaying}
              isSoundLoading={isSoundLoading}
              icon={PauseOrPlayIcon}
            />

            <PlayerTypeButton
              handleChangePlayerType={handleChangePlayerType}
              icon={PlayerTypeIcon}
              playerType={playerType}
            />
          </div>
        </PlayerSongCard>

        <PlayerControls
          isSongLoading={isSongLoading}
          onPlaySong={onPlaySong}
          handlePlay={handlePlay}
          isMusicPlaying={isMusicPlaying}
          isSoundLoading={isSoundLoading}
          icon={PauseOrPlayIcon}
        />

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <button
              className="cursor-pointer outline-none hover:opacity-50 focus-visible:opacity-50 transition-opacity"
              onClick={toggleMute}
              aria-label={sound.volume === 0 ? "Unmute" : "Mute"}
              aria-pressed={sound.volume !== 0}
            >
              <VolumeIcon size={24} aria-hidden />
            </button>

            <Slider
              value={sound.volume}
              onChange={(value) => sound.setVolume(value)}
              bgColor="bg-white"
              max={1}
              step={0.1}
              label="Volume"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerContent;
