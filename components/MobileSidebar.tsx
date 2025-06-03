"use client";

import type { Song } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import DownloadApplication from "./DownloadApplication";
import Library from "./Library";
import Loader from "./Loader";
import ManageCacheButton from "./ManageCacheButton";

const MobileSidebar = ({
  songs,
  isSongsLoading = true,
}: {
  songs: Song[];
  isSongsLoading: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive) {
      sidebarRef.current?.setAttribute("inert", "");
    } else {
      sidebarRef.current?.removeAttribute("inert");
    }
  }, [isActive]);

  return (
    <>
      <div
        className={twMerge(
          "fixed bg-neutral-900 flex flex-col z-50 transition left-0 top-0 h-screen w-[200px] min-[360px]:w-[300px] sm:w-[360px] md:hidden",
          isActive ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          className="fixed top-[40%] -translate-y-[40%] left-full bg-neutral-900 size-14 flex flex-col gap-y-[6px] justify-center items-end pl-2 rounded-r-xl z-50 md:hidden cursor-pointer"
          onClick={() => setIsActive((prev) => !prev)}
          style={{ direction: "rtl" }}
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
            <ManageCacheButton />
            <DownloadApplication />

            <hr className="border-neutral-600" />
          </div>

          {isSongsLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <Library songs={songs} />
          )}
        </aside>
      </div>

      <div
        onClick={() => setIsActive(false)}
        aria-hidden
        className={`layout md:hidden fixed w-screen h-screen top-0 left-0 bg-black/35 backdrop-blur-sm transition ${
          isActive ? "z-40 opacity-100" : "-z-10 opacity-0"
        }`}
      />
    </>
  );
};

export default MobileSidebar;
