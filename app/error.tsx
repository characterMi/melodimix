"use client";

import Button from "@/components/Button";

const HomePageError = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-y-4 justify-center items-center fixed top-0 left-0 z-50 bg-black/55 backdrop-blur-sm">
      <h1 className="text-2xl text-white font-bold text-center">
        Something went wrong ! Please reload the page.
      </h1>
      <Button className="w-28" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );
};

export default HomePageError;
