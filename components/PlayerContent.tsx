import { usePlayer } from "@/hooks/usePlayer";
import type { Song } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowToRight } from "react-icons/bi";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { IoShuffleOutline } from "react-icons/io5";
import useSound from "use-sound";
import Duration from "./Duration";
import LikedButton from "./LikedButton";
import PlayerControls from "./PlayerControls";
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
              />
            </div>
          </div>
        </div>

        <PlayerControls
          onPlaySong={onPlaySong}
          handlePlay={handlePlay}
          isMusicLoading={isMusicLoading}
          isMusicPlaying={isMusicPlaying}
        />

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon
              onClick={toggleMute}
              className="cursor-pointer"
              size={34}
            />

            <Slider
              value={volume}
              onChange={(value) => setVolume(value)}
              bgColor="bg-white"
              max={1}
              step={0.1}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerContent;
