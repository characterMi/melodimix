import { useUser } from "@/hooks/useUser";
import { useAuthModal } from "@/store/useAuthModal";
import { useUploadModal } from "@/store/useUploadModal";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";

const AddSongButton = () => {
  const openAuthModal = useAuthModal((state) => state.onOpen);
  const openUploadModal = useUploadModal((state) => state.onOpen);

  const { user } = useUser();

  const handleClick = () => {
    if (!user) return openAuthModal();

    openUploadModal();
  };

  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <div className="inline-flex items-center gap-x-2">
        <TbPlaylist size={26} className="text-neutral-400" aria-hidden />

        <p className="text-neutral-400 font-medium text-sm">Your Library</p>
      </div>

      <button
        onClick={handleClick}
        className="text-neutral-400 cursor-pointer hover:text-white transition"
        aria-label="Upload a song..."
      >
        <AiOutlinePlus size={20} aria-hidden />
      </button>
    </div>
  );
};

export default AddSongButton;
