import { getUserById } from "@/actions/getUserById";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import Image from "next/image";
import Link from "next/link";

const UsersPageLayout = async ({
  params,
  children,
}: {
  params: { userId: string };
  children: React.ReactNode;
}) => {
  const user = await getUserById(params.userId);

  return (
    <MainContent>
      <Header>
        <div className="mt-20 flex flex-col md:flex-row items-center gap-x-4">
          <div className="relative size-36 min-w-36 xss:size-40 xss:min-w-40 sm:size-44 sm:min-w-44 md:size-32 md:min-w-32 lg:size-44 lg:min-w-44 shadow-2xl">
            <Image
              src={user?.avatar_url ?? "/images/profile.png"}
              alt={
                user ? `${user.name || "Guest"}'s profile` : "User not found"
              }
              width={200}
              height={200}
              className="object-cover size-36 xss:size-40 sm:size-44 md:size-32 lg:size-44"
              loading="eager"
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left">
            {user && (
              <p className="hidden md:block font-semibold text-sm">
                {user.full_name || "Guest"}'s profile
              </p>
            )}

            <h1 className="text-white text-4xl sm:text-7xl md:text-5xl lg:text-7xl">
              {user ? `${user.name || "Guest"}` : "User not found"}
            </h1>

            {user && (
              <Link
                scroll={false}
                href={`/users/${params.userId}/playlists`}
                className="font-semibold text-sm gradient-text outline-none transition hover:opacity-50 focus-visible:opacity-50 inline-block"
              >
                {user.name === "Guest" ? "User" : user.name}'s playlists
              </Link>
            )}
          </div>
        </div>
      </Header>

      <div className="w-full p-6 pb-0">{children}</div>
    </MainContent>
  );
};

export default UsersPageLayout;
