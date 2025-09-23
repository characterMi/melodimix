import { useUploadOrUpdateSong } from "@/hooks/useUploadOrUpdateSong";

import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

const UploadModal = () => {
  const {
    isEditing,
    handleSubmit,
    phase,
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
          maxLength={100}
        />

        <Input
          defaultValue={isEditing ? initialData?.artist : ""}
          name="artist"
          disabled={phase !== "none"}
          placeholder="Song artist"
          required
          aria-label="Enter the artist's name"
          maxLength={50}
        />

        <div>
          <label htmlFor="song" className="pb-1">
            Select a song file {isEditing && "(optional)"}
          </label>

          <Input
            name="song"
            id="song"
            disabled={phase !== "none"}
            type="file"
            accept=".mp3"
            required={!isEditing}
          />
        </div>

        <div>
          <label htmlFor="img" className="pb-1">
            Select an image {isEditing && "(optional)"}
          </label>

          <Input
            name="img"
            id="img"
            disabled={phase !== "none"}
            type="file"
            accept="image/*"
            required={!isEditing}
          />
        </div>

        <Button disabled={phase !== "none"} type="submit">
          {phase === "none" && isEditing && "Update"}
          {phase === "none" && !isEditing && "Create"}
          {phase === "validating" && "Validating user input..."}
          {phase === "updating" && "Updating the music..."}
          {phase === "creating" && "Creating the music..."}
          {phase === "uploading" && "Uploading the files..."}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
