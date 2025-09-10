"use client";

import { useSettingsModal } from "@/store/useSettingsModal";
import { FiSettings } from "react-icons/fi";

const OpenSettingsButton = () => {
  const { onOpen } = useSettingsModal();

  return (
    <button
      className="flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none transition text-neutral-400 py-1"
      onClick={onOpen}
    >
      <FiSettings size={22} aria-hidden />
      <p className="truncate ml-[2px]">Settings</p>
    </button>
  );
};

export default OpenSettingsButton;
