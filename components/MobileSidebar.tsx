"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useFocusTrap } from "@/hooks/useFocusTrap";

import DownloadApplication from "./DownloadApplication";
import Library from "./Library";
import Loader from "./Loader";

import type { Song } from "@/types";
import OpenSettingsButton from "./OpenSettingsButton";

const MobileSidebarTrigger = ({
  openMobileSidebar,
  isActive,
}: {
  openMobileSidebar: () => void;
  isActive: boolean;
}) => {
  const dragTimeoutRef = useRef<NodeJS.Timeout>();

  const [positionY, setPositionY] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedPosition = localStorage.getItem("sidebar-trigger-y");
    if (!savedPosition || isNaN(Number(savedPosition))) return;

    setPositionY(+savedPosition);
  }, []);

  useEffect(() => {
    if (isDragging) return;

    localStorage.setItem("sidebar-trigger-y", String(positionY));
  }, [positionY, isDragging]);

  return (
    <button
      className={twMerge(
        "fixed left-full bg-neutral-900 size-14 flex flex-col gap-y-[6px] justify-center items-end pl-2 rounded-r-xl z-50 md:hidden cursor-pointer",
        isDragging && "outline outline-2 outline-green-500"
      )}
      onTouchStart={() => {
        dragTimeoutRef.current = setTimeout(() => {
          setIsDragging(true);
        }, 500);
      }}
      onTouchEnd={() => {
        clearTimeout(dragTimeoutRef.current);

        if (isDragging) {
          setIsDragging(false);
        } else {
          openMobileSidebar();
        }
      }}
      onTouchMove={(e) => {
        if (!isDragging) return;

        const { clientY } = e.touches[0];

        const newYPercentage = (clientY / window.innerHeight) * 100;
        const clampedY = Math.max(5, Math.min(newYPercentage, 95));
        setPositionY(clampedY);
      }}
      style={{
        top: `${positionY}%`,
        transform: "translateY(-50%)",
        direction: "rtl",
      }}
      aria-controls="sidebar"
      aria-expanded={isActive}
      aria-label="Menu toggle button"
    >
      <span
        className={twMerge(
          "h-1 rounded-full w-[60%] bg-white transition",
          isActive && "opacity-0"
        )}
        aria-hidden
      />
      <span
        className={twMerge(
          "h-1 rounded-full w-[85%] bg-white transition",
          isActive && "rotate-45 -mt-[10px]"
        )}
        aria-hidden
      />
      <span
        className={twMerge(
          "h-1 rounded-full w-[85%] bg-white transition",
          isActive && "-rotate-45 -mt-[10px]"
        )}
        aria-hidden
      />
    </button>
  );
};

const MobileSidebar = ({
  songs,
  isSongsLoading = true,
}: {
  songs: Song[];
  isSongsLoading: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useFocusTrap<HTMLDivElement>(sidebarContainerRef, isActive);

  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.history.back();
      }
    };

    const onPopState = () => setIsActive(false);

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", onPopState);
    };
  }, [isActive]);

  const openMobileSidebar = useCallback(() => {
    if (isActive) {
      window.history.back();
      return;
    }

    const url = new URL(window.location.href);

    url.searchParams.set("isMobileSidebarActive", "true");

    // The reason we don't use router is because the router causes reload on offline mode.
    window.history.pushState({ isMobileSidebarActive: true }, "", url);
    setIsActive(true);
  }, [isActive]);

  return (
    <>
      <div
        className={twMerge(
          "fixed bg-neutral-900 flex flex-col z-50 transition left-0 top-0 h-screen w-[200px] min-[360px]:w-[300px] sm:w-[360px] md:hidden",
          isActive ? "translate-x-0" : "-translate-x-full"
        )}
        ref={sidebarContainerRef}
      >
        <MobileSidebarTrigger
          isActive={isActive}
          openMobileSidebar={openMobileSidebar}
        />

        <aside
          ref={sidebarRef}
          id="sidebar"
          className={twMerge(
            "overflow-y-auto",
            !isActive && "pointer-events-none invisible"
          )}
          aria-hidden={!isActive}
        >
          <div className="flex flex-col gap-4 p-4">
            <OpenSettingsButton />
            <DownloadApplication />

            <hr className="border-neutral-600" />
          </div>

          {isSongsLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <Library songs={songs} isMobile />
          )}
        </aside>
      </div>

      <div
        onClick={openMobileSidebar}
        aria-hidden
        className={`layout md:hidden fixed w-screen h-screen top-0 left-0 bg-black/35 backdrop-blur-sm transition ${
          isActive ? "z-40 opacity-100" : "-z-10 opacity-0"
        }`}
      />
    </>
  );
};

export default MobileSidebar;
