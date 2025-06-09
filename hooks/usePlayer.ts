import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowToRight } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { IoShuffleOutline } from "react-icons/io5";
import useSound from "use-sound";
import { useLoadImage } from "./useLoadImage";
import { PiRepeatOnce } from "react-icons/pi";

export function usePlayer(song: Song, songUrl: string) {
  const songImageUrl = useLoadImage(song);
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
    onplay: () => {
      setIsMusicPlaying(true);
      navigator.setAppBadge?.(1);
    },
    onend: () => onPlaySong("next"),
    onpause: () => {
      setIsMusicPlaying(false);
      navigator.clearAppBadge?.();
    },
    onload: () => setIsMusicLoading(false),
    onloaderror: () => {
      setIsMusicLoading(false);
      toast.error("Couldn't load the music!");
    },
    loop: playerType === "repeat",
  });

  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const PlayerTypeIcon =
    playerType === "next-song"
      ? BiArrowToRight
      : playerType === "shuffle"
      ? IoShuffleOutline
      : PiRepeatOnce;
  const PauseOrPlayIcon = isMusicPlaying ? BsPauseFill : BsPlayFill;

  function handleChangePlayerType() {
    if (playerType === "next-song") {
      setPlayerType("shuffle");
      toast.success('Change the type to "Shuffle"');
    } else if (playerType === "shuffle") {
      setPlayerType("repeat");
      toast.success('Change the type to "Repeat"');
    } else {
      setPlayerType("next-song");
      toast.success('Change the type to "Next song"');
    }
  }

  function onPlaySong(type: "next" | "previous") {
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

    let nextSongIndex = currentIndex;

    while (nextSongIndex === currentIndex) {
      nextSongIndex = Math.floor(Math.random() * ids.length);
    }

    return nextSongIndex;
  };

  useEffect(() => {
    if (!sound) return;

    sound.play();

    if (navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.author,
        album: "Unknown",
        artwork: [
          {
            src: songImageUrl || "/images/liked.png",
            type: "image/*",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("play", () => play());
      navigator.mediaSession.setActionHandler("pause", () => pause());
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        onPlaySong("next")
      );
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        onPlaySong("previous")
      );
      navigator.mediaSession.setActionHandler("seekforward", () => {
        sound.seek(sound.seek() + 10);
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        sound.seek(sound.seek() - 10);
      });
      navigator.mediaSession.setActionHandler("seekto", ({ seekTime }) => {
        sound.seek(seekTime);
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        sound.unload();
        setId();
      });
      navigator.mediaSession.setPositionState({
        duration: sound.duration(),
        position: sound.seek(),
        playbackRate: 1.0,
      });
    }

    return () => {
      sound.unload();
      navigator.mediaSession.metadata = null;
    };
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
