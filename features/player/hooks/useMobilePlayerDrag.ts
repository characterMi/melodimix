import { changeThemeColor } from "@/features/pwa/lib/changeThemeColor";
import {
  type MouseEvent,
  type RefObject,
  type TouchEvent,
  useCallback,
  useRef,
} from "react";

export const useMobilePlayerDrag = (
  mobilePlayerRef: RefObject<HTMLDivElement>,
  contentContainer: RefObject<HTMLDivElement>,
  color: string,
  defaultColor: string,
) => {
  const dragPosData = useRef({
    start: 0,
    current: 0,
    isDragging: false,
    hasContainerScrolled: false,
  });

  const onDragStart = useCallback((e: TouchEvent | MouseEvent) => {
    if (!mobilePlayerRef.current) return;

    dragPosData.current.isDragging = true;
    dragPosData.current.start = (e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientY
      : (e as MouseEvent).clientY;
    mobilePlayerRef.current.style.transition = "none";

    (e.target as HTMLDivElement).style.cursor = "grabbing";
  }, []);

  const onDrag = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (
        !mobilePlayerRef.current ||
        !dragPosData.current.isDragging ||
        dragPosData.current.hasContainerScrolled
      )
        return;

      if (contentContainer.current && contentContainer.current.scrollTop > 0) {
        dragPosData.current.hasContainerScrolled = true;
        return;
      }

      const { clientY } = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);

      if (clientY <= dragPosData.current.start) {
        dragPosData.current.start = clientY;
        changeThemeColor(color);
      } else {
        changeThemeColor(defaultColor);
      }

      const dragPos = Math.max(
        0,
        Math.min(
          window.innerHeight * 0.95,
          clientY - dragPosData.current.start,
        ),
      );

      dragPosData.current.current = dragPos;

      mobilePlayerRef.current.style.transform = `translateY(${dragPos}px)`;
    },
    [color, defaultColor],
  );

  const onDragEnd = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!mobilePlayerRef.current) return;

      if (contentContainer.current && contentContainer.current.scrollTop <= 0) {
        dragPosData.current.hasContainerScrolled = false;
      }

      dragPosData.current.isDragging = false;
      (e.target as HTMLDivElement).style.removeProperty("cursor");

      mobilePlayerRef.current.style.removeProperty("transition");
      mobilePlayerRef.current.style.removeProperty("transform");

      if (dragPosData.current.current > window.innerHeight / 4) {
        window.history.back();
      } else {
        changeThemeColor(color);
      }
    },
    [color],
  );

  return { onDragStart, onDrag, onDragEnd };
};
