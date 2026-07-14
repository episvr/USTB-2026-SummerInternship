export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

// 大数紧凑显示：1.2M / 3.4K / 5.6B
export function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(Math.round(n));
}

export function formatCost(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function signed(n: number, digits = 1): string {
  const s = n.toFixed(digits);
  return n > 0 ? "+" + s : s;
}
