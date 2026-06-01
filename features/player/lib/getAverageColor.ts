import { defaultColors } from "@/constants";
import type { ColorEntity } from "@/features/player/store/useSongColors";

export const getAverageColor = (image: HTMLImageElement): ColorEntity => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return defaultColors;

  try {
    const { naturalWidth, naturalHeight } = image;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    ctx!.drawImage(image, 0, 0, naturalWidth, naturalHeight);

    const { data } = ctx!.getImageData(0, 0, naturalWidth, naturalHeight);

    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    const step = 4 * 5;
    for (let i = 0; i < data.length; i += step) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    const light = `rgb(${Math.min(r + 30, 255)}, ${Math.min(
      g + 30,
      255,
    )}, ${Math.min(b + 30, 255)})`;
    const medium = `rgb(${r}, ${g}, ${b})`;
    const dark = `rgb(${Math.max(r - 30, 0)}, ${Math.max(
      g - 30,
      0,
    )}, ${Math.max(b - 30, 0)})`;

    return { light, medium, dark };
  } catch (error) {
    console.error(error);
    return defaultColors;
  }
};
