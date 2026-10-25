/** First day of the month `offset` months away from `date` (local time) */
export const startOfMonth = (date: Date, offset = 0) =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1);

/**
 * Local-time month window as ISO strings for GET /transactions?from&to.
 * `to` is exclusive (start of next month).
 */
export function monthRange(date: Date) {
  return {
    from: startOfMonth(date).toISOString(),
    to: startOfMonth(date, 1).toISOString(),
  };
}

export const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** "October 2026" */
export const formatMonth = (date: Date) =>
  date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

// Fixed 3-letter names: the en-IN locale writes September as "Sept", which breaks
// the 3-letter style used across the app ("Oct 2026", "22 Oct")
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const yearSuffix = (date: Date) =>
  date.getFullYear() !== new Date().getFullYear() ? ` ${date.getFullYear()}` : "";

/** "Oct 2026" */
export const formatShortMonth = (date: Date) =>
  `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const dayStart = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const daysAgo = (d: Date) =>
  Math.round((dayStart(new Date()) - dayStart(d)) / 86_400_000);

/** "2:40 pm" */
export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

/** "Today, 2:40 pm" / "Yesterday" / "14 Oct" / "14 Oct 2025" */
export function formatRelativeDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const ago = daysAgo(d);
  if (ago === 0) return `Today, ${formatTime(d)}`;
  if (ago === 1) return "Yesterday";
  return `${formatShortDate(d)}${yearSuffix(d)}`;
}

/** "22 Oct" */
export const formatShortDate = (date: Date) =>
  `${date.getDate()} ${MONTHS[date.getMonth()]}`;

/** Section heading for a day: "Today · 22 Oct" / "Yesterday · 21 Oct" / "Mon, 19 Oct" */
export function formatDayHeading(date: Date) {
  const ago = daysAgo(date);
  if (ago === 0) return `Today · ${formatShortDate(date)}`;
  if (ago === 1) return `Yesterday · ${formatShortDate(date)}`;
  return `${WEEKDAYS[date.getDay()]}, ${formatShortDate(date)}${yearSuffix(date)}`;
}

/** Local midnight of `date` */
export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Local midnight `days` days after `date` */
export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** Monday of the week containing `date` (local midnight) */
export const startOfWeek = (date: Date) => {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() + 6) % 7));
};

/** Whole local days from..to (inclusive) as an ISO window for GET /transactions */
export function dayRange(from: Date, to: Date) {
  const [first, last] = from <= to ? [from, to] : [to, from];
  return {
    from: startOfDay(first).toISOString(),
    to: addDays(last, 1).toISOString(),
  };
}

/** Local calendar day key, e.g. "2026-10-21" */
export const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
