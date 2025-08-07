export const getCleanParamValue = (value: string) => {
  const decoded = decodeURIComponent(value);

  // Protocol handlers...
  const parts = decoded.split("://");
  return parts.length > 1 ? parts[1].replace(/\/$/, "") : decoded;
};
