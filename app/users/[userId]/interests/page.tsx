import { getUserInterests } from "@/actions/interests.actions";
import PageContent from "./PageContent";

const UsersPage = async ({ params }: { params: { userId: string } }) => {
  const { data, error } = await getUserInterests(params.userId);

  return <PageContent songs={data} error={error} />;
};

export default UsersPage;
