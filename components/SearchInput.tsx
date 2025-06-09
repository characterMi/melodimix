"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

import { useSearchMusic } from "@/store/useSearch";
import Input from "./Input";

const SearchInput = () => {
  const [value, setValue] = useState<string>("");
  const setSearchValue = useSearchMusic((state) => state.setSearchValue);

  const debouncedValue = useDebounce(value, 1500);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("song_title")) {
      setValue(searchParams.get("song_title")!);
    }
  }, []);

  useEffect(() => {
    setSearchValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <Input
      placeholder="What do you want to listen to ?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      role="searchbox"
      aria-label="Search for a song..."
    />
  );
};

export default SearchInput;
