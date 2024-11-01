import { useAuthModal } from "@/hooks/useAuthModal";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";

const AddSongButton = () => {
  const authModal = useAuthModal();

  const uploadModal = useUploadModal();

  const { user } = useUser();

  const handleClick = () => {
    if (!user) return authModal.onOpen();

    return uploadModal.onOpen();
  };

  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <div className="inline-flex items-center gap-x-2">
        <TbPlaylist size={26} className="text-neutral-400" aria-hidden />

        <p className="text-neutral-400 font-medium text-sm">Your Library</p>
      </div>

      <AiOutlinePlus
        onClick={handleClick}
        size={20}
        className="text-neutral-400 cursor-pointer hover:text-white transition"
        role="button"
        aria-label="Upload a song..."
      />
    </div>
  );
};
export default AddSongButton;
