import { useUploadOrUpdateSong } from "../hooks/useUploadOrUpdateSong";

import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Modal from "../../modal/components/Modal";
import { ImageInput, SongInput } from "./UploadModalFileInputs";

const UploadModal = () => {
  const {
    isEditing,
    handleSubmit,
    handleCancel,
    phase,
    uploadProgress,
    isUploadModalOpen,
    onUploadModalClose,
    initialData,
  } = useUploadOrUpdateSong();

  return (
    <Modal
      title={`${isEditing ? "Update" : "Add a"} song`}
      description={`${
        isEditing ? "Update " + initialData?.title : "Create a new"
      } song.`}
      isOpen={isUploadModalOpen}
      handleChange={(open) => !open && onUploadModalClose()}
    >
      <form action={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          defaultValue={isEditing ? initialData?.title : ""}
          name="title"
          disabled={phase !== "none"}
          placeholder="Song title"
          required
          aria-label="Enter the song title"
          className="bg-white/10 border-none outline-none rounded-md"
          maxLength={100}
        />

        <Input
          defaultValue={isEditing ? initialData?.artist : ""}
          name="artist"
          disabled={phase !== "none"}
          placeholder="Song artist"
          required
          aria-label="Enter the artist's name"
          className="bg-white/10 border-none outline-none rounded-md"
          maxLength={50}
        />

        <SongInput
          isEditing={isEditing}
          phase={phase}
          uploadProgress={uploadProgress.song}
        />

        <ImageInput
          isEditing={isEditing}
          phase={phase}
          uploadProgress={uploadProgress.image}
        />

        <hr className="my-4 border-none h-[1px] bg-white/20 rounded-full" />

        <Button disabled={phase !== "none"} type="submit" aria-live="polite">
          {phase === "none" && (isEditing ? "Update" : "Create")}
          {phase === "validating" && "Validating user input..."}
          {phase === "updating" && "Updating the music..."}
          {phase === "creating" && "Creating the music..."}
          {phase === "uploading" && "Uploading the files..."}
        </Button>

        {phase !== "none" && (
          <Button
            disabled={phase === "creating"}
            type="button"
            onClick={(e) => {
              e.currentTarget.textContent = "Cancelling...";
              handleCancel();
            }}
            className="from-rose-500 to-rose-600"
          >
            Cancel uploading
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default UploadModal;
