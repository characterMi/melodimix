"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

import { useSearchMusic } from "@/hooks/useSearch";
import Input from "./Input";

const SearchInput = () => {
  const [value, setValue] = useState<string>();
  const { setSearchValue } = useSearchMusic();

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    setSearchValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <Input
      placeholder="What do you want to listen to ?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
