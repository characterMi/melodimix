import { getUserInterests } from "@/actions/interests.actions";
import PageContent from "./PageContent";

export const metadata = {
  title: "Interests",
  description: "Browse between the songs that you're interested in.",
};

const InterestsPage = async () => {
  const { data, error } = await getUserInterests();

  return (
    <div className="px-4">
      <PageContent songs={data} error={error} />
    </div>
  );
};

export default InterestsPage;
