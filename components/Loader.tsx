import { twMerge } from "tailwind-merge";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("px-6 mt-2", className)} aria-label="Loading...">
      <div className="loader" aria-hidden />
    </div>
  );
};
export default Loader;
