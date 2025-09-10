"use client";

import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useSettingsModal } from "@/store/useSettingsModal";
import { FiSettings } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const OpenSettingsButton = () => {
  const { onOpen } = useSettingsModal();

  return (
    <button
      className={twMerge(
        "flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none text-neutral-400 py-1",
        !shouldReduceMotion && "transition-colors"
      )}
      onClick={onOpen}
    >
      <FiSettings size={22} aria-hidden />
      <p className="truncate ml-[2px]">Settings</p>
    </button>
  );
};

export default OpenSettingsButton;
