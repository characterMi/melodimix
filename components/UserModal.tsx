import { updateUserData } from "@/actions/updateUserData";
import { onError } from "@/lib/onError";
import { useUserModal } from "@/store/useUserModal";
import type { User } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Avatar } from "./Avatar";
import Button from "./Button";
import Input from "./Input";
import Loader from "./Loader";
import Modal from "./Modal";

const UpdateUserForm = ({
  user,
  closeUserModal,
  refreshSession,
}: {
  user: User;
  closeUserModal: () => void;
  refreshSession: () => Promise<void>;
}) => {
  const [isSubmitting, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return;

    if (!user) {
      toast.error("Unauthenticated User.", {
        ariaProps: { role: "alert", "aria-live": "polite" },
      });
      return;
    }

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

    startTransition(async () => {
      const { error } = await updateUserData(formData);

      if (error) {
        onError(error);
        return;
      }

      await refreshSession();
      toast.success("Your profile has been updated!");
      closeUserModal();
    });
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-col items-center gap-8 w-full"
    >
      <Avatar avatarUrl={user.avatar_url} isSubmitting={isSubmitting} />

      <div className="flex flex-col gap-4 w-full">
        <Input
          name="name"
          defaultValue={user.name ?? "Guest"}
          type="text"
          disabled={isSubmitting}
          placeholder="Name"
          required
          aria-label="Enter your name"
          maxLength={50}
        />

        <Input
          name="fullname"
          defaultValue={user.full_name ?? "Guest"}
          type="text"
          placeholder="Full name"
          required
          aria-label="Enter your full name"
          disabled={isSubmitting}
          maxLength={100}
        />

        <div className="flex w-full rounded-sm bg-neutral-700 border bg-transparent px-3 py-3 text-sm cursor-not-allowed opacity-50 select-all">
          {user.email}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update"}
      </Button>
    </form>
  );
};

const UserModal = () => {
  const { isOpen, onClose } = useUserModal();
  const {
    session,
    isLoading: isUserLoading,
    supabaseClient,
  } = useSessionContext();

  return (
    <Modal
      title="Edit profile"
      description={"Update your data"}
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    >
      <div className="h-[30rem]">
        <hr />
        <div className="flex items-center justify-center h-full mt-2">
          {isUserLoading && (
            <>
              <p>Getting user data...</p>
              <Loader className="min-w-8" />
            </>
          )}

          {!isUserLoading && session && (
            <UpdateUserForm
              user={session.user.user_metadata as User}
              closeUserModal={onClose}
              refreshSession={async () => {
                await supabaseClient.auth.refreshSession({
                  refresh_token: session.refresh_token,
                });
              }}
            />
          )}

          {!isUserLoading && !session && (
            <p className="text-rose-50">You are not logged in!</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
