"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { useDebounce } from "@/hooks/useDebounce";
import { getCleanParamValue } from "@/lib/getCleanParamValue";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useSearchMusic } from "@/store/useSearch";

import Input from "./Input";

const SearchInput = ({ placeholder }: { placeholder: string }) => {
  const [value, setValue] = useState<string>("");
  const setSearchValue = useSearchMusic((state) => state.setSearchValue);

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
    <div className="flex items-center border">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        role="searchbox"
        aria-label="Search for a song..."
      />

      {value && (
        <button
          onClick={() => setValue("")}
          aria-label="Clear the search input"
          className={twMerge(
            "px-2.5 hover:opacity-50 focus-visible:opacity-50",
            !shouldReduceMotion && "transition-opacity"
          )}
        >
          <IoClose size={24} aria-hidden />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
