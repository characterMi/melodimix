import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { TbPlaylist } from "react-icons/tb";

export const routes = [
  {
    label: "Home",
    href: "/",
    icon: HiHome,
  },
  {
    label: "Search",
    href: "/search",
    icon: BiSearch,
  },
  {
    label: "Public Playlists",
    href: "/playlists",
    icon: TbPlaylist,
  },
];
