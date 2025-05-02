export function formatPercentage(part: number, total: number, decimals = 0) {
  if (total === 0) return 0;

  const percentage = (part / total) * 100;
  return +percentage.toFixed(decimals);
}
