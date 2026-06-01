import { FC } from "react";

import { routes } from "../constants";

import Box from "../../../components/Box";
import DownloadApplication from "../../pwa/components/DownloadApplication";
import OpenSettingsButton from "../../settings/components/OpenSettingsButton";
import UserSongs from "../../user-related/components/UserSongs";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    <div className="flex h-full">
      <UserSongs isMobile />

      <aside className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2 overflow-y-auto">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map(({ href, icon: Icon, label }) => (
              <SidebarItem
                key={label}
                label={label}
                href={href}
                icon={<Icon size={26} aria-hidden />}
              />
            ))}

            <OpenSettingsButton />
            <DownloadApplication />
          </div>
        </Box>
        <Box>
          <UserSongs />
        </Box>
      </aside>

      <main className="h-full py-2 overflow-y-auto flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
