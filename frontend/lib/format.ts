/**
 * Formatting utilities for Indian INR currency, dates, and text presentation.
 */

/**
 * Formats an amount in INR without decimals, using Indian number grouping (e.g. ₹7,400).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an ISO YYYY-MM-DD date string as M/D/YYYY (e.g. 9/18/2026).
 */
export function formatDateDisplay(isoStr: string): string {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length === 3) {
    return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}/${parts[0]}`;
  }
  return isoStr;
}

/**
 * Formats a cancellation deadline date (e.g. "17 September").
 */
export function formatCancellationDate(isoStr: string): string {
  if (!isoStr) return "17 September";
  const parts = isoStr.split("-");
  if (parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  }
  return "17 September";
}
