import { Database } from "./db";

export type CacheKeys = "assets" | "songs" | "songs-data";

export type CacheData = Record<CacheKeys, number>;

export type Song = Database["public"]["Tables"]["songs"]["Row"];

export type SongWithAuthor = Song & { author: string };

export type Playlist = Database["public"]["Tables"]["playlists"]["Row"];

export type PlaylistWithoutCreatedAt = Omit<Playlist, "created_at">;

export type User = Database["public"]["Tables"]["users"]["Row"] & {
  email: string;
};
