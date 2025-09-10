export const getItemFromLocalStorage = (
  name: string,
  expectedValues: string[],
  defaultValue: string
) => {
  if (typeof localStorage === "undefined") return defaultValue;

  const storedItem = localStorage.getItem(name);

  if (!storedItem || !expectedValues.includes(storedItem)) return defaultValue;

  return storedItem;
};
