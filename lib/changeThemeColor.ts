const themeMeta = document.querySelector<HTMLMetaElement>(
  "meta[name=theme-color]"
);

export const changeThemeColor = (color: string) => {
  if (!themeMeta || themeMeta.content === color) return;

  themeMeta.content = color;
};
