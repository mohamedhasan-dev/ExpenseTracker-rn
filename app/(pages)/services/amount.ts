type AmountOptions = {
  /** Digits after the decimal point (default 2) */
  decimals?: number;
  /** Short form for tight spaces: ₹1.24K, ₹3.5L, ₹1.2Cr */
  compact?: boolean;
};

const SYMBOL = "₹";

/** Formats a number as Indian rupees, e.g. amount(124050.5) → "₹1,24,050.50" */
export default function amount(
  amt: number | string,
  { decimals = 2, compact = false }: AmountOptions = {},
) {
  const n = Number(amt);
  if (!Number.isFinite(n)) return `${SYMBOL}${amt}`;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  if (compact) {
    const units: [number, string][] = [
      [1e7, "Cr"],
      [1e5, "L"],
      [1e3, "K"],
    ];
    for (const [size, suffix] of units) {
      if (abs >= size) {
        return `${sign}${SYMBOL}${parseFloat((abs / size).toFixed(2))}${suffix}`;
      }
    }
    return `${sign}${SYMBOL}${parseFloat(abs.toFixed(decimals))}`;
  }

  return `${sign}${SYMBOL}${abs.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Splits "₹1,240.50" into { whole: "₹1,240", fraction: ".50" } so decimals can be styled separately */
export function splitAmount(amt: number | string, decimals = 2) {
  const formatted = amount(amt, { decimals });
  const dot = formatted.lastIndexOf(".");
  return dot === -1
    ? { whole: formatted, fraction: "" }
    : { whole: formatted.slice(0, dot), fraction: formatted.slice(dot) };
}
