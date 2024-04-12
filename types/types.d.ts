import Stripe from "stripe";

interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  img_path: string;
}

interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
}
