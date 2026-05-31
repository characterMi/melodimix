const themeMeta = (() => {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLMetaElement>("meta[name=theme-color]");
})();

export const changeThemeColor = (color: string) => {
  if (!themeMeta || themeMeta.content === color) return;

  themeMeta.content = color;
};
