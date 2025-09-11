import { useUploadOrUpdateSong } from "@/hooks/useUploadOrUpdateSong";

import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

const UploadModal = () => {
  const {
    isEditing,
    handleSubmit,
    isUploading,
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
          disabled={isUploading}
          placeholder="Song title"
          required
          aria-label="Enter the song title"
          maxLength={100}
        />

        <Input
          defaultValue={isEditing ? initialData?.artist : ""}
          name="artist"
          disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
            type="file"
            accept="image/*"
            required={!isEditing}
          />
        </div>

        <Button disabled={isUploading} type="submit">
          {isEditing && (isUploading ? "Updating..." : "Update")}
          {!isEditing && (isUploading ? "Uploading the music..." : "Create")}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
