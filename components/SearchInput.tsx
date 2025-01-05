"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

import { useSearchMusic } from "@/hooks/useSearch";
import { useSearchParams } from "next/navigation";
import Input from "./Input";

const SearchInput = () => {
  const searchParams = useSearchParams();

  const [value, setValue] = useState<string>();
  const { setSearchValue } = useSearchMusic();

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (searchParams.get("song_title")) {
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
