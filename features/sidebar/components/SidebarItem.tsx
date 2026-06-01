"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

import type { FC } from "react";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const SidebarItem: FC<SidebarItemProps> = ({ href, label, icon }) => {
  const pathName = usePathname();

  return (
    <Link
      scroll={false}
      href={href}
      className={cnWithReduceMotion(
        "flex flex-row h-auto items-center w-full gap-x-4 text-sm font-medium cursor-pointer hover:text-white focus-visible:text-white outline-none transition-colors text-neutral-400 py-1",
        pathName === href ? "text-white" : "",
      )}
      aria-label={"Go to " + label + " page"}
    >
      {icon}
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
