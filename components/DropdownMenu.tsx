"use client";

import type {
  DropdownMenuItemProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
} from "@radix-ui/react-dropdown-menu";
import {
  Content,
  Group,
  Item,
  Label,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
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

const CONTENT_CLASSES =
  "bg-neutral-900 border border-neutral-700 p-4 rounded-lg shadow-2xl flex flex-col";

const DropdownMenu = ({ triggerProps, contentProps, children }: Props) => {
  return (
    <Root modal={false}>
      <Trigger
        aria-label={triggerProps.label}
        className={twMerge(
          "cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition",
          triggerProps.className
        )}
        tabIndex={triggerProps.tabIndex}
      >
        {triggerProps.element}
      </Trigger>

      <Content
        className={twMerge(CONTENT_CLASSES, "z-[2]", contentProps?.className)}
      >
        {children}
      </Content>
    </Root>
  );
};

DropdownMenu.Group = Group;
DropdownMenu.Sub = Sub;
DropdownMenu.SubTrigger = forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>((props, ref) => (
  <SubTrigger
    {...props}
    className={twMerge(
      "font-thin text-sm flex items-center justify-between gap-2",
      props.className
    )}
    ref={ref}
  >
    {props.children}

    <MdOutlineKeyboardArrowRight size={24} aria-hidden className="-mr-1" />
  </SubTrigger>
));
DropdownMenu.SubContent = forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>((props, ref) => (
  <SubContent
    {...props}
    className={twMerge(CONTENT_CLASSES, "z-[3]", props.className)}
    ref={ref}
  >
    {props.children}
  </SubContent>
));

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
