"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDownload } from "react-icons/hi";

interface RelatedApp {
  platform: "webapp";
  url: string;
  id?: string;
}

interface NavigatorWithRelatedApps extends Navigator {
  getInstalledRelatedApps: () => Promise<RelatedApp[]>;
}

const DownloadApplication = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

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
    const checkInstallationStatus = async () => {
      const nav = navigator as NavigatorWithRelatedApps;

      if (nav.getInstalledRelatedApps) {
        const relatedApps = await nav.getInstalledRelatedApps();
        const isInstalled = relatedApps.some(
          (app) => app.platform === "webapp"
        );

        if (isInstalled) setIsAppInstalled(true);
      }
    };

    checkInstallationStatus();

    const handleBIP = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBIP);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBIP);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return (
    <button
      className="download-btn flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none transition-colors text-neutral-400 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleDownload}
      disabled={isAppInstalled}
    >
      <HiOutlineDownload size={24} aria-hidden />
      <p className="truncate">
        {isAppInstalled ? "Application Installed" : "Download Application"}
      </p>
    </button>
  );
};

export default DownloadApplication;
