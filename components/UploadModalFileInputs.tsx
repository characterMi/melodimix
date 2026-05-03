import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { twMerge } from "tailwind-merge";

import { UploadPhase } from "@/hooks/useUploadOrUpdateSong";
import { initializeMediaSession } from "@/lib/mediaSession";
import { shouldReduceMotion } from "@/lib/reduceMotion";

import DeleteFileButton from "./DeleteFileButton";
import Duration from "./Duration";
import Input from "./Input";
import Loader from "./Loader";

type InputProps = {
  phase: UploadPhase;
  isEditing: boolean;
  uploadProgress: number;
};

type PreviewProps = {
  file: File;
  onDelete: () => void;
};

export const SongInput = ({ phase, isEditing, uploadProgress }: InputProps) => {
  const [selectedSong, setSelectedSong] = useState<File | null>(null);
  const input = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input
        name="song"
        id="song"
        type="file"
        accept=".mp3"
        className="hidden"
        ref={input}
        onChange={(e) => setSelectedSong(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        disabled={phase !== "none"}
        onClick={() => input.current?.click()}
        className={twMerge(
          "px-6 py-2 rounded-md bg-gradient-to-r from-emerald-700 to-emerald-900 outline-none hover:opacity-80 focus-visible:opacity-80 disabled:opacity-50",
          !shouldReduceMotion && "transition-opacity"
        )}
      >
        Select a song file {isEditing && "(optional)"}
        <ImAttachment className="inline ml-1" />
      </button>

      {selectedSong && (
        <div className="relative">
          <SongPreview
            file={selectedSong}
            onDelete={() => {
              if (phase !== "none") return;

              setSelectedSong(null);
              input.current!.value = "";
            }}
          />

          <UploadProgress
            progress={uploadProgress}
            desc="Upload progress of the uploaded song"
            isHidden={phase !== "uploading" && phase !== "updating"}
          />
        </div>
      )}
    </>
  );
};

const SongPreview = ({ file, onDelete }: PreviewProps) => {
  const [isSongLoading, setIsSongLoading] = useState(true);
  const [song, setSong] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsSongLoading(true);
    const fileObject = URL.createObjectURL(file);
    const audio = new Audio(fileObject);

    const onPlay = () => {
      setIsPlaying(true);
      navigator.setAppBadge?.(1);
      if (navigator.mediaSession?.playbackState) {
        navigator.mediaSession.playbackState = "playing";
      }
    };

    const onPause = () => {
      setIsPlaying(false);
      navigator.clearAppBadge?.();
      if (navigator.mediaSession?.playbackState) {
        navigator.mediaSession.playbackState = "paused";
      }
    };

    const onLoad = (e: Event) => {
      setIsSongLoading(false);
      setSong(e.target as HTMLAudioElement);

      navigator.mediaSession?.setPositionState?.({
        duration: audio.duration || 0,
        playbackRate: 1.0,
        position: 0,
      });
    };

    const events = [
      ["play", onPlay],
      ["pause", onPause],
      ["loadedmetadata", onLoad],
    ] as const;

    events.forEach(([action, handler]) =>
      audio.addEventListener(action, handler)
    );

    const updatePositionState = () => {
      if (isNaN(audio.duration)) return;

      navigator.mediaSession?.setPositionState?.({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    };

    const clearMediaSessionMetadata = initializeMediaSession({
      song: {
        artist: "Unknown",
        title: file.name,
      },
      songImageUrl: "/images/song.png",
      callbacks: {
        play: () => audio.play(),
        pause: () => audio.pause(),
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
      URL.revokeObjectURL(fileObject);
      setSong(null);
    };
  }, [file]);

  const PauseOrPlayIcon = isPlaying ? BsPauseFill : BsPlayFill;

  return (
    <div className="flex gap-4 py-2 px-[14px] items-center bg-white/10 rounded-md relative group">
      {isSongLoading ? (
        <Loader className="m-3" />
      ) : (
        <>
          <DeleteFileButton onClick={onDelete} label="Remove the song" />

          <div className="relative">
            <Image
              src={"/images/song.png"}
              aria-hidden
              alt=""
              width={60}
              height={60}
              className="rounded-lg min-w-14 h-14"
            />

            <div
              className={twMerge(
                "absolute top-0 left-0 size-full rounded-md bg-black/60 cursor-pointer opacity-0 hover:opacity-100 focus-within:opacity-100 flex justify-center items-center",
                !shouldReduceMotion && "transition-opacity"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  if (!isPlaying) {
                    song?.play();
                  } else {
                    song?.pause();
                  }
                }}
                autoFocus
                className="outline-none"
              >
                <PauseOrPlayIcon size={26} />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between w-full truncate pt-3 text-sm">
            <p className="truncate text-sm">{file.name}</p>

            <Duration isMobilePlayer song={song} />
          </div>
        </>
      )}
    </div>
  );
};

export const ImageInput = ({
  phase,
  isEditing,
  uploadProgress,
}: InputProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const input = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input
        name="img"
        id="img"
        type="file"
        accept="image/*"
        className="hidden"
        ref={input}
        onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        disabled={phase !== "none"}
        onClick={() => input.current?.click()}
        className={twMerge(
          "px-6 py-2 rounded-md bg-gradient-to-r from-emerald-700 to-emerald-900 outline-none hover:opacity-80 focus-visible:opacity-80 disabled:opacity-50",
          !shouldReduceMotion && "transition-opacity"
        )}
      >
        Select an image {isEditing && "(optional)"}
        <ImAttachment className="inline ml-1" />
      </button>

      {selectedImage && (
        <div className="relative w-max">
          <ImagePreview
            file={selectedImage}
            onDelete={() => {
              if (phase !== "none") return;

              setSelectedImage(null);
              input.current!.value = "";
            }}
          />

          <UploadProgress
            progress={uploadProgress}
            desc="Upload progress of the uploaded song cover"
            isHidden={phase !== "uploading" && phase !== "updating"}
          />
        </div>
      )}
    </>
  );
};

const ImagePreview = ({ file, onDelete }: PreviewProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    setIsImageLoading(true);
    const fileObject = URL.createObjectURL(file);
    setImageSrc(fileObject);

    return () => {
      URL.revokeObjectURL(fileObject);
      setImageSrc("");
    };
  }, [file]);

  return (
    <div className="relative bg-white/10 p-2 size-52 rounded-md group">
      <DeleteFileButton onClick={onDelete} label="Remove the image" />

      <img
        src={imageSrc}
        alt="Uploaded image"
        className="size-full overflow-hidden rounded-[4px] object-cover"
        onLoad={() => setIsImageLoading(false)}
      />

      {isImageLoading && (
        <div className="absolute top-0 left-0 size-full bg-black/60 rounded-md flex justify-center items-center backdrop-blur-md">
          <Loader label="The image is being loaded." />
        </div>
      )}
    </div>
  );
};

const UploadProgress = ({
  progress,
  isHidden,
  desc,
}: {
  progress: number;
  isHidden: boolean;
  desc: string;
}) => (
  <div
    className="absolute top-0 left-0 size-full bg-black/60 z-[2] rounded-md backdrop-blur-md flex flex-col gap-2 justify-center px-4"
    style={{
      visibility: isHidden ? "hidden" : "visible",
    }}
  >
    <p className="opacity-90">
      Upload progress
      <span className="number-text ml-1 text-sm opacity-80">{progress}%</span>
    </p>

    <span
      role="progressbar"
      aria-description={desc}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={progress}
      className="w-full h-2 rounded-full bg-white/10 flex items-center p-[1px]"
    >
      <span
        aria-hidden
        className="h-full bg-gradient-to-r block rounded-full from-green-500 to-green-600"
        style={{
          width: progress + "%",
          transition: shouldReduceMotion
            ? undefined
            : "width 100ms ease-in-out",
        }}
      />
    </span>
  </div>
);
