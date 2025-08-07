import { getUserPlaylists } from "@/actions/getUserPlaylists";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ProfileImage from "@/public/images/profile.png";
import type { Playlist } from "@/types";
import Image from "next/image";
import React, { Suspense } from "react";
import PlaylistContainer from "./components/PlaylistContainer";

async function GetPlaylists({ children }: { children: React.ReactNode }) {
  const playlists = (await getUserPlaylists()) as Playlist[];

  const playlistsList = [
    { href: "/profile", name: "Uploaded songs", id: "uploaded" },
    { href: "/profile/liked", name: "Liked Songs", id: "liked" },
    ...playlists.map((playlist) => ({
      href: `/profile/playlists/${playlist.id}`,
      ...playlist,
    })),
  ];

  return (
    <PlaylistContainer playlistsList={playlistsList}>
      {children}
    </PlaylistContainer>
  );
}

const ProfileLayout = ({ children }: { children: React.ReactNode }) => (
  <section className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
    <Header>
      <div className="mt-20 flex flex-col md:flex-row items-center gap-x-4">
        <div className="relative size-32 min-w-32 lg:min-w-44 lg:size-44">
          <Image
            src={ProfileImage}
            alt="Profile"
            width={100}
            height={100}
            className="object-cover size-32 lg:size-44"
            placeholder="blur"
            loading="eager"
          />
        </div>

        <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
          <p className="hidden md:block font-semibold text-sm">Welcome back</p>

          <h1 className="text-white text-4xl sm:text-7xl md:text-5xl lg:text-7xl">
            Profile
          </h1>
        </div>
      </div>
    </Header>

    <div className="px-2 w-full">
      <Suspense fallback={<Loader className="ml-4" />}>
        <GetPlaylists>{children}</GetPlaylists>
      </Suspense>
    </div>
  </section>
);

export default ProfileLayout;
