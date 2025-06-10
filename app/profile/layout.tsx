import Header from "@/components/Header";
import Image from "next/image";
import ProfileImage from "@/public/images/profile.png";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { getUserPlaylists } from "@/actions/getUserPlaylists";
import PlaylistLink from "./components/PlaylistLink";

export const metadata = {
  title: "Profile",
  description: "Browse between Your Playlists!",
};

async function GetPlaylists() {
  const playlists = await getUserPlaylists();
  const playlistsList = [
    { href: "/profile", name: "Uploaded songs" },
    { href: "/profile/liked", name: "Liked Songs" },
    ...playlists.map((playlist) => ({
      href: `/profile/playlists/${playlist.id}`,
      name: playlist.name,
    })),
  ];

  return (
    <div className="sticky top-0 z-[1] bg-neutral-900/80 pt-4 md:backdrop-blur-sm">
      <div className="w-full flex gap-4 h-full overflow-auto snap-x snap-mandatory snap-always px-2">
        {playlistsList.map((playlist) => (
          <PlaylistLink key={playlist.href} {...playlist} />
        ))}
      </div>

      <hr className="my-6 border-none bg-neutral-600 h-[1px]" />
    </div>
  );
}

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20 flex flex-col md:flex-row items-center gap-x-4 px-2">
          <div
            className="relative size-32 lg:size-44"
            aria-labelledby="profile-title"
          >
            <Image
              src={ProfileImage}
              alt="Profile"
              width={100}
              height={100}
              className="object-cover size-32 lg:size-44"
              placeholder="blur"
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">
              Welcome back
            </p>

            <h1
              className="text-white text-4xl sm:text-7xl md:text-5xl lg:text-7xl"
              id="profile-title"
            >
              Profile
            </h1>
          </div>
        </div>
      </Header>

      <div className="p-6 w-full">
        <Suspense fallback={<Loader className="mx-auto" />}>
          <GetPlaylists />

          {children}
        </Suspense>
      </div>
    </section>
  );
};

export default ProfileLayout;
