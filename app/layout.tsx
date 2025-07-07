import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { ModalProvider } from "@/providers/ModalProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";
import Root from "./root";

const figtree = Figtree({ subsets: ["latin"] });

const APP_NAME = "MelodiMix";
const DESCRIPTION =
  "MelodiMix: Your Ultimate Music Destination. Discover personalized playlists, seamless streaming, and a vibrant music community. Join us today for the perfect soundtrack to every moment.";

export const metadata: Metadata = {
  title: {
    default: "Home page",
    template: `${APP_NAME} | %s`,
  },
  icons: {
    apple: "/icons/melodimix-192.png",
    icon: "/icons/melodimix-192.png",
  },
  keywords: ["melodimix", "song", "spotify", "spotify clone", "music player"],
  appleWebApp: {
    capable: true,
    startupImage: "/icons/melodimix-512.png",
    title: APP_NAME,
  },
  applicationName: APP_NAME,
  authors: {
    name: "Abolfazl taghadosi",
    url: "https://abofazl-taghadosi.vercel.app",
  },
  category: "Music",
  classification: "Music",
  creator: "Abolfazl taghadosi",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  publisher: "Abolfazl taghadosi",
  openGraph: {
    title: APP_NAME,
    description: DESCRIPTION,
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
  },
  twitter: {
    title: APP_NAME,
    description: DESCRIPTION,
    site: process.env.NEXT_PUBLIC_BASE_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/melodimix-512-maskable.png`,
        width: 512,
        height: 512,
        alt: "Website Logo",
      },
    ],
    card: "summary",
  },
};

export const viewport: Viewport = {
  themeColor: "#065f46",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SupabaseProvider>
      <Root>
        <html lang="en">
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover, user-scalable=no"
            />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="mobile-web-app-capable" content="yes" />
          </head>
          <body className={figtree.className}>
            <ToasterProvider />
            <ModalProvider />
            <Sidebar>{children}</Sidebar>
            <Player />
          </body>
        </html>
      </Root>
    </SupabaseProvider>
  );
}
