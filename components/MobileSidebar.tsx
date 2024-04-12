"use client";

import type { Song } from "@/types/types";
import { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
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
          className="fixed top-1/3 left-full bg-neutral-900 size-14 flex justify-center items-center rounded-r-md z-50 md:hidden cursor-pointer"
          onClick={() => setIsActive((prev) => !prev)}
        >
          {isActive ? (
            <h1 className="text-3xl">X</h1>
          ) : (
            <HiOutlineMenu size={28} />
          )}
        </div>

        <Library songs={songs} />
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
