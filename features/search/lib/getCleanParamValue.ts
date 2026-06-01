export const getCleanParamValue = (value: string) => {
  const decoded = decodeURIComponent(value);

  // Protocol handlers...
  if (
    decoded.startsWith("web+melodimix") ||
    decoded.startsWith("web melodimix")
  ) {
    const payload = decoded.slice(decoded.indexOf(":") + 1);
    return payload.replace(/\//g, "").trim();
  }

  return decoded;
};
