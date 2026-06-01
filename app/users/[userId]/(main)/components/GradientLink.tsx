"use client";

import Link from "next/link";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

const GradientLink = ({ href, text }: { href: string; text: string }) => (
  <Link
    scroll={false}
    href={href}
    className={cnWithReduceMotion(
      "font-semibold text-sm gradient-text transition-opacity outline-none hover:opacity-50 focus-visible:opacity-50 inline-block",
    )}
  >
    {text}
  </Link>
);

export default GradientLink;
