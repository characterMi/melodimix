"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

const PlaylistLink = ({ href, name }: { href: string; name: string }) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      key={href}
      className={twMerge(
        "text-white snap-start text-nowrap hover:text-emerald-600 focus-visible:text-emerald-600 outline-none transition-colors",
        pathname === href && "border-b border-emerald-500"
      )}
    >
      <h2 className="text-xl font-thin">{name}</h2>
    </Link>
  );
};

export default PlaylistLink;
