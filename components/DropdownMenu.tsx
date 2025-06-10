"use client";

import * as DropdownMenuFromRadix from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  triggerProps: {
    element: React.ReactNode;
    label?: string;
    className?: string;
    tabIndex?: number;
  };
  contentProps?: {
    className?: string;
  };
  children: React.ReactNode;
};

const DropdownMenu = ({ triggerProps, contentProps, children }: Props) => {
  return (
    <DropdownMenuFromRadix.Root modal={false}>
      <DropdownMenuFromRadix.Trigger
        aria-label={triggerProps.label}
        className={twMerge(
          "cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition",
          triggerProps.className
        )}
        tabIndex={triggerProps.tabIndex}
      >
        {triggerProps.element}
      </DropdownMenuFromRadix.Trigger>

      <DropdownMenuFromRadix.Content
        className={twMerge(
          "bg-neutral-900 border border-neutral-700 p-4 rounded-lg shadow-2xl flex flex-col z-[2]",
          contentProps?.className
        )}
      >
        {children}
      </DropdownMenuFromRadix.Content>
    </DropdownMenuFromRadix.Root>
  );
};

DropdownMenu.Group = DropdownMenuFromRadix.Group;
DropdownMenu.Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <DropdownMenuFromRadix.Label
    className={twMerge("font-bold text-xl", className)}
  >
    {children}
  </DropdownMenuFromRadix.Label>
);
DropdownMenu.Item = forwardRef<
  HTMLDivElement,
  DropdownMenuFromRadix.DropdownMenuItemProps
>((props, ref) => (
  <DropdownMenuFromRadix.Item {...props} ref={ref}>
    {props.children}
  </DropdownMenuFromRadix.Item>
));
DropdownMenu.Separator = ({ className }: { className?: string }) => (
  <DropdownMenuFromRadix.Separator
    className={twMerge("h-[2px] bg-neutral-800", className)}
  />
);

export default DropdownMenu;
