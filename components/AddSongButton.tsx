import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

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
        <TbPlaylist size={26} className="text-neutral-400" />

        <p className="text-neutral-400 font-medium text-sm">Your Library</p>
      </div>

      <AiOutlinePlus
        onClick={handleClick}
        size={20}
        className="text-neutral-400 cursor-pointer hover:text-white transition"
      />
    </div>
  );
};
export default AddSongButton;
