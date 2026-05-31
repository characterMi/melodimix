type FileType = "song" | "image";

export const uploadFile = (
  fileData: {
    uploadUrl: string;
    file: File;
    type: FileType;
  },
  onUploadProgress: (type: FileType, progress: number) => void,
  abortSignal?: AbortSignal,
): Promise<{ error: null | Error }> => {
  const { uploadUrl, file, type } = fileData;

  return new Promise((res, rej) => {
    if (abortSignal?.aborted) {
      return rej({ error: new Error("User has aborted the request.") });
    }

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);

    xhr.upload.addEventListener("progress", (e) => {
      if (!e.lengthComputable) return;

      const percent = Math.round((e.loaded / e.total) * 100);
      onUploadProgress(type, percent);
    });

    abortSignal?.addEventListener(
      "abort",
      () => {
        xhr.abort();
      },
      { once: true },
    );

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        res({ error: null });
      } else {
        rej({
          error: new Error(`${type} upload failed.`),
        });
      }
    };
    xhr.onerror = () => rej({ error: new Error(`${type} upload failed.`) });
    xhr.onabort = () => rej({ error: new Error(`${type} upload aborted.`) });

    xhr.send(file);
  });
};
