"use client";

import { Root, Thumb } from "@radix-ui/react-switch";
import { Fragment, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { GrStorage } from "react-icons/gr";
import { HiOutlineCloudDownload } from "react-icons/hi";
import { MdAnimation, MdArrowOutward } from "react-icons/md";
import { PiVibrateBold } from "react-icons/pi";
import { TbMessageReport } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import { getItemFromLocalStorage } from "@/lib/getItemFromLocalStorage";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useDownloadedSongsModal } from "@/store/useDownloadedSongsModal";
import { useManageCacheModal } from "@/store/useManageCacheModal";
import { useSettingsModal } from "@/store/useSettingsModal";

import Modal from "./Modal";

const settingItems = [
  {
    type: "switch",
    name: "vibration" as const,
    title: "Vibration",
    icon: PiVibrateBold,
  },
  {
    type: "switch",
    name: "reduce-motion" as const,
    title: "Reduce motion",
    icon: MdAnimation,
  },
  {
    type: "button",
    title: "Cache usage",
    icon: GrStorage,
    onClick: () => useManageCacheModal.getState().onOpen(),
  },
  {
    type: "button",
    title: "Report an issue",
    icon: TbMessageReport,
    onClick: () =>
      window.open("mailto:workabolfazltaghadosi@gmail.com", "_blank"),
  },
  {
    type: "button",
    title: "Downloaded songs",
    icon: HiOutlineCloudDownload,
    onClick: () => useDownloadedSongsModal.getState().onOpen(),
  },
];

const SettingsModal = () => {
  const [checkBoxes, setCheckBoxes] = useState({
    vibration:
      getItemFromLocalStorage("vibration", ["true", "false"], "true") ===
      "true",
    "reduce-motion":
      getItemFromLocalStorage("reduce-motion", ["true", "false"], "false") ===
      "true",
  });
  const { isOpen, onClose } = useSettingsModal();

  return (
    <Modal
      title="App Settings"
      description="Manage Application settings"
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
      containerClassName="flex flex-col gap-20 justify-between size-full pt-12 md:pt-10 md:pb-4"
    >
      <div className="flex flex-col gap-6 xss:px-6 sm:px-6 md:px-0">
        {settingItems.map(({ title, type, name, icon: Icon, onClick }, i) => (
          <Fragment key={title}>
            {i !== 0 && <hr className="border-none h-[1px] bg-neutral-600" />}

            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex gap-2 items-center justify-center truncate">
                <Icon size={24} className="min-w-[28px]" aria-hidden />

                <p className="truncate text-lg font-thin">{title}</p>
              </div>

              {type === "button" ? (
                <button
                  onClick={onClick}
                  className={twMerge(
                    "hover:opacity-50 focus-visible:opacity-50",
                    !shouldReduceMotion && "transition-opacity"
                  )}
                  aria-label={title}
                >
                  <MdArrowOutward size={28} aria-hidden />
                </button>
              ) : (
                <Root
                  checked={checkBoxes[name!]}
                  className={twMerge(
                    "relative h-[16px] w-[32px] rounded-full bg-white shadow-none outline-none focus:shadow-[0_0_0_2px] focus:shadow-emerald-400 data-[state=checked]:bg-emerald-400",
                    !shouldReduceMotion && "transition-shadow duration-100"
                  )}
                  name={name}
                  aria-label={title}
                  onCheckedChange={() =>
                    setCheckBoxes((prev) => {
                      const isChecked = !prev[name!];

                      localStorage.setItem(name!, `${isChecked}`);

                      return {
                        ...prev,
                        [name!]: isChecked,
                      };
                    })
                  }
                >
                  <Thumb
                    className={twMerge(
                      "block size-[12px] translate-x-[2px] rounded-full bg-black will-change-transform data-[state=checked]:translate-x-[18px]",
                      !shouldReduceMotion && "transition-transform duration-100"
                    )}
                  />
                </Root>
              )}
            </div>
          </Fragment>
        ))}
      </div>

      <pre className="flex items-center justify-center text-xs text-neutral-400">
        Created with{" "}
        <AiFillHeart
          size={16}
          className="text-green-500 mr-2"
          aria-label="Love"
        />
        by <b className="gradient-text">Abolfazl Taghadosi</b>
      </pre>
    </Modal>
  );
};

export default SettingsModal;
