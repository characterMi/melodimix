import { create } from "zustand";

interface UploadedSongs {
  uploadedSongs: string[];
  setUploadedSongs: (songName: string) => void;
}

export const useUploadedSongs = create<UploadedSongs>((setState) => ({
  uploadedSongs: [],
  setUploadedSongs: (songName) =>
    setState((state) => ({
      uploadedSongs: [...state.uploadedSongs, songName],
    })),
}));
