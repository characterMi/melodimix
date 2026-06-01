import { useEffect } from "react";

type PageDataStore<T> = {
  pageData: { data: T[]; page: number };
  addAll: (data: T[], page: number) => void;
};

export const useInfiniteScroll = <T>(
  initialData: T[],
  pageDataStore: PageDataStore<T>,
  limit: number
) => {
  const {
    pageData: { data, page },
    addAll,
  } = pageDataStore;

  useEffect(() => {
    if (initialData.length > 0 && data.length === 0) {
      addAll(initialData, initialData.length === limit ? page + 1 : page);
    }
  }, [initialData]);

  return { ...pageDataStore.pageData, addAll };
};
