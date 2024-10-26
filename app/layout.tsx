import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { ModalProvider } from "@/providers/ModalProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";
import { UserProvider } from "@/providers/UserProvider";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";
import Root from "./root";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Home page",
    template: "MelodiMix | %s",
  },
  icons: {
    apple: "/icons/melodimix-192.png",
    icon: "/icons/melodimix-192.png",
  },
  keywords: ["melodimix", "song", "spotify", "spotify clone", "music player"],
};

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Root>
      <html lang="en">
        <body className={figtree.className}>
          <ToasterProvider />
          <SupabaseProvider>
            <UserProvider>
              <ModalProvider />
              <Sidebar>{children}</Sidebar>
              <Player />
            </UserProvider>
          </SupabaseProvider>
        </body>
      </html>
    </Root>
  );
}
