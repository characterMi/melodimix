import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { HiOutlineStatusOffline } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

type Props = ImageProps & {
  renderLoadingComponent?: boolean;
  renderErrorFallback?: boolean;
};

const SongCover = ({
  src,
  alt,
  width,
  height,
  className,
  renderLoadingComponent = true,
  renderErrorFallback = true,
  ...props
}: Props) => {
  const [imageStatus, setImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  if (imageStatus === "error" && renderErrorFallback) {
    return (
      <div
        className="flex justify-center items-center h-full w-full"
        aria-label="Could not load the image"
      >
        <HiOutlineStatusOffline className="text-white size-[30%]" />
      </div>
    );
  }

  return (
    <>
      <Image
        className={twMerge(
          "object-cover h-full transition-opacity opacity-0",
          imageStatus === "loaded" && "opacity-100",
          className
        )}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setImageStatus("loaded")}
        onError={() => setImageStatus("error")}
        {...props}
      />

      {imageStatus === "loading" && renderLoadingComponent && (
        <div
          aria-label="Image is loading"
          className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 w-[300%] h-[200%] absolute top-0 left-0 animate-skeleton"
        />
      )}
    </>
  );
};

export default SongCover;
