import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineLockClosed, HiOutlineLockOpen } from "react-icons/hi";
import { MdArrowOutward, MdOutlineEdit } from "react-icons/md";

import { usePlaylistsPageData } from "@/features/infinite-scroll/store/usePlaylistsPageData";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { deletePlaylist } from "../actions";
import { useLoadPlaylistPoster } from "../hooks/useLoadPlaylistPoster";
import { usePlaylistDetailsModal } from "../store/usePlaylistDetailsModal";
import { usePlaylistModal } from "../store/usePlaylistModal";

import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";
import Button from "../../../components/Button";
import Modal from "../../modal/components/Modal";

const PlaylistDetailsModal = () => {
  const { isOpen, onClose, playlistData } = usePlaylistDetailsModal();

  return (
    <Modal
      title="Playlist details"
      description={`"${playlistData?.name ?? "Unknown"}" playlist.`}
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    >
      {!playlistData ? (
        <div className="size-full flex items-center justify-center">
          <p className="text-center opacity-80 text-sm">No playlist found...</p>
        </div>
      ) : (
        <>
          <hr className="mb-6 border-none h-[1px] rounded-full bg-white opacity-10" />

          <PlaylistDetails playlist={playlistData} />
        </>
      )}
    </Modal>
  );
};

const PlaylistDetails = ({ playlist }: { playlist: Playlist }) => {
  const imgPath = useLoadPlaylistPoster(playlist);
  const router = useRouter();
  const onModalClose = usePlaylistDetailsModal((state) => state.onClose);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <img
          src={imgPath ?? "/images/playlist.png"}
          alt="Playlist poster"
          className="min-w-44 w-44 aspect-square object-cover overflow-hidden rounded-md"
        />

        <div className="my-2 flex flex-col justify-between truncate">
          <div>
            <div className="flex items-center">
              <h2 className="font-semibold text-3xl truncate">
                {playlist.name}
              </h2>

              {playlist.is_public ? (
                <HiOutlineLockOpen className="min-w-12" size={24} />
              ) : (
                <HiOutlineLockClosed className="min-w-12" size={24} />
              )}
            </div>

            <time className="text-xs opacity-60">
              Created at {new Date(playlist.created_at).toLocaleDateString()}
            </time>
          </div>

          {playlist.song_ids.length <= 0 ? (
            <p className="text-sm opacity-80">No song in this playlist</p>
          ) : (
            <VariantButton
              variant="primary"
              className="px-2 w-full py-4 rounded-md text-sm"
              onClick={() => {
                router.push(`/profile/playlists/${playlist.id}`);
                onModalClose();
              }}
            >
              {`${playlist.song_ids.length} Song${playlist.song_ids.length > 1 ? "s" : ""} in this playlist`}
              <MdArrowOutward size={16} />
            </VariantButton>
          )}
        </div>
      </div>

      <UpdatePlaylist playlist={playlist} />
      <DeletePlaylist isPublic={playlist.is_public} playlistId={playlist.id} />
    </div>
  );
};

const UpdatePlaylist = ({ playlist }: { playlist: Playlist }) => {
  const openModal = usePlaylistModal((state) => state.onOpen);

  return (
    <Button
      className="from-sky-600 to-sky-700 mt-6 flex items-center justify-center gap-2 text-white font-thin text-lg"
      onClick={() => openModal(playlist)}
    >
      Edit playlist <MdOutlineEdit size={20} color="white" />
    </Button>
  );
};

const DeletePlaylist = ({
  playlistId,
  isPublic,
}: {
  playlistId: number;
  isPublic: boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const onModalClose = usePlaylistDetailsModal((state) => state.onClose);

  const removePlaylistFromPlaylistsStore = usePlaylistsPageData(
    (state) => state.removeOne,
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isDeleting) return;

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again.",
      );
      return;
    }

    setIsDeleting(true);

    const isDeleted = await deletePlaylist(playlistId, isPublic);

    if (!isDeleted) {
      onError();
    } else {
      onSuccess("Playlist deleted.");
      onModalClose();
    }

    router.replace("/profile");
    setIsDeleting(false);
    removePlaylistFromPlaylistsStore(playlistId);
  };

  return (
    <Button
      className="from-rose-500 to-rose-600 flex items-center justify-center gap-2 text-white font-thin text-lg"
      disabled={isDeleting}
      onClick={handleDelete}
    >
      Delete playlist
      {isDeleting ? <Spinner /> : <FiTrash2 size={20} color="white" />}
    </Button>
  );
};

export default PlaylistDetailsModal;
