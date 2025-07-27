import { getUserById } from "@/actions/getUserById";
import Header from "@/components/Header";
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
    <section className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20 flex flex-col md:flex-row items-center gap-x-4">
          <div className="relative size-32 lg:size-44">
            <Image
              src={user?.avatar_url ?? "/images/profile.png"}
              alt={
                user ? `${user.name || "Guest"}'s profile` : "User not found"
              }
              width={200}
              height={200}
              className="object-cover size-32 lg:size-44"
              loading="eager"
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left">
            <p className="hidden md:block font-semibold text-sm">
              {user ? `${user.full_name || "Guest"}'s profile` : ""}
            </p>

            <h1 className="text-white text-4xl sm:text-7xl md:text-5xl lg:text-7xl">
              {user ? `${user.name || "Guest"}` : "User not found"}
            </h1>

            {user && (
              <Link
                href={`/users/${params.userId}/playlists`}
                className="font-semibold text-sm gradient-text outline-none transition hover:opacity-75 focus-visible:opacity-75 inline-block"
              >
                {user.name === "Guest" ? "User" : user.name}'s playlists
              </Link>
            )}
          </div>
        </div>
      </Header>

      <main className="w-full p-2 sm:p-6 pb-0">{children}</main>
    </section>
  );
};

export default UsersPageLayout;
