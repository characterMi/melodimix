export const changeThemeColor = (color: string) => {
  const themeMeta = document.querySelector<HTMLMetaElement>(
    "meta[name=theme-color]",
  );

  if (!themeMeta || themeMeta.content === color) return;

  themeMeta.content = color;
};
