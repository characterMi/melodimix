"use client";

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
  const [imageStatus, setImageStatus] = useState<"error">();

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
      className={twMerge("object-cover h-full", className)}
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
