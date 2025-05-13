"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  label: string;
  href: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ href, label }) => {
  const pathName = usePathname();
  const iconProps = { size: 26, "aria-hidden": true };

  return (
    <Link
      href={href}
      className={twMerge(
        "flex flex-row h-auto items-center w-full gap-x-4 text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none transition text-neutral-400 py-1",
        pathName === href ? "text-white" : ""
      )}
      aria-label={"Go to " + label + " page"}
    >
      {label === "Home" ? (
        <HiHome {...iconProps} />
      ) : (
        <BiSearch {...iconProps} />
      )}
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
