export const getAverageColor = async (
  file: File
): Promise<{ error: Error; color: null } | { error: null; color: string }> => {
  return new Promise((res) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) res({ color: "#065f46", error: null });

    const image = new Image();

    image.onload = () => {
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

        URL.revokeObjectURL(image.src);
        res({
          color: `rgb(${Math.round(r / count)},${Math.round(
            g / count
          )},${Math.round(b / count)})`,
          error: null,
        });
      } catch (error) {
        URL.revokeObjectURL(image.src);
        console.error(error);
        res({
          error: new Error("Couldn't calculate the average color."),
          color: null,
        });
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      res({ error: new Error("Couldn't load the image."), color: null });
    };

    image.src = URL.createObjectURL(file);
  });
};
