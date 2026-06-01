"use client";

import { FiSettings } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

import { useSettingsModal } from "@/features/settings/store/useSettingsModal";
import { shouldReduceMotion } from "@/lib/reduceMotion";

const OpenSettingsButton = () => {
  const { onOpen } = useSettingsModal();

  return (
    <button
      className={twMerge(
        "flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none text-neutral-400 py-1",
        !shouldReduceMotion && "transition-colors",
      )}
      onClick={onOpen}
    >
      <FiSettings size={22} aria-hidden />
      <p className="truncate ml-[2px]">Settings</p>
    </button>
  );
};

export default OpenSettingsButton;
