import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { HiOutlineStatusOffline } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

type Props = ImageProps & {
  renderErrorFallback?: boolean;
};

const SongCover = ({
  src,
  alt,
  width,
  height,
  className,
  renderErrorFallback = true,
  ...props
}: Props) => {
  const [imageStatus, setImageStatus] = useState<"loaded" | "error">("loaded");

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
      onError={() => setImageStatus("error")}
      {...props}
    />
  );
};

export default SongCover;
