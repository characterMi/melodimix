"use client";

import { UserContextProvider } from "@/hooks/useUser";

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  return <UserContextProvider>{children}</UserContextProvider>;
};
