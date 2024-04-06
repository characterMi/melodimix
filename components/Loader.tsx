import { twMerge } from "tailwind-merge";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("px-6 mt-2", className)}>
      <div className="loader" />
    </div>
  );
};
export default Loader;
