export const metadata = {
  title: "Not Found",
};

const NotFound = () => {
  return (
    <section className="w-screen h-screen flex gap-y-4 justify-center items-center fixed top-0 left-0 z-50 bg-neutral-900">
      <h1 className="text-xl text-white font-thin text-center flex items-center gap-x-2">
        <span className="text-emerald-800 font-bold text-3xl">404</span>
        <span className="text-5xl text-emerald-400" aria-hidden>
          |
        </span>
        <span className="hidden sm:block">
          the Page You're looking for does not exist.
        </span>
        <span className="sm:hidden">Page not found.</span>
      </h1>
    </section>
  );
};

export default NotFound;
