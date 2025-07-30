"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDownload } from "react-icons/hi";

const DownloadApplication = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  const handleDownload = () => {
    if (deferredPrompt) {
      // @ts-ignore: There no specific type for "beforeInstallPrompt" event.
      deferredPrompt.prompt();
    } else {
      toast.success(
        `To install the app look for "Add to Homescreen" or install in your browser's menu.`
      );
    }
  };
  useEffect(() => {
    const handleBIP = (e: Event) => {
      e.preventDefault();

      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBIP);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBIP);
    };
  }, []);

  return (
    <button
      className="download-btn flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none transition text-neutral-400 py-1"
      onClick={handleDownload}
    >
      <HiOutlineDownload size={24} aria-hidden />
      <p className="truncate">Download Application</p>
    </button>
  );
};
export default DownloadApplication;
