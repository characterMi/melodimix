import { usePlayer } from "@/hooks/usePlayer";
import type { Song } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BiArrowToRight } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { IoShuffleOutline } from "react-icons/io5";
import useSound from "use-sound";
import Duration from "./Duration";
import LikedButton from "./LikeButton";
import Slider from "./Slider";
import SongItem from "./SongItem";

const PlayerContent = ({ song, songUrl }: { song: Song; songUrl: string }) => {
  const { ids, playerType, setId, setPlayerType, setVolume, volume, activeId } =
    usePlayer((state) => ({
      ids: state.ids,
      playerType: state.playerType,
      setId: state.setId,
      setPlayerType: state.setPlayerType,
      setVolume: state.setVolume,
      volume: state.volume,
      activeId: state.activeId,
    }));

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicLoading, setIsMusicLoading] = useState(true);

  const [play, { pause, sound, duration /* to ms */ }] = useSound(songUrl, {
    volume,
    format: ["mp3"],
    onplay: () => setIsMusicPlaying(true),
    onend: onPlaySong,
    onpause: () => setIsMusicPlaying(false),
    onload: () => setIsMusicLoading(false),
  });

  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const PlayerTypeIcon =
    playerType === "next-song" ? BiArrowToRight : IoShuffleOutline;
  const PauseOrPlayIcon = isMusicPlaying ? BsPauseFill : BsPlayFill;

  function handleChangePlayerType() {
    if (playerType === "next-song") {
      setPlayerType("shuffle");
      toast.success('Change the type to "Shuffle"');
    } else {
      setPlayerType("next-song");
      toast.success('Change the type to "Next song"');
    }
  }

  function onPlaySong(type: "next" | "previous" = "next") {
    if (ids.length <= 1) return;

    const currentIndex = ids.findIndex((id) => id === activeId);

    let nextSongToPlay = ids[currentIndex];

    if (playerType === "next-song") {
      nextSongToPlay =
        type === "next" ? ids[currentIndex + 1] : ids[currentIndex - 1];

      if (!nextSongToPlay) {
        nextSongToPlay = type === "next" ? ids[0] : ids[ids.length - 1];
      }
    }

    if (playerType === "shuffle") {
      const randomId = generateNextSongIndex(currentIndex);

      nextSongToPlay = ids[randomId];
    }

    setId(nextSongToPlay);
  }

  const generateNextSongIndex = (currentIndex: number): number => {
    if (ids.length === 1) return 0; // if the length of our playlist is 1, we don't want to play a random music, but instead we want to play the current music

    const nextSongIndex = Math.floor(Math.random() * ids.length);

    if (nextSongIndex === currentIndex)
      return generateNextSongIndex(currentIndex);

    return nextSongIndex;
  };

  const handlePlay = () => {
    if (!isMusicPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  useEffect(() => {
    sound?.play();

    return () => sound?.unload();
  }, [sound]);

  return (
    <>
      <Duration duration={duration!} sound={sound} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-full relative">
        <div className="flex w-full justify-start relative">
          <div className="flex items-center gap-x-4 w-full">
            <SongItem player data={song} />
            <div className="flex items-center gap-x-2 w-max bg-black h-full absolute top-0 right-0 pl-1 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black">
              <LikedButton songId={song.id} songTitle={song.title} />
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
          <AiFillStepBackward
            onClick={() => onPlaySong("previous")}
            className="text-black sm:text-neutral-400 size-[28px] sm:size-[30px] p-1 sm:p-0 rounded-full bg-white sm:bg-transparent cursor-pointer hover:opacity-75 sm:hover:text-white transition"
            aria-label="Change the song (backward)"
            role="button"
          />

          <div
            onClick={handlePlay}
            className="flex items-center justify-center size-10 rounded-full bg-white p-1 cursor-pointer overflow-hidden"
            aria-label={(isMusicPlaying ? "Pause " : "Play ") + "the song"}
            role="button"
          >
            {isMusicLoading ? (
              <div
                className="size-6 rounded-full border-4 animate-spin border-black relative after:size-3 after:bg-white after:absolute after:bottom-3/4 after:rotate-45"
                aria-label="Loading the song..."
              />
            ) : (
              <PauseOrPlayIcon size={30} className="text-black" aria-hidden />
            )}
          </div>

          <AiFillStepForward
            onClick={() => onPlaySong("next")}
            className="text-black sm:text-neutral-400 size-[28px] sm:size-[30px] p-1 sm:p-0 rounded-full bg-white sm:bg-transparent cursor-pointer hover:opacity-75 sm:hover:text-white transition"
            aria-label="Change the song (forward)"
            role="button"
          />
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon
              onClick={toggleMute}
              className="cursor-pointer"
              size={34}
              aria-label={volume === 0 ? "unmute" : "mute"}
              role="button"
            />

            <Slider
              value={volume}
              onChange={(value) => setVolume(value)}
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
