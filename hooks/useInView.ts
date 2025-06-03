import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isInView];
}

export default useInView;
