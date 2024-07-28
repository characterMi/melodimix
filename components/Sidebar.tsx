import { routes } from "@/constants";
import { FC } from "react";
import Box from "./Box";
import DownloadApplication from "./DownloadApplication";
import GetUserSongs from "./GetUserSongs";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    <aside className="flex h-full">
      <GetUserSongs isMobile />

      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((route) => (
              <SidebarItem key={route.label} {...route} />
            ))}

            <DownloadApplication />
          </div>
        </Box>
        <Box className="overflow-y-auto h-full" isLibrary>
          <GetUserSongs />
        </Box>
      </div>
      <main className="h-full py-2 overflow-y-auto flex-1">{children}</main>
    </aside>
  );
};

export default Sidebar;
