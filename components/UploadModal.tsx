import { revalidatePath } from "@/actions/revalidatePath";
import { useUser } from "@/hooks/useUser";
import { useUploadedSongs } from "@/store/useUploadedSongs";
import { useUploadModal } from "@/store/useUploadModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

const UploadModal = () => {
  const [isLoading, startTransition] = useTransition();
  const setUploadedSongs = useUploadedSongs((state) => state.setUploadedSongs);
  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleSubmit = (formData: FormData) => {
    if (!uploadModal.isOpen) return;

    if (!user) {
      toast.error("Unauthenticated User.", {
        ariaProps: { role: "alert", "aria-live": "polite" },
      });

      return;
    }

    toast.success("this process might take a while, do not close the modal.");

    startTransition(async () => {
      try {
        const imageFile = formData.get("img");
        const songFile = formData.get("song");
        const title = (formData.get("title") as string).trim();
        const author = (formData.get("author") as string).trim();

        if (!imageFile || !songFile || !title || !author) {
          toast.error("Missing fields !");
          return;
        }

        const uniqueId = crypto.randomUUID();

        // Upload song
        const { data: songData, error: songError } =
          await supabaseClient.storage
            .from("songs")
            .upload(`song-${title}-${uniqueId}`, songFile);

        if (songError) {
          console.error("Song Error => ", songError);

          toast.error("Upload song failed !");

          return;
        }

        // Upload image
        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from("images")
            .upload(`image-${title}-${uniqueId}`, imageFile);

        if (imageError) {
          console.error("Image Error => ", imageError);

          toast.error("Upload image failed !");

          return;
        }

        const { error: supabaseError } = await supabaseClient
          .from("songs")
          .insert({
            user_id: user.id,
            title,
            author,
            img_path: imageData.path,
            song_path: songData.path,
          });

        if (supabaseError) {
          console.error("Supabase Error => ", supabaseError);

          toast.error("Something went wrong while uploading the song!");

          return;
        }

        toast.success("Song created!");
        setUploadedSongs(title);
        revalidatePath();
        uploadModal.onClose();
      } catch (error: any) {
        console.error(error);

        toast.error("Something's wrong with the Server...'");
      }
    });
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file."
      isOpen={uploadModal.isOpen}
      handleChange={(open) => !open && uploadModal.onClose()}
    >
      <form action={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          name="title"
          disabled={isLoading}
          placeholder="Song title"
          required
          aria-label="Enter the song title"
        />

        <Input
          name="author"
          disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            type="file"
            accept="image/*"
            required
            aria-labelledby="select-image"
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
