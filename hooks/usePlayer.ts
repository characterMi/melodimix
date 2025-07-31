import { initializeMediaSession } from "@/lib/mediaSession";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { IoShuffleOutline } from "react-icons/io5";
import { PiRepeatOnce } from "react-icons/pi";
import { useLoadImage } from "./useLoadImage";
import { useLoadSong } from "./useLoadSong";

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

  const { audioSrc, isSoundLoading } = useLoadSong(songUrl);
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const PlayerTypeIcon =
    playerType === "next-song"
      ? BiArrowToRight
      : playerType === "shuffle"
      ? IoShuffleOutline
      : PiRepeatOnce;
  const PauseOrPlayIcon = isMusicPlaying ? BsPauseFill : BsPlayFill;

  const onEnd = useCallback(
    (e: Event) => {
      const audio = e.currentTarget as HTMLAudioElement;

      if (playerType === "repeat") {
        audio.currentTime = 0;
        audio.play();
      } else {
        onPlaySong("next");
      }
    },
    [playerType]
  );

  const onPlaySong = useCallback(
    (type: "next" | "previous") => {
      if (ids.length <= 1) return;
      const currentIndex = ids.findIndex((id) => id === activeId);

      if (playerType === "shuffle") {
        const randomIndex = generateNextSongIndex(currentIndex);
        setId(ids[randomIndex]);
        return;
      }

      const nextSong =
        type === "next" ? ids[currentIndex + 1] : ids[currentIndex - 1];
      if (nextSong) {
        setId(nextSong);
      } else {
        setId(type === "next" ? ids[0] : ids[ids.length - 1]);
      }
    },
    [ids, activeId, playerType]
  );

  const generateNextSongIndex = useCallback(
    (currentIndex: number): number => {
      if (ids.length === 1) return 0;
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * ids.length);
      }
      return nextIndex;
    },
    [ids]
  );

  useEffect(() => {
    if (!audioSrc) {
      const emptyCallback = () => {};

      // If the song is loading...
      initializeMediaSession({
        song: { ...song, title: "Loading", artist: "Loading the song..." },
        songImageUrl: "/images/liked.png",
        callbacks: {
          onPlay: emptyCallback,
          onPause: emptyCallback,
          onNexttrack: emptyCallback,
          onPrevtrack: emptyCallback,
          onSeekForward: emptyCallback,
          onSeekBackward: emptyCallback,
          onSeekTo: emptyCallback,
          onStop: emptyCallback,
        },
        positionState: {
          duration: 0,
          position: 0,
          playbackRate: 1.0,
        },
      });
      return;
    }

    const audio = new Audio(audioSrc);
    audio.volume = volume;

    const onPlay = () => {
      setIsMusicPlaying(true);
      navigator.setAppBadge?.(1);
      navigator.mediaSession.playbackState = "playing";
    };

    const onPause = () => {
      setIsMusicPlaying(false);
      navigator.clearAppBadge?.();
      navigator.mediaSession.playbackState = "paused";
    };

    const onLoad = (e: Event) => {
      const target = e.currentTarget as HTMLAudioElement;

      setSound(target);

      navigator.mediaSession?.setPositionState({
        duration: target.duration || 0,
        position: target.currentTime,
        playbackRate: 1.0,
      });
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("loadedmetadata", onLoad);

    setCurrentlyPlayingSongId(song.id);
    audio.play();

    // Media Session Setup
    const clearMediaSessionMetadata = initializeMediaSession({
      song,
      songImageUrl: songImageUrl || "/images/liked.png",
      callbacks: {
        onPlay: () => audio.play(),
        onPause: () => audio.pause(),
        onNexttrack: () => onPlaySong("next"),
        onPrevtrack: () => onPlaySong("previous"),
        onSeekForward: () => (audio.currentTime += 10),
        onSeekBackward: () => (audio.currentTime -= 10),
        onSeekTo: ({ seekTime }) => (audio.currentTime = seekTime ?? 0),
        onStop: () => {
          audio.pause();
          audio.src = "";
          setCurrentlyPlayingSongId();
          setId();
        },
      },
      positionState: {
        duration: audio.duration || 0,
        position: audio.currentTime,
        playbackRate: 1.0,
      },
    });

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.pause();
      audio.src = "";
      clearMediaSessionMetadata();
    };
  }, [audioSrc]);

  // Sync volume changes
  useEffect(() => {
    if (sound) {
      sound.volume = volume;
    }
  }, [volume, sound]);

  // whenever the playerType changes, we add new properties to the audio instance and media session
  useEffect(() => {
    if (!sound) return;

    navigator.mediaSession.setActionHandler("nexttrack", () =>
      onPlaySong("next")
    );
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      onPlaySong("previous")
    );

    sound.removeEventListener("ended", onEnd);

    sound.addEventListener("ended", onEnd);

    return () => sound.removeEventListener("ended", onEnd);
  }, [playerType, sound]);

  return {
    state: {
      isMusicPlaying,
      isSoundLoading,
      playerType,
    },
    handlers: {
      handleChangePlayerType: setPlayerType,
      onPlaySong,
      handlePlay: () => {
        if (!isMusicPlaying) {
          sound?.play();
        } else {
          sound?.pause();
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
      duration: sound?.duration || 0,
      volume,
      setVolume,
    },
  };
}
