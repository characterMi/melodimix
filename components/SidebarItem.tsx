import Link from "next/link";
import { FC } from "react";
import { IconType } from "react-icons";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  href: string;
  className?: ClassNameValue;
}

const SidebarItem: FC<SidebarItemProps> = ({
  href,
  icon: Icon,
  label,
  className,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        "flex flex-row h-auto items-center w-full gap-x-4 text-sm font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1",
        className
      )}
    >
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
