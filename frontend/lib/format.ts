/**
 * Formatting utilities for Indian INR currency and text presentation.
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
