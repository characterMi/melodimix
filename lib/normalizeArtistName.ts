import { removeDuplicatedSpaces } from "./removeDuplicatedSpaces";

export const normalizeArtistName = (text: string) =>
  removeDuplicatedSpaces(replaceCharacters(text.toLowerCase().trim()));

export const replaceCharacters = (text: string) =>
  text.replace(/([_%])/g, "\\$1");
