"use server";

import { revalidatePath as revalidate } from "next/cache";

export const revalidatePath = async () => {
  console.log("Path revalidated !");

  revalidate("/");
};
