"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";

interface SidebarItemProps {
  label: string;
  href: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ href, label }) => {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={twMerge(
        "flex flex-row h-auto items-center w-full gap-x-4 text-sm font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1",
        pathName === href ? "text-white" : ""
      )}
    >
      {label === "Home" ? <HiHome size={26} /> : <BiSearch size={26} />}
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
