import { usePlayerStore } from "@/store/usePlayerStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowToRight } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { IoShuffleOutline } from "react-icons/io5";
import useSound from "use-sound";

export function usePlayer(songUrl: string) {
  const { ids, playerType, setId, setPlayerType, setVolume, volume, activeId } =
    usePlayerStore((state) => ({
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

  useEffect(() => {
    sound?.play();

    return () => sound?.unload();
  }, [sound]);

  return {
    state: {
      isMusicPlaying,
      isMusicLoading,
      playerType,
    },
    handlers: {
      handleChangePlayerType,
      onPlaySong,
      handlePlay: () => {
        if (!isMusicPlaying) {
          play();
        } else {
          pause();
        }
      },
      toggleMute: () => {
        if (volume === 0) {
          setVolume(1);
        } else {
          setVolume(0);
        }
      },
    },
    icons: {
      VolumeIcon,
      PlayerTypeIcon,
      PauseOrPlayIcon,
    },
    sound: {
      song: sound,
      duration,
      volume,
      setVolume,
    },
  };
}
