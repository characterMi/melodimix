import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

interface Props {
  img: string;
  name: string;
  href: string;
}

const ListItem = ({ href, img, name }: Props) => (
  <Link
    href={href}
    className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4"
  >
    <div className="relative min-h-[64px] min-w-[64px]">
      <Image src={img} alt="Liked musics" className="object-cover" fill />
    </div>

    <p className="font-medium truncate py-5">{name}</p>

    <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-105">
      <FaPlay className="text-black" />
    </div>
  </Link>
);

export default ListItem;
