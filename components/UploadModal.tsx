import { useUploadSong } from "@/hooks/useUploadSong";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

const UploadModal = () => {
  const { isModalOpen, closeModal, handleSubmit, isUploading } =
    useUploadSong();

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file."
      isOpen={isModalOpen}
      handleChange={(open) => !open && closeModal()}
    >
      <form action={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          name="title"
          disabled={isUploading}
          placeholder="Song title"
          required
          aria-label="Enter the song title"
        />

        <Input
          name="author"
          disabled={isUploading}
          placeholder="Song author"
          required
          aria-label="Enter the author's name"
        />

        <div>
          <h3 className="pb-1" id="select-song">
            Select a song file
          </h3>

          <Input
            name="song"
            disabled={isUploading}
            type="file"
            accept=".mp3"
            aria-labelledby="select-song"
            required
          />
        </div>

        <div>
          <h3 className="pb-1" id="select-image">
            Select an image
          </h3>

          <Input
            name="img"
            disabled={isUploading}
            type="file"
            accept="image/*"
            required
            aria-labelledby="select-image"
          />
        </div>

        <Button disabled={isUploading} type="submit">
          {isUploading ? "Uploading the music..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
