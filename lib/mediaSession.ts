import { Song } from "@/types";

type MediaSessionCallbacks = Partial<
  Record<MediaSessionAction, (event?: MediaSessionActionDetails) => void>
>;

type Params = {
  song: Song;
  songImageUrl: string;
  callbacks: MediaSessionCallbacks;
};

export const initializeMediaSession = ({
  song,
  songImageUrl,
  callbacks,
}: Params) => {
  if (!navigator.mediaSession) return () => {};

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    artwork: [{ src: songImageUrl, type: "image/*" }],
  });

  Object.entries(callbacks).forEach(([action, handler]) => {
    navigator.mediaSession.setActionHandler(
      action as MediaSessionAction,
      handler || null
    );
  });

  navigator.mediaSession.playbackState = "playing";

  return () => {
    navigator.mediaSession.metadata = null;

    Object.keys(callbacks).forEach((action) => {
      navigator.mediaSession.setActionHandler(
        action as MediaSessionAction,
        null
      );
    });

    navigator.mediaSession.setPositionState(undefined);
    navigator.mediaSession.playbackState = "none";
  };
};
