import { usePlayer } from "@/hooks/usePlayer";
import type { Song } from "@/types/types";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import Duration from "./Duration";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import SongItem from "./SongItem";

const PlayerContent = ({ song, songUrl }: { song: Song; songUrl: string }) => {
  const { handlers, icons, sound, state } = usePlayer(song, songUrl);

  const { handleChangePlayerType, handlePlay, onPlaySong, toggleMute } =
    handlers;
  const { PauseOrPlayIcon, PlayerTypeIcon, VolumeIcon } = icons;
  const { isMusicLoading, isMusicPlaying, playerType } = state;

  return (
    <>
      <Duration duration={sound.duration || 0} song={sound.song} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-full relative">
        <div className="flex w-full justify-start relative">
          <div className="flex items-center gap-x-4 w-full">
            <SongItem player data={song} />
            <div className="flex items-center gap-x-2 w-max bg-black h-full absolute top-0 right-0 pl-1 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black">
              <LikeButton songId={song.id} songTitle={song.title} />
              <PlayerTypeIcon
                size={32}
                className="cursor-pointer"
                onClick={handleChangePlayerType}
                aria-label={
                  "Change the type of player to " +
                  (playerType === "next-song" ? "Shuffle" : "Next song")
                }
                role="button"
              />
            </div>
          </div>
        </div>

        <div className="z-10 sm:h-full flex sm:justify-end md:justify-center items-center sm:w-full max-w-[722px] gap-x-2 sm:gap-x-6 absolute sm:relative -top-full sm:top-0 -translate-y-1/4 sm:translate-y-0 right-0">
          <button
            aria-label="Change the song (backward)"
            className="text-black sm:text-neutral-400 size-[28px] sm:size-[30px] p-1 sm:p-0 rounded-full bg-white sm:bg-transparent cursor-pointer hover:opacity-75 sm:hover:text-white transition"
            onClick={() => onPlaySong("previous")}
          >
            <AiFillStepBackward className="w-full h-full" aria-hidden />
          </button>

          <button
            onClick={handlePlay}
            className="flex items-center justify-center size-10 rounded-full bg-white p-1 cursor-pointer overflow-hidden"
            aria-label={(isMusicPlaying ? "Pause " : "Play ") + "the song"}
          >
            {isMusicLoading ? (
              <div className="size-6 rounded-full border-4 animate-spin border-black relative after:size-3 after:bg-white after:absolute after:bottom-3/4 after:rotate-45">
                <p className="absolute opacity-0">Loading the song...</p>
              </div>
            ) : (
              <PauseOrPlayIcon size={30} className="text-black" aria-hidden />
            )}
          </button>

          <button
            onClick={() => onPlaySong("next")}
            className="text-black sm:text-neutral-400 size-[28px] sm:size-[30px] p-1 sm:p-0 rounded-full bg-white sm:bg-transparent cursor-pointer hover:opacity-75 sm:hover:text-white transition"
            aria-label="Change the song (forward)"
          >
            <AiFillStepForward className="w-full h-full" aria-hidden />
          </button>
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <button
              className="cursor-pointer"
              onClick={toggleMute}
              aria-label={sound.volume === 0 ? "unmute" : "mute"}
            >
              <VolumeIcon size={24} />
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
