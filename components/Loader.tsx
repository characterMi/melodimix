import { twMerge } from "tailwind-merge";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("px-6 mt-2", className)}>
      <p className="absolute opacity-0">Loading...</p>
      <div className="loader" aria-hidden />
    </div>
  );
};
export default Loader;
