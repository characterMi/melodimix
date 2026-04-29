"use client";

import DropdownMenu from "@/components/DropdownMenu";
import SearchInput from "@/components/SearchInput";
import Switch from "@/components/Switch";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useSearch } from "@/store/useSearch";
import { type MouseEvent, useCallback } from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { MdFilterList } from "react-icons/md";
import { twMerge } from "tailwind-merge";

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

const SearchBox = () => {
  const { filters, applyFilters } = useSearch((state) => ({
    filters: state.filters,
    applyFilters: state.setFilters,
  }));

  const stopPropagation = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>
      e.stopPropagation(),
    []
  );

  return (
    <SearchInput
      placeholder={
        filters.searchFor === "songs"
          ? "What do you want to listen to ?"
          : "Which playlist are you looking for ?"
      }
    >
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
          <DropdownMenu.Label className="text-base">
            Sort by {filters.sortBy}
          </DropdownMenu.Label>

          {filterItems[filters.searchFor].map(({ label, id }) => (
            <DropdownMenu.Item
              key={id}
              className="flex items-center justify-between outline-none font-thin"
              onClick={stopPropagation}
              tabIndex={-1}
            >
              {label}
              <Switch
                size="sm"
                checked={filters.sortBy === id}
                aria-label={label}
                onCheckedChange={() => {
                  if (filters.sortBy === id) return;

                  applyFilters({
                    ...filters,
                    asc: id !== "date",
                    sortBy: id as any,
                  });
                }}
              />
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />

          <DropdownMenu.Label className="text-base">
            Search for {filters.searchFor}
          </DropdownMenu.Label>

          {Object.keys(filterItems).map((item) => (
            <DropdownMenu.Item
              key={item}
              className="flex items-center justify-between outline-none font-thin capitalize"
              onClick={stopPropagation}
              tabIndex={-1}
            >
              {item}
              <Switch
                size="sm"
                checked={filters.searchFor === item}
                aria-label={
                  item === "songs" ? "Search for songs" : "Search for playlists"
                }
                onCheckedChange={() =>
                  applyFilters({
                    asc: false,
                    sortBy: "date",
                    searchFor: item as typeof filters.searchFor,
                  })
                }
              />
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            className={twMerge(
              "flex items-center justify-between hover:opacity-50 focus-visible:opacity-50 font-thin cursor-pointer outline-none",
              !shouldReduceMotion && "transition-opacity"
            )}
            onClick={(e) => {
              stopPropagation(e);

              applyFilters({ ...filters, asc: !filters.asc });
            }}
          >
            {filters.asc ? "ASC" : "DSC"}

            {filters.asc ? (
              <GoSortAsc size={20} aria-hidden />
            ) : (
              <GoSortDesc size={20} aria-hidden />
            )}
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>
    </SearchInput>
  );
};

export default SearchBox;
