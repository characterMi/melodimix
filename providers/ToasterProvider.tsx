"use client";

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#17171790",
          backdropFilter: "blur(15px)",
          padding: "1rem 1.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #26262660",
          color: "#ffffff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      }}
    />
  );
};
