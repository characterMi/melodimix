"use client";

import { useSession } from "@/hooks/useSession";
import { useAuthModal } from "@/store/useAuthModal";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Modal from "./Modal";

const AuthModal = () => {
  const router = useRouter();

  const { session, supabaseClient } = useSession();

  const { isOpen, onClose } = useAuthModal();

  useEffect(() => {
    if (session) {
      navigator.onLine && router.refresh();

      onClose();
    }
  }, [session, router, onClose]);

  return (
    <Modal
      title="Welcome Back"
      description="Login to your account"
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    >
      <Auth
        theme="dark"
        providers={["github"]}
        magicLink
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#22c55e",
              },
            },
          },
        }}
      />
    </Modal>
  );
};
export default AuthModal;
