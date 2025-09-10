export const getItemFromLocalStorage = <T extends string>(
  name: string,
  expectedValues: T[],
  defaultValue: T
): T => {
  if (typeof localStorage === "undefined") return defaultValue;

  const storedItem = localStorage.getItem(name);

  if (!storedItem || !expectedValues.includes(storedItem as T))
    return defaultValue;

  return storedItem as T;
};
