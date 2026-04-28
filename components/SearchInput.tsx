"use client";

import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { GoSortAsc } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdFilterList } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import { useDebounce } from "@/hooks/useDebounce";
import { getCleanParamValue } from "@/lib/getCleanParamValue";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useSearchMusic } from "@/store/useSearch";

import DropdownMenu from "./DropdownMenu";
import Input from "./Input";
import Switch from "./Switch";

const filterItems = {
  songs: [
    { label: "Song title", id: "title" },
    { label: "Artist name", id: "artist" },
    { label: "Date", id: "date" },
  ],
  playlists: [
    { label: "Playlist name", id: "name" },
    { label: "Date", id: "date" },
  ],
} as const;

const SearchInput = ({ placeholder }: { placeholder: string }) => {
  const [value, setValue] = useState<string>("");
  const { filters, setFilters, setSearchValue } = useSearchMusic((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
    setSearchValue: state.setSearchValue,
  }));

  const debouncedValue = useDebounce(value, 1500);

  const stopPropagation = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>
      e.stopPropagation(),
    []
  );

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
          className={twMerge(
            "px-2.5 hover:opacity-50 focus-visible:opacity-50",
            !shouldReduceMotion && "transition-opacity"
          )}
        >
          <IoClose size={24} aria-hidden />
        </button>
      )}

      <div className="relative px-2.5 flex items-center">
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-emerald-600 to-transparent"
        />

        <DropdownMenu
          triggerProps={{
            element: <MdFilterList size={24} aria-hidden />,
            label: "Filter",
          }}
          contentProps={{
            className: "w-[200px] gap-3 text-sm",
          }}
        >
          {filterItems[filters.searchFor].map(({ label, id }) => (
            <DropdownMenu.Item
              key={id}
              className="flex items-center justify-between outline-none"
              onClick={stopPropagation}
              tabIndex={-1}
            >
              {label}
              <Switch
                size="sm"
                checked={filters.filter === id}
                aria-label={label}
                onCheckedChange={(e) => {
                  setFilters({
                    ...filters,
                    filter: id as any,
                  });
                }}
              />
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            className={twMerge(
              "flex items-center justify-between hover:opacity-50 focus-visible:opacity-50 cursor-pointer outline-none",
              !shouldReduceMotion && "transition-opacity"
            )}
            onClick={(e) => {
              stopPropagation(e);

              setFilters({ ...filters, asc: !filters.asc });
            }}
          >
            {filters.asc ? "ASC" : "DSC"}

            <GoSortAsc
              size={20}
              aria-hidden
              style={{ transform: filters.asc ? "none" : "rotate(180deg)" }}
            />
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={twMerge(
                "hover:opacity-50 focus-visible:opacity-50 cursor-pointer outline-none",
                !shouldReduceMotion && "transition-opacity"
              )}
            >
              Search for ...
            </DropdownMenu.SubTrigger>

            <DropdownMenu.SubContent className="w-[150px] gap-3">
              <DropdownMenu.Item
                className="flex items-center justify-between outline-none"
                onClick={stopPropagation}
                tabIndex={-1}
              >
                Songs
                <Switch
                  size="sm"
                  checked={filters.searchFor === "songs"}
                  aria-label="Search for songs"
                  onCheckedChange={() =>
                    setFilters({
                      ...filters,
                      filter: "title",
                      searchFor: "songs",
                    })
                  }
                />
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="flex items-center justify-between outline-none"
                onClick={stopPropagation}
                tabIndex={-1}
              >
                Playlists
                <Switch
                  size="sm"
                  checked={filters.searchFor === "playlists"}
                  aria-label="Search for playlists"
                  onCheckedChange={() =>
                    setFilters({
                      ...filters,
                      filter: "name",
                      searchFor: "playlists",
                    })
                  }
                />
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchInput;
