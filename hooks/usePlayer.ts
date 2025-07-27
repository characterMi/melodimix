import { initializeMediaSession } from "@/lib/mediaSession";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowToRight } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { IoShuffleOutline } from "react-icons/io5";
import { PiRepeatOnce } from "react-icons/pi";
import useSound from "use-sound";
import { useLoadImage } from "./useLoadImage";

export function usePlayer(song: Song, songUrl: string) {
  const songImageUrl = useLoadImage(song);
  const {
    ids,
    playerType,
    setId,
    setPlayerType,
    setVolume,
    volume,
    activeId,
    setCurrentlyPlayingSongId,
  } = usePlayerStore((state) => ({
    ids: state.ids,
    playerType: state.playerType,
    setId: state.setId,
    setPlayerType: state.setPlayerType,
    setVolume: state.setVolume,
    volume: state.volume,
    activeId: state.activeId,
    setCurrentlyPlayingSongId: state.setCurrentlyPlayingSongId,
  }));

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicLoading, setIsMusicLoading] = useState(true);

  const [play, { pause, sound, duration /* to ms */ }] = useSound(songUrl, {
    volume,
    format: ["mp3"],
    onplay: () => {
      setIsMusicPlaying(true);
      navigator.setAppBadge?.(1);
      navigator.mediaSession.playbackState = "playing";
    },
    onend: () => onPlaySong("next"),
    onpause: () => {
      setIsMusicPlaying(false);
      navigator.clearAppBadge?.();
      navigator.mediaSession.playbackState = "paused";
    },
    onload: () => setIsMusicLoading(false),
    onloaderror: () => {
      setIsMusicLoading(false);
      toast.error("Couldn't load the music!");
    },
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

    if (playerType === "next-song" || playerType === "repeat") {
      const nextSongToPlay =
        type === "next" ? ids[currentIndex + 1] : ids[currentIndex - 1];

      if (!nextSongToPlay) {
        setId(type === "next" ? ids[0] : ids[ids.length - 1]);
      }

      setId(nextSongToPlay);
      return;
    }

    // Shuffle
    const randomId = generateNextSongIndex(currentIndex);
    setId(ids[randomId]);
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
    setCurrentlyPlayingSongId(song.id);

    const removeMediaSessionMetadata = initializeMediaSession({
      song,
      songImageUrl: songImageUrl || "/images/liked.png",
      callbacks: {
        onPlay: () => play(),
        onPause: () => pause(),
        onNexttrack: () => onPlaySong("next"),
        onPrevtrack: () => onPlaySong("previous"),
        onSeekForward: () => sound.seek(sound.seek() + 10),
        onSeekBackward: () => sound.seek(sound.seek() - 10),
        onSeekTo: ({ seekTime }) => sound.seek(seekTime ?? 0),
        onStop: () => {
          sound.unload();
          setId();
        },
      },
      positionState: {
        duration: sound.duration(),
        position: sound.seek(),
        playbackRate: 1.0,
      },
    });

    return () => {
      sound.unload();
      removeMediaSessionMetadata();
    };
  }, [sound]);

  // whenever the playerType changes, we add new properties to the howler instance and media session
  useEffect(() => {
    if (!sound) return;

    navigator.mediaSession.setActionHandler("nexttrack", () =>
      onPlaySong("next")
    );
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      onPlaySong("previous")
    );

    sound.off("end");

    if (playerType === "repeat") {
      sound.loop(true);
    } else {
      sound.on("end", () => onPlaySong("next"));
      sound.loop(false);
    }
  }, [playerType, sound]);

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
