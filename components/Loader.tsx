import { twMerge } from "tailwind-merge";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("px-6 mt-2 min-w-12", className)}>
      <p className="sr-only">Loading...</p>
      <div className="loader" aria-hidden />
    </div>
  );
};
export default Loader;
