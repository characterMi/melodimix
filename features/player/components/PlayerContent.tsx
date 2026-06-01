import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { TbMusicShare } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import { defaultColors } from "@/constants";
import { usePlayer } from "@/features/player/hooks/usePlayer";
import { getAverageColor } from "@/features/player/lib/getAverageColor";
import { useSongColors } from "@/features/player/store/useSongColors";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { shareSong } from "@/lib/share";

import Slider from "../../../components/Slider";
import LikeButton from "../../like-song/components/LikeButton";
import Duration from "./Duration";
import PlayerControls from "./PlayerControls";
import PlayerSongCard from "./PlayerSongCard";
import PlayerTypeButton from "./PlayerTypeButton";

const PlayerContent = ({
  song,
  songUrl,
  isSongLoading,
}: {
  song: Song;
  songUrl: string;
  isSongLoading: boolean;
}) => {
  const { colors, setColors } = useSongColors((state) => ({
    setColors: state.setSongColors,
    colors: state.colors[song.id],
  }));

  const { handlers, sound, state } = usePlayer(song, songUrl);

  const { handlePlay, onPlaySong, toggleMute } = handlers;
  const { isSoundLoading, isMusicPlaying, playerType } = state;

  return (
    <>
      <Duration song={sound.song} hasShortcut />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-full relative">
        <PlayerSongCard
          song={song}
          songUrl={songUrl}
          playerType={playerType}
          colors={colors}
          onLoad={(e) => setColors(song.id, getAverageColor(e.currentTarget))}
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
              onClick={() => shareSong(song.title, song.artist, song.id)}
              className={twMerge(
                "cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none hidden xss:block z-[1]",
                !shouldReduceMotion && "transition-opacity",
              )}
            >
              <TbMusicShare size={28} aria-hidden />
            </button>
          </div>

          <Duration song={sound.song} colors={colors} isMobilePlayer />

          <div className="w-full flex items-center justify-between z-[1]">
            <LikeButton
              song={song}
              size="lg"
              color={colors?.dark ?? defaultColors.dark}
            />

            <PlayerControls
              isMobilePlayer
              isSongLoading={isSongLoading || isSoundLoading}
              onPlaySong={onPlaySong}
              handlePlay={handlePlay}
              isMusicPlaying={isMusicPlaying}
            />

            <PlayerTypeButton playerType={playerType} />
          </div>
        </PlayerSongCard>

        <PlayerControls
          isSongLoading={isSongLoading || isSoundLoading}
          onPlaySong={onPlaySong}
          handlePlay={handlePlay}
          isMusicPlaying={isMusicPlaying}
        />

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeButton toggleMute={toggleMute} volume={sound.volume} />

            <Slider
              value={sound.volume}
              onChange={(value) => sound.setVolume(value)}
              bgColor="#FFFFFF"
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

const VolumeButton = ({
  toggleMute,
  volume,
}: {
  toggleMute: () => void;
  volume: number;
}) => {
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  return (
    <button
      className={twMerge(
        "cursor-pointer outline-none hover:opacity-50 focus-visible:opacity-50",
        !shouldReduceMotion && "transition-opacity",
      )}
      onClick={toggleMute}
      aria-label={volume === 0 ? "Unmute" : "Mute"}
      aria-pressed={volume !== 0}
    >
      <VolumeIcon size={24} aria-hidden />
    </button>
  );
};

export default PlayerContent;
