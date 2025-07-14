export const sanitize = (text: string) => text.replace(/[<>:"/\\|?*]/g, "_");
