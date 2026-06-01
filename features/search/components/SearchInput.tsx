"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { getCleanParamValue } from "@/features/search/lib/getCleanParamValue";
import { useSearch } from "@/features/search/store/useSearch";
import { useDebounce } from "@/hooks/useDebounce";

import Input from "../../../components/Input";

const SearchInput = ({
  placeholder,
  children,
}: {
  placeholder: string;
  children?: React.ReactNode;
}) => {
  const [value, setValue] = useState<string>("");
  const setSearchValue = useSearch((state) => state.setSearchValue);

  const debouncedValue = useDebounce(value, 1500);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const songTitle = searchParams.get("song_title");
    if (!songTitle) return;

    setValue(getCleanParamValue(songTitle));
  }, []);

  useEffect(() => {
    setSearchValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="flex items-center rounded-md bg-white/5">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        role="searchbox"
        aria-label="Search for a song..."
        className="border-none outline-none pl-4 py-4 pr-0"
      />

      {value && (
        <button
          onClick={() => setValue("")}
          aria-label="Clear the search input"
          className={cnWithReduceMotion(
            "px-2.5 hover:opacity-50 transition-opacity focus-visible:opacity-50 outline-none",
          )}
        >
          <IoClose size={24} aria-hidden />
        </button>
      )}

      {children}
    </div>
  );
};

export default SearchInput;
