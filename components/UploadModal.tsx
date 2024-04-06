import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

const UploadModal = () => {
  const [isLoading, startTransition] = useTransition();

  const router = useRouter();

  const uploadModal = useUploadModal();

  const { user } = useUser();

  const supabaseClient = useSupabaseClient();

  const {
    register,
    handleSubmit: onSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      img: null,
    },
  });

  const handleChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const handleSubmit: SubmitHandler<FieldValues> = async (values) => {
    startTransition(async () => {
      try {
        const imageFile = values.img?.[0];
        const songFile = values.song?.[0];

        if (
          !imageFile ||
          !songFile ||
          !user ||
          !values.title.trim() ||
          !values.author.trim()
        ) {
          toast.error("Missing fields");
          return;
        }

        const uniqueId = crypto.randomUUID();

        // Upload song
        const { data: songData, error: songError } =
          await supabaseClient.storage
            .from("songs")
            .upload(`song-${values.title.trim()}-${uniqueId}`, songFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (songError) {
          toast.error("We could not upload the Song. plz try again !");
          return;
        }

        // Upload image
        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from("images")
            .upload(`image-${values.title.trim()}-${uniqueId}`, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (imageError) {
          toast.error("We could not upload the Image. plz try again !");
          return;
        }

        const { error: supabaseError } = await supabaseClient
          .from("songs")
          .insert({
            user_id: user.id,
            title: values.title.trim(),
            author: values.author.trim(),
            img_path: imageData.path,
            song_path: songData.path,
          });

        if (supabaseError) {
          toast.error(supabaseError.message);
          return;
        }

        router.refresh();
        toast.success("Song created !");
        reset();
        uploadModal.onClose();
      } catch (error) {
        toast.error("Something went wrong. Check your internet connection.");
      }
    });
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file."
      isOpen={uploadModal.isOpen}
      handleChange={handleChange}
    >
      <form onSubmit={onSubmit(handleSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />

        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />

        <div>
          <h3 className="pb-1">Select a song file</h3>

          <Input
            id="song"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            {...register("song", { required: true })}
          />
        </div>

        <div>
          <h3 className="pb-1">Select an image</h3>

          <Input
            id="img"
            disabled={isLoading}
            type="file"
            accept="image/*"
            {...register("img", { required: true })}
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
