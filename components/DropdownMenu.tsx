"use client";

import type { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Root = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Root)
);
const Trigger = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Trigger)
);
const Content = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Content)
);
const Group = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Group)
);
const Label = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Label)
);
const Item = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Item)
);
const Separator = dynamic(() =>
  import("@radix-ui/react-dropdown-menu").then((mod) => mod.Separator)
);

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
    <Root modal={false}>
      <Trigger
        aria-label={triggerProps.label}
        className={twMerge(
          "cursor-pointer hover:opacity-75 focus-visible:opacity-75 outline-none transition",
          triggerProps.className
        )}
        tabIndex={triggerProps.tabIndex}
      >
        {triggerProps.element}
      </Trigger>

      <Content
        className={twMerge(
          "bg-neutral-900 border border-neutral-700 p-4 rounded-lg shadow-2xl flex flex-col z-[2]",
          contentProps?.className
        )}
      >
        {children}
      </Content>
    </Root>
  );
};

DropdownMenu.Group = Group;
DropdownMenu.Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Label className={twMerge("font-bold text-xl", className)}>{children}</Label>
);
DropdownMenu.Item = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (props, ref) => (
    <Item {...props} ref={ref}>
      {props.children}
    </Item>
  )
);
DropdownMenu.Separator = ({ className }: { className?: string }) => (
  <Separator className={twMerge("h-[2px] bg-neutral-800", className)} />
);

export default DropdownMenu;
