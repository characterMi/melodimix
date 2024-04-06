"use client";

import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
  return (
    <button className="opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md transition translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105">
      <FaPlay className="text-black" />
    </button>
  );
};
export default PlayButton;
