import { getUserById } from "@/actions/getUserById";
import { getUserSongs } from "@/actions/getUserSongs";
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

const UsersPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  const songs = await getUserSongs({ userId, limit: 20, offset: 0 });

  return <PageContent initialSongs={songs} userId={userId} />;
};

export default UsersPage;
