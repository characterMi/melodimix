"use client";

import type { Song } from "@/types/types";
import { useState } from "react";
import Box from "./Box";
import DownloadApplication from "./DownloadApplication";
import Library from "./Library";

const MobileSidebar = ({ songs }: { songs: Song[] }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div
        aria-label="Sidebar container"
        className={`fixed bg-neutral-900 flex flex-col z-50 transition ${
          isActive ? "translate-x-0" : "-translate-x-full"
        } left-0 top-0 h-screen w-[200px] min-[360px]:w-[300px] sm:w-[360px] md:hidden`}
      >
        <div
          className="fixed top-[40%] -translate-y-[40%] left-full bg-neutral-900 size-14 flex flex-col gap-y-[6px] justify-center items-end pl-2 rounded-r-xl z-50 md:hidden cursor-pointer"
          onClick={() => setIsActive((prev) => !prev)}
          style={{ direction: "rtl" }}
          role="button"
          aria-controls="sidebar"
          aria-expanded={isActive}
          id="menu-toggle"
        >
          <span
            className={`h-1 rounded-full w-[60%] bg-white transition ${
              isActive && "opacity-0"
            }`}
          />
          <span
            className={`h-1 rounded-full w-[85%] bg-white transition ${
              isActive && "rotate-45 -mb-[10px]"
            }`}
          />
          <span
            className={`h-1 rounded-full w-[85%] bg-white transition ${
              isActive && "-rotate-45 mb-[10px]"
            }`}
          />
        </div>

        <aside
          id="sidebar"
          aria-labelledby="menu-toggle"
          role="menu"
          className="overflow-y-auto"
          aria-hidden={!isActive}
        >
          <div className="download-btn">
            <Box className="m-4">
              <DownloadApplication />
            </Box>

            <hr className="border-neutral-600" />
          </div>

          <Library songs={songs} />
        </aside>
      </div>

      <div
        aria-hidden
        className={`layout md:hidden fixed w-screen h-screen top-0 left-0 bg-black/35 backdrop-blur-sm transition ${
          isActive ? "z-40 opacity-100" : "-z-10 opacity-0"
        }`}
      />
    </>
  );
};

export default MobileSidebar;
