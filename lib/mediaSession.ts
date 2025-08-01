import { Song } from "@/types";

type Params = {
  song: Song;
  songImageUrl: string;
  callbacks: {
    onPlay: () => void;
    onPause: () => void;
    onNexttrack: () => void;
    onPrevtrack: () => void;
    onSeekForward: () => void;
    onSeekBackward: () => void;
    onSeekTo: (params: MediaSessionActionDetails) => void;
  };
};

export const initializeMediaSession = ({
  song,
  songImageUrl,
  callbacks: {
    onPlay,
    onPause,
    onNexttrack,
    onPrevtrack,
    onSeekForward,
    onSeekBackward,
    onSeekTo,
  },
}: Params) => {
  if (navigator.mediaSession) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [
        {
          src: songImageUrl,
          type: "image/*",
        },
      ],
    });
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    navigator.mediaSession.setActionHandler("nexttrack", onNexttrack);
    navigator.mediaSession.setActionHandler("previoustrack", onPrevtrack);
    navigator.mediaSession.setActionHandler("seekforward", onSeekForward);
    navigator.mediaSession.setActionHandler("seekbackward", onSeekBackward);
    navigator.mediaSession.setActionHandler("seekto", onSeekTo);
    navigator.mediaSession.playbackState = "playing";
  }

  return () => {
    if (!navigator.mediaSession) return;

    navigator.mediaSession.metadata = null;
    navigator.mediaSession.setActionHandler("play", null);
    navigator.mediaSession.setActionHandler("pause", null);
    navigator.mediaSession.setActionHandler("nexttrack", null);
    navigator.mediaSession.setActionHandler("previoustrack", null);
    navigator.mediaSession.setActionHandler("seekforward", null);
    navigator.mediaSession.setActionHandler("seekbackward", null);
    navigator.mediaSession.setActionHandler("seekto", null);
    navigator.mediaSession.setPositionState(undefined);
    navigator.mediaSession.playbackState = "none";
  };
};
