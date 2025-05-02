import Loader from "@/components/Loader";

const Loading = () => {
  return (
    <main className="w-full h-full flex justify-center items-center bg-neutral-900 rounded-lg">
      <Loader className="p-0" />
    </main>
  );
};

export default Loading;
