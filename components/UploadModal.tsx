import { useTransition } from "react";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { uploadSongToStorage } from "@/actions/uploadSong";
import toast from "react-hot-toast";

const UploadModal = () => {
  const [isLoading, startTransition] = useTransition();

  const uploadModal = useUploadModal();

  const { user } = useUser();

  const handleSubmit = (formData: FormData) => {
    if (!user) {
      toast.error("Unauthenticated User.");

      return;
    }

    startTransition(() => {
      uploadSongToStorage(formData, user.id)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);

            console.error(res.error);

            return;
          }

          toast.success("Song successfully created !");
          uploadModal.onClose();
        })
        .catch((err) => {
          console.error(err);

          toast.error("Something went wrong. Please check Your connection.");
        });
    });
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file."
      isOpen={uploadModal.isOpen}
      handleChange={() => !open && uploadModal.onClose()}
    >
      <form action={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          name="title"
          disabled={isLoading}
          placeholder="Song title"
          required
        />

        <Input
          name="author"
          disabled={isLoading}
          placeholder="Song author"
          required
        />

        <div>
          <h3 className="pb-1">Select a song file</h3>

          <Input
            name="song"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            required
          />
        </div>

        <div>
          <h3 className="pb-1">Select an image</h3>

          <Input
            name="img"
            disabled={isLoading}
            type="file"
            accept="image/*"
            required
          />
        </div>

        <Button disabled={isLoading} type="submit">
          {isLoading ? "Uploading the music..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
