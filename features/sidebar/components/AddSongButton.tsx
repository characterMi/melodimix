import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";

import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthModal } from "@/features/auth/store/useAuthModal";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useUploadModal } from "@/features/upload-song/store/useUploadModal";

const AddSongButton = () => {
  const openAuthModal = useAuthModal((state) => state.onOpen);
  const openUploadModal = useUploadModal((state) => state.onOpen);

  const { session } = useSession();

  const handleClick = () => {
    if (!session?.user) return openAuthModal();

    openUploadModal();
  };

  return (
    <div className="flex items-center justify-between px-2 pt-4">
      <div className="inline-flex items-center gap-x-2">
        <TbPlaylist size={26} className="text-neutral-400" aria-hidden />

        <p className="text-neutral-400 font-medium text-sm">Your Library</p>
      </div>

      <button
        onClick={handleClick}
        className={cnWithReduceMotion(
          "text-neutral-400 cursor-pointer transition-colors hover:text-white focus-visible:text-white outline-none",
        )}
        aria-label="Upload a song..."
      >
        <AiOutlinePlus size={20} aria-hidden />
      </button>
    </div>
  );
};

export default AddSongButton;
