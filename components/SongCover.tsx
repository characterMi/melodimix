import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = ImageProps;

const SongCover = ({ src, alt, width, height, className, ...props }: Props) => {
  const [imageStatus, setImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  return imageStatus === "error" ? (
    <div className="flex justify-center items-center h-full w-full bg-black">
      <img
        src="/icons/offline.png"
        alt="You're offline"
        className="size-[30%] object-cover"
      />
    </div>
  ) : (
    <Image
      className={twMerge(
        "object-cover h-full transition-opacity opacity-0",
        imageStatus === "loaded" && "opacity-100",
        className
      )}
      src={src}
      alt={alt + " poster"}
      width={width}
      height={height}
      onLoad={() => setImageStatus("loaded")}
      onError={() => setImageStatus("error")}
      {...props}
    />
  );
};

export default SongCover;
