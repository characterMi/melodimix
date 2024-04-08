import { FC, Suspense } from "react";
import { routes } from "@/constants";
import { getSongsByUserId } from "@/actions/getSongsByUserId";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import Loader from "./Loader";
import MobileSidebar from "./MobileSidebar";

interface SidebarProps {
  children: React.ReactNode;
}

async function GetUserSongs({ isMobile }: { isMobile?: boolean }) {
  const songs = await getSongsByUserId();

  return isMobile ? <MobileSidebar songs={songs} /> : <Library songs={songs} />;
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
          </div>
        </Box>
        <Box className="overflow-y-auto h-full" isLibrary>
          <Suspense
            fallback={<Loader className="flex justify-center w-full mt-5" />}
          >
            <GetUserSongs />
          </Suspense>
        </Box>
      </div>
      <main className="h-full py-2 overflow-y-auto flex-1">{children}</main>
    </aside>
  );
};

export default Sidebar;
