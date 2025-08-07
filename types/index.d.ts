export type CacheKeys = "assets" | "songs" | "songs-data";

export type CacheData = Record<CacheKeys, number>;

export interface Song {
  id: string;
  user_id: string;
  author: string;
  artist: string;
  title: string;
  song_path: string;
  img_path: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  song_ids: string[];
  is_public: boolean;
}

export interface User {
  id: string;
  email: string;
  avatar_url: string | null;
  name: string | null;
  full_name: string | null;
}
