"use client";

import { useEffect } from "react";

const MainTemplate = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const isStandAlone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;

    if (isStandAlone) {
      const viewportMetatag = document.querySelector<HTMLMetaElement>(
        'meta[name="viewport"]'
      )!;

      const metaContent = viewportMetatag.content;

      viewportMetatag.setAttribute(
        "content",
        metaContent.replace("user-scalable=yes", "user-scalable=no")
      );
    }
  }, []);

  return children;
};

export default MainTemplate;
