/**
 * Date manipulation and formatting utilities.
 */

/**
 * Calculates number of nights between two ISO date strings (YYYY-MM-DD).
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/** ISO YYYY-MM-DD for a Date, in local time (never toISOString — that shifts by TZ). */
export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Parses YYYY-MM-DD into a local-midnight Date. Returns null for empty/invalid. */
export function fromISO(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Today at local midnight. */
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * The cells for one month grid: leading nulls to pad to the correct weekday,
 * then one Date per day. Weeks start Monday, matching airbnb.co.in.
 */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() is 0=Sun; shift so Monday is 0.
  const lead = (first.getDay() + 6) % 7;
  const cells: (Date | null)[] = Array(lead).fill(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));
  return cells;
}

/** "18 – 19 Sept" / "18 Sept – 2 Oct" / "Add dates" */
export function formatRangeLabel(checkIn: string, checkOut: string): string {
  const a = fromISO(checkIn);
  const b = fromISO(checkOut);
  if (!a) return "Add dates";
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  if (!b) return fmt(a);
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()} – ${fmt(b)}`;
  }
  return `${fmt(a)} – ${fmt(b)}`;
}
