import { useThemeColor } from "@/features/pwa/store/useThemeColor";

export const changeThemeColor = (color: string) => {
  const themeMeta = useThemeColor.getState().meta;

  if (!themeMeta || themeMeta.content === color) return;

  themeMeta.content = color;
};
