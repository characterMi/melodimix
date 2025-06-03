import { twMerge } from "tailwind-merge";

const Loader = ({
  className,
  label = "Loading...",
}: {
  className?: string;
  label?: string;
}) => {
  return (
    <div className={twMerge("mt-2 min-w-12", className)}>
      <p className="sr-only">{label}</p>
      <div className="loader" aria-hidden />
    </div>
  );
};
export default Loader;
