"use client";

import { useEffect, useState } from "react";

import { useCustomParams } from "@/hooks/useCustomParams";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchMusic } from "@/store/useSearch";

import Input from "./Input";

const SearchInput = ({ placeholder }: { placeholder: string }) => {
  const [value, setValue] = useState<string>("");
  const setSearchValue = useSearchMusic((state) => state.setSearchValue);

  const debouncedValue = useDebounce(value, 1500);

  useCustomParams("search", (searchValue) => setValue(searchValue));

  useEffect(() => {
    setSearchValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      role="searchbox"
      aria-label="Search for a song..."
    />
  );
};

export default SearchInput;
