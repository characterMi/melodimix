"use client";

import { useEffect, useRef } from "react";

const MainTemplate = ({ children }: { children: React.ReactNode }) => {
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearInterval(interval.current);

    const isStandAlone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;

    if (isStandAlone) {
      setInterval(() => {
        const viewportMetatag = document.querySelector<HTMLMetaElement>(
          'meta[name="viewport"]'
        );

        const metaContent = viewportMetatag?.content ?? "";

        viewportMetatag?.setAttribute(
          "content",
          metaContent.replace("user-scalable=yes", "user-scalable=no")
        );
      }, 10);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return children;
};

export default MainTemplate;
