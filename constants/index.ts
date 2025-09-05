import { APP_NAME } from "@/app/layout";
import { Metadata } from "next";

export const routes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Search",
    href: "/search",
  },
];

export const openGraph = (
  props: Metadata["openGraph"]
): Metadata["openGraph"] => ({
  url: process.env.NEXT_PUBLIC_BASE_URL,
  type: "website",
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/melodimix-512-maskable.png`,
      width: 512,
      height: 512,
      alt: "Website Logo",
    },
  ],
  locale: "en_US",
  siteName: APP_NAME,
  ...(props ?? {}),
});

export const twitter = (
  props: Partial<Metadata["twitter"]>
): Metadata["twitter"] => ({
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/melodimix-512-maskable.png`,
      width: 512,
      height: 512,
      alt: "Website Logo",
    },
  ],
  card: "summary",
  ...(props ?? {}),
});
