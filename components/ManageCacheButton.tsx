"use client";

import { useManageCacheModal } from "@/store/useManageCacheModal";
import { GrStorage } from "react-icons/gr";

const ManageCacheButton = () => {
  const openModal = useManageCacheModal((state) => state.onOpen);

  return (
    <button
      className="flex flex-row h-auto items-center w-full gap-x-[14px] text-sm font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1"
      onClick={openModal}
    >
      <GrStorage size={22} aria-hidden />
      <p className="truncate ml-[2px]">Manage Cache</p>
    </button>
  );
};

export default ManageCacheButton;
