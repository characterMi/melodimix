import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useHomePageData } from "@/store/useHomePageData";
import { useUploadModal } from "@/store/useUploadModal";
import { useEffect, useTransition } from "react";
import { updateSong } from "@/actions/updateSong";
import { uploadSong } from "@/actions/uploadSong";

const UploadModal = () => {
  const [isUploading, startTransition] = useTransition();
  const { isOpen, onClose, clearInitialData, initialData } = useUploadModal();
  const { addOne: addUploadedSongToSongs, updateOne: updateUploadedSong } =
    useHomePageData((state) => ({
      addOne: state.addOne,
      updateOne: state.updateOne,
    }));
  const { session } = useSessionContext();
  const router = useRouter();

  const isEditing = !!initialData;

  const handleSubmit = (formData: FormData) => {
    if (!isOpen || isUploading) return;

    if (!session?.user) {
      toast.error("Unauthenticated User.", {
        ariaProps: { role: "alert", "aria-live": "polite" },
      });

      return;
    }

    toast.success("this process might take a while, do not close the modal.");

    startTransition(async () => {
      try {
        if (isEditing) {
          const { error, updatedSong } = await updateSong(formData, {
            id: initialData.id,
            img_path: initialData.img_path,
            song_path: initialData.song_path,
          });

          if (error) {
            toast.error(error);
            return;
          }

          updateUploadedSong(updatedSong!);
        } else {
          const { error, uploadedSong } = await uploadSong(formData);

          if (error) {
            toast.error(error);
            return;
          }

          addUploadedSongToSongs(uploadedSong!);
        }

        toast.success(`Song ${isEditing ? "updated" : "created"}!`);
        router.refresh();
        onClose();
      } catch (error: any) {
        console.error(error);

        toast.error("Something went wrong.");
      }
    });
  };

  useEffect(() => {
    if (!isOpen) {
      clearInitialData();
    }
  }, [isOpen]);

  return (
    <Modal
      title={`${isEditing ? "Update" : "Add a"} song`}
      description={`${
        isEditing ? "Update " + initialData?.title : "Create a new"
      } song.`}
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    >
      <form action={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          defaultValue={isEditing ? initialData.title : ""}
          name="title"
          disabled={isUploading}
          placeholder="Song title"
          required
          aria-label="Enter the song title"
          maxLength={100}
        />

        <Input
          defaultValue={isEditing ? initialData.author : ""}
          name="author"
          disabled={isUploading}
          placeholder="Song author"
          required
          aria-label="Enter the author's name"
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
