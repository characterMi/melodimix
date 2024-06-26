"use client";

import type { Song } from "@/types/types";
import { useState } from "react";
import Library from "./Library";

const MobileSidebar = ({ songs }: { songs: Song[] }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <aside
        className={`fixed bg-neutral-900 flex flex-col z-50 transition ${
          isActive ? "translate-x-0" : "-translate-x-full"
        } left-0 top-0 h-screen w-[200px] min-[360px]:w-[300px] sm:w-[360px] md:hidden`}
      >
        <div
          className="fixed top-1/2 -translate-y-1/2 left-full bg-neutral-900 size-14 flex flex-col gap-y-[6px] justify-center items-end pr-2 rounded-r-xl z-50 md:hidden cursor-pointer"
          onClick={() => setIsActive((prev) => !prev)}
        >
          <div
            className={`h-1 rounded-full w-[60%] bg-white transition ${
              isActive && "opacity-0"
            }`}
          />
          <div
            className={`h-1 rounded-full w-[85%] bg-white transition ${
              isActive && "rotate-45 -mb-[10px]"
            }`}
          />
          <div
            className={`h-1 rounded-full w-[85%] bg-white transition ${
              isActive && "-rotate-45 mb-[10px]"
            }`}
          />
        </div>

        <div className="overflow-y-auto">
          <Library songs={songs} />
        </div>
      </aside>

      <div
        className={`layout fixed w-screen h-screen top-0 left-0 bg-black/35 backdrop-blur-sm transition ${
          isActive ? "z-40 opacity-100" : "-z-10 opacity-0"
        }`}
      />
    </>
  );
};

export default MobileSidebar;
