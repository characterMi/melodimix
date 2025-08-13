import Loader from "@/components/Loader";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-neutral-900 rounded-lg">
      <Loader />
    </div>
  );
};

export default Loading;
