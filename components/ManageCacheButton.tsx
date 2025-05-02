"use client";

import { useManageCacheModal } from "@/store/useManageCacheModal";
import { MdOutlineStorage } from "react-icons/md";

const ManageCacheButton = () => {
  const openModal = useManageCacheModal((state) => state.onOpen);

  return (
    <button
      className="flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1"
      onClick={openModal}
    >
      <MdOutlineStorage size={24} aria-hidden />
      <p className="truncate">Manage Cache</p>
    </button>
  );
};

export default ManageCacheButton;
