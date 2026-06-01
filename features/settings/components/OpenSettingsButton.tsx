"use client";

import { FiSettings } from "react-icons/fi";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useSettingsModal } from "@/features/settings/store/useSettingsModal";

const OpenSettingsButton = () => {
  const { onOpen } = useSettingsModal();

  return (
    <button
      className={cnWithReduceMotion(
        "flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none text-neutral-400 py-1 transition-colors",
      )}
      onClick={onOpen}
    >
      <FiSettings size={22} aria-hidden />
      <p className="truncate ml-[2px]">Settings</p>
    </button>
  );
};

export default OpenSettingsButton;
