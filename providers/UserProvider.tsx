"use client";

import { MyUserContextProvider } from "@/hooks/useUser";

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};
