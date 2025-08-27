import { useCallback, useEffect, useState } from "react";

import { initializeMediaSession } from "@/lib/mediaSession";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useLoadImage } from "./useLoadImage";
import { useLoadSong } from "./useLoadSong";

import type { Song } from "@/types";

export function usePlayer(song: Song, songUrl: string) {
  const songImageUrl = useLoadImage(song);
  const {
    ids,
    playerType,
    setId,
    setVolume,
    volume,
    activeId,
    setCurrentlyPlayingSongId,
  } = usePlayerStore((state) => ({
    playerType: state.playerType,
    ids: state.ids,
    setId: state.setId,
    volume: state.volume,
    setVolume: state.setVolume,
    activeId: state.activeId,
    setCurrentlyPlayingSongId: state.setCurrentlyPlayingSongId,
  }));

  const { audioSrc, isSoundLoading } = useLoadSong(songUrl);
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const onEnd = useCallback(
    (e: Event) => {
      const audio = e.currentTarget as HTMLAudioElement;

      if (playerType === "repeat") {
        audio.currentTime = 0;

        navigator.mediaSession?.setPositionState?.({
          duration: audio.duration || 0,
          position: 0,
          playbackRate: 1.0,
        });

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
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.volume = volume;

    const onPlay = () => {
      setIsMusicPlaying(true);
      navigator.setAppBadge?.(1);
      if (navigator.mediaSession?.playbackState) {
        navigator.mediaSession.playbackState = "playing";
      }
    };

    const onPause = () => {
      setIsMusicPlaying(false);
      navigator.clearAppBadge?.();
      if (navigator.mediaSession?.playbackState) {
        navigator.mediaSession.playbackState = "paused";
      }
    };

    const onLoad = (e: Event) => {
      const target = e.currentTarget as HTMLAudioElement;

      setSound(target);

      navigator.mediaSession?.setPositionState?.({
        duration: audio.duration || 0,
        playbackRate: 1.0,
        position: 0,
      });
    };

    const events = [
      ["play", onPlay],
      ["pause", onPause],
      ["ended", onEnd],
      ["loadedmetadata", onLoad],
    ] as const;

    events.forEach(([action, handler]) =>
      audio.addEventListener(action, handler)
    );

    setCurrentlyPlayingSongId(song.id);
    audio.play();

    const updatePositionState = () => {
      if (isNaN(audio.duration)) return;

      navigator.mediaSession?.setPositionState?.({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    };

    // Media Session Setup
    const clearMediaSessionMetadata = initializeMediaSession({
      song,
      songImageUrl: songImageUrl || "/images/liked.png",
      callbacks: {
        play: () => audio.play(),
        pause: () => audio.pause(),
        nexttrack: () => onPlaySong("next"),
        previoustrack: () => onPlaySong("previous"),
        seekforward: () => {
          audio.currentTime += 10;
          updatePositionState();
        },
        seekbackward: () => {
          audio.currentTime -= 10;
          updatePositionState();
        },
        seekto: (event) => {
          audio.currentTime = event?.seekTime ?? 0;
          updatePositionState();
        },
      },
    });

    return () => {
      events.forEach(([action, handler]) =>
        audio.removeEventListener(action, handler)
      );
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

    navigator.mediaSession?.setActionHandler("nexttrack", () =>
      onPlaySong("next")
    );
    navigator.mediaSession?.setActionHandler("previoustrack", () =>
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
    sound: {
      song: sound,
      duration: sound?.duration || 0,
      volume,
      setVolume,
    },
  };
}
