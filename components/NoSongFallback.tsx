import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  showButton?: boolean;
  fallbackText?: string;
};

const NoSongFallback = ({
  className,
  showButton = true,
  fallbackText = "No song available.",
}: Props) => {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        "flex gap-x-2 items-center text-neutral-400 mt-4",
        className
      )}
    >
      <p>{fallbackText}</p>
      {showButton && (
        <button
          className="flex items-center gap-x-1 underline outline-none hover:text-white focus-visible:text-white transition"
          onClick={() => router.refresh()}
        >
          Refresh
          <RxReload aria-hidden />
        </button>
      )}
    </div>
  );
};

export default NoSongFallback;
