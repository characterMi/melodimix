export type CacheKeys = "assets" | "songs" | "songs-data";

export type CacheData = Record<CacheKeys, number>;

export interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  img_path: string;
}
