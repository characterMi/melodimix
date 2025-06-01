import { routes } from "@/constants";
import { FC, Suspense } from "react";
import Box from "./Box";
import DownloadApplication from "./DownloadApplication";
import Loader from "./Loader";
import ManageCacheButton from "./ManageCacheButton";
import SidebarItem from "./SidebarItem";
import UserSongs from "./UserSongs";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    <div className="flex h-full">
      <UserSongs isMobile />

      <aside className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((route) => (
              <SidebarItem key={route.label} {...route} />
            ))}

            <ManageCacheButton />
            <DownloadApplication />
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Suspense
            fallback={<Loader className="flex justify-center w-full mt-5" />}
          >
            <UserSongs />
          </Suspense>
        </Box>
      </aside>

      <main className="h-full py-2 overflow-y-auto flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
