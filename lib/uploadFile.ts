type FileType = "song" | "image";

export const uploadFile = (
  fileData: {
    uploadUrl: string;
    file: File;
    type: FileType;
  },
  onUploadProgress: (type: FileType, progress: number) => void
): Promise<{ error: null | Error }> => {
  const { uploadUrl, file, type } = fileData;

  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);

    xhr.upload.addEventListener("progress", (e) => {
      if (!e.lengthComputable) return;

      const percent = Math.round((e.loaded / e.total) * 100);
      onUploadProgress(type, percent);
    });

    xhr.onload = () => res({ error: null });
    xhr.onerror = () => rej({ error: new Error(`${type} upload failed.`) });

    xhr.send(file);
  });
};
