import { useTransition } from "react";

import { updateUserData } from "@/actions/user.actions";
import { useSession } from "@/hooks/useSession";
import { setPersistSessionCookie } from "@/lib/getPersistSessionCookie";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { useSessionStore } from "@/store/useSessionStore";
import { useUserModal } from "@/store/useUserModal";

import Avatar from "./Avatar";
import Button from "./Button";
import Input from "./Input";
import Loader from "./Loader";
import Modal from "./Modal";

import type { AuthResponse, Session } from "@supabase/supabase-js";

const UpdateUserForm = ({
  session,
  closeUserModal,
  refreshSession,
}: {
  session: Session;
  closeUserModal: () => void;
  refreshSession: () => Promise<AuthResponse>;
}) => {
  const [isSubmitting, startTransition] = useTransition();
  const updateSessionStore = useSessionStore((state) => state.updateStore);

  const user = session.user.user_metadata;

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return;

    if (!session) {
      onError("Unauthenticated User.");
      return;
    }

    if (!navigator.onLine) {
      onError(
        "You're currently offline, make sure you're online, then try again."
      );
      return;
    }

    startTransition(async () => {
      const { error, updatedUser } = await updateUserData(formData);

      if (error) {
        onError(error);
        return;
      }

      const { error: refreshError } = await refreshSession();

      if (refreshError) {
        onError(
          "Couldn't refresh the session (No worries though, your data has been successfully updated in the Database).",
          refreshError
        );
        return;
      }

      setPersistSessionCookie();
      updateSessionStore(
        { ...session, user: { ...session.user, user_metadata: updatedUser! } },
        false
      );
      onSuccess("Your profile has been updated!");
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
  const { session, isLoading: isUserLoading, supabaseClient } = useSession();

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
              session={session}
              closeUserModal={onClose}
              refreshSession={async () => {
                return await supabaseClient.auth.refreshSession(session);
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
