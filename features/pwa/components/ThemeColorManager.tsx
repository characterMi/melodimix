/**
 * The whole purpose of this component is to get the theme-color meta and save it in the store whenever we navigate
 * Through the website. the reason that we can't just get the theme-color meta once and use that is because next.js
 * automatically injects a new meta tag whenever we change the page.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useThemeColor } from "../store/useThemeColor";

const MAX_TRY = 10;

const ThemeColorManager = () => {
  const pathname = usePathname();
  const setMetaTheme = useThemeColor((state) => state.setMetaElement);

  useEffect(() => {
    let tried = 0;
    const intervalId = setInterval(() => {
      const metaTag = document.querySelector<HTMLMetaElement>(
        "meta[name=them-color]",
      );

      if (metaTag || tried++ >= MAX_TRY) {
        setMetaTheme(metaTag);
        clearInterval(intervalId);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [pathname]);

  return null;
};

export default ThemeColorManager;
