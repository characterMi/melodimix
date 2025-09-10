"use client";

import { shouldReduceMotion } from "@/lib/reduceMotion";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const GradientLink = ({ href, text }: { href: string; text: string }) => (
  <Link
    scroll={false}
    href={href}
    className={twMerge(
      "font-semibold text-sm gradient-text outline-none hover:opacity-50 focus-visible:opacity-50 inline-block",
      !shouldReduceMotion && "transition-opacity"
    )}
  >
    {text}
  </Link>
);

export default GradientLink;
