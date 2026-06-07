"use client";

import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlinePlus } from "react-icons/ai";

import { useSession } from "@/features/auth/hooks/useSession";
import { usePlaylistModal } from "@/features/playlist/store/usePlaylistModal";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

import Loader from "@/components/Loader";
import PlaylistLink from "./PlaylistLink";

const PlaylistContainer = ({
  playlistsList,
  children,
}: {
  playlistsList: ({
    href: string;
    name: string;
    id: number | "liked" | "uploaded" | "interests";
  } & Partial<Omit<Playlist, "name" | "id">>)[];
  children: React.ReactNode;
}) => {
  const openPlaylistModal = usePlaylistModal((state) => state.onOpen);

  const { session, isLoading: isUserLoading } = useSession();

  if (isUserLoading) return <Loader className="ml-4" />;

  if (!session?.user) {
    return (
      <h2 className="m-4">
        Seems like you're not logged in 🤔 if that's true, Please first login to
        Your account.
      </h2>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-[1] bg-neutral-900/95 pt-2 md:pt-4 md:backdrop-blur-sm overflow-hidden mb-6">
        <LinksContainer>
          {playlistsList.map((playlist) => (
            <PlaylistLink key={playlist.href} {...playlist} />
          ))}
        </LinksContainer>

        <button
          onClick={() => openPlaylistModal()}
          className={cnWithReduceMotion(
            "absolute top-0 right-0 w-12 h-[calc(100%-1px)] pb-2 bg-neutral-900 flex items-center justify-center outline-none hover:text-neutral-400 focus-visible:text-neutral-400 after:absolute after:top-0 after:right-full after:w-6 after:h-full after:bg-gradient-to-l after:from-neutral-900 after:to-transparent after:pointer-events-none transition",
          )}
        >
          <AiOutlinePlus size={24} aria-hidden />
        </button>

        <hr className="border-none bg-neutral-600 h-[1px]" />
      </div>

      {children}
    </>
  );
};

const PADDING_RIGHT = 56;

const LinksContainer = ({ children }: { children: ReactNode }) => {
  const dragStartPos = useRef(0);
  const storedLeft = useRef(0);
  const playlistContainer = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (e: PointerEvent) => {
    setIsDragging(true);
    dragStartPos.current = e.clientX + storedLeft.current * -1;

    document.body.style.cursor = "grabbing";
  };

  useEffect(() => {
    const controller = new AbortController();

    const onDrag = (e: globalThis.TouchEvent | globalThis.MouseEvent) => {
      if (!playlistContainer.current || !isDragging) return;

      const { clientX } = (e as globalThis.TouchEvent).touches
        ? (e as globalThis.TouchEvent).touches[0]
        : (e as globalThis.MouseEvent);

      if (clientX >= dragStartPos.current) {
        dragStartPos.current = clientX;
      }

      const clampedDragX = Math.min(
        0,
        Math.max(
          -(
            playlistContainer.current.scrollWidth -
            playlistContainer.current.offsetWidth +
            (playlistContainer.current.scrollWidth >
            playlistContainer.current.offsetWidth
              ? PADDING_RIGHT
              : 0)
          ),
          clientX - dragStartPos.current,
        ),
      );

      storedLeft.current = clampedDragX;

      playlistContainer.current.style.transform = `translateX(${clampedDragX}px)`;
    };

    const onDragEnd = () => {
      setIsDragging(false);
      document.body.style.removeProperty("cursor");
    };

    window.addEventListener("touchmove", onDrag, { signal: controller.signal });
    window.addEventListener("mousemove", onDrag, { signal: controller.signal });
    window.addEventListener("touchend", onDragEnd, {
      signal: controller.signal,
    });
    window.addEventListener("mouseup", onDragEnd, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [isDragging]);

  return (
    <div
      onPointerDown={onDragStart}
      ref={playlistContainer}
      className="w-full flex pl-2 pr-12 cursor-grab relative"
    >
      {children}
    </div>
  );
};

export default PlaylistContainer;
