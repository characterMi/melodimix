import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

const NoSongFallback = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        "flex gap-x-2 items-center text-neutral-400 mt-4",
        className
      )}
    >
      <p>No song available.</p>
      <button
        className="flex items-center gap-x-1 underline"
        onClick={() => router.refresh()}
      >
        Refresh
        <RxReload aria-hidden />
      </button>
    </div>
  );
};

export default NoSongFallback;
