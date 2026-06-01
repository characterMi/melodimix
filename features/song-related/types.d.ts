type Song = Database["public"]["Tables"]["songs"]["Row"];

type SongWithAuthor = Song & { author: string };
