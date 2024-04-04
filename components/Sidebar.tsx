"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const pathName = usePathname();

  return (
    <aside className="flex h-full">
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((route) => (
              <SidebarItem
                key={route.label}
                {...route}
                className={pathName === route.href ? "text-white" : ""}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library />
        </Box>
      </div>
      <main className="h-full py-2 overflow-y-auto flex-1">{children}</main>
    </aside>
  );
};

export default Sidebar;
