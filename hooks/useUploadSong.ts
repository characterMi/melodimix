import { revalidatePath } from "@/actions/revalidatePath";
import { useHomePageData } from "@/store/useHomePageData";
import { useUploadModal } from "@/store/useUploadModal";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

export const useUploadSong = () => {
  const [isUploading, startTransition] = useTransition();
  const uploadModal = useUploadModal();
  const addUploadedSongToSongs = useHomePageData((state) => state.addOne);
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    if (!uploadModal.isOpen || isUploading) return;

    if (!session?.user) {
      toast.error("Unauthenticated User.", {
        ariaProps: { role: "alert", "aria-live": "polite" },
      });

      return;
    }

    toast.success("this process might take a while, do not close the modal.");

    startTransition(async () => {
      try {
        const user = session.user;

        const imageFile = formData.get("img");
        const songFile = formData.get("song");
        const title = (formData.get("title") as string | undefined)?.trim();
        const author = (formData.get("author") as string | undefined)?.trim();

        if (!imageFile || !songFile || !title || !author) {
          toast.error("Missing fields !");
          return;
        }

        if (title.length > 100 || author.length > 50) {
          toast.error("Title or Author is too long!");
          return;
        }

        const uniqueId = crypto.randomUUID();

        const uploadSongPromise = supabaseClient.storage
          .from("songs")
          .upload(`song-${title}-${uniqueId}`, songFile);
        const uploadImagePromise = supabaseClient.storage
          .from("images")
          .upload(`image-${title}-${uniqueId}`, imageFile);

        const [
          { data: songData, error: songError },
          { data: imageData, error: imageError },
        ] = await Promise.all([uploadSongPromise, uploadImagePromise]);

        if (songError || imageError) {
          toast.error("Failed to upload the song!");

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
          toast.error("Something went wrong while uploading the song!");

          return;
        }

        addUploadedSongToSongs({
          id: uniqueId,
          author,
          title,
          img_path: imageData.path,
          song_path: songData.path,
          user_id: user.id,
        });

        toast.success("Song created!");
        revalidatePath("/", "layout");
        router.refresh();
        uploadModal.onClose();
      } catch (error: any) {
        console.error(error);

        toast.error("Something's wrong with the Server...'");
      }
    });
  };

  return {
    isModalOpen: uploadModal.isOpen,
    closeModal: uploadModal.onClose,
    handleSubmit,
    isUploading,
  };
};
