export const sanitize = (text: string) =>
  text.replace(/[^a-z0-9_\-\.]/gi, "_").toLowerCase();
