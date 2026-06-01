"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import { useGetLikedSongs } from "@/features/like-song/hooks/useGetLikedSongs";
import { registerServiceWorker } from "@/features/pwa/lib/registerServiceWorker";

const Root = ({ children }: { children: React.ReactNode }) => {
  useGetLikedSongs();

  useEffect(() => {
    registerServiceWorker();

    const shouldShowShortcutHelper =
      localStorage.getItem("show-shortcut-helper") === null;

    if (shouldShowShortcutHelper) {
      toast.success("Use Alt + P to focus the Player.", {
        style: {
          flexDirection: "column-reverse",
          padding: "1rem 1.2rem",
        },
        icon: (
          <button
            className="mt-2 px-2 py-1 rounded-sm bg-emerald-700/80 outline-none transition-opacity hover:opacity-50 focus-visible:opacity-50"
            onClick={() => {
              toast.dismiss("shortcut-toast");
              localStorage.setItem("show-shortcut-helper", "false");
            }}
          >
            Got it!
          </button>
        ),
        id: "shortcut-toast",
        duration: Infinity,
      });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.key !== "p") return;

      e.preventDefault();

      const durationNavigator = document.querySelector<HTMLDivElement>(
        "#duration-navigator",
      );

      if (!durationNavigator) {
        toast.error("The Player is not active.");
        return;
      }

      durationNavigator.focus();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return children;
};

export default Root;
