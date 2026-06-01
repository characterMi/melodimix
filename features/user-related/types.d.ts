type User = Database["public"]["Tables"]["users"]["Row"] & {
  email: string;
};
