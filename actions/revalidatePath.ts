"use server";

import { revalidatePath as revalidate } from "next/cache";

export const revalidatePath = async (
  path: string,
  type: "layout" | "page" = "page"
) => revalidate(path, type);
