import type { User } from "@/types";

export const isAdmin = (user: User) =>
  user.role === "admin" || user.role === "owner";
