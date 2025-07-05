import { getUserById } from "@/actions/getUserById";
import { getUserSongs } from "@/actions/getUserSongs";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import PageContent from "./PageContent";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserById(params.userId);

  return {
    title: user ? `${user.name || "Guest"}'s profile` : "User not found",
    description: user
      ? `Checkout the ${user.name || "Guest"}'s profile!`
      : "Couldn't find a user with this ID.",
  };
}

async function GetUserSongs({ userId }: { userId: string }) {
  const songs = await getUserSongs({ userId, limit: 20, offset: 0 });

  return <PageContent initialSongs={songs} userId={userId} />;
}

const UsersPage = ({ params }: { params: { userId: string } }) => {
  return (
    <section>
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center">
            <Loader />
          </div>
        }
      >
        <GetUserSongs userId={params.userId} />
      </Suspense>
    </section>
  );
};

export default UsersPage;
