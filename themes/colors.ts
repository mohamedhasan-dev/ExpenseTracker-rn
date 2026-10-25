/**
 * Palette taken from the app's reference painting (torii gate in the blossom forest):
 *   ink      - slate-blue shadows    -> background, surface
 *   snow     - misty white           -> text
 *   mist     - soft pale blue        -> primary (income, links, focus, spinners)
 *   crimson  - deep blossom red      -> accent (fills: buttons, FAB; borders of selected items)
 *   blossom  - light pink-red        -> expense (red TEXT: expense amounts, "over", destructive labels)
 *   lantern  - warm amber            -> warning (errors, offline banner)
 *
 * Rules: never put `accent` on text over background/surface (too low contrast) -
 * use `expense` for red text. Text that should look secondary uses `textMuted`,
 * not `text` + opacity. Every text colour here passes WCAG AA (4.5:1) on both
 * `background` and `surface`.
 */
export interface ColorsType {
  /** Main text */
  text: string;
  /** Secondary labels, captions, placeholders, muted icons */
  textMuted: string;
  background: string;
  /** Cards, sheets, inputs */
  surface: string;
  /** Hairlines, borders, unselected chip / segment fills */
  surface2: string;
  secondary: string;
  /** Mist blue: income, links, focus rings, spinners */
  primary: string;
  /** Crimson: filled buttons, FAB, selected chips (always with `onAccent` text) */
  accent: string;
  /** Text / icons drawn on top of `accent` */
  onAccent: string;
  /** Selected chips / tiles / rows: `accent` border + this see-through fill... */
  accentSoft: string;
  /** ...with labels and icons in this colour (readable on the tinted fill) */
  accentText: string;
  /** Blossom red for text: expense amounts, "over budget", destructive labels */
  expense: string;
  /** Tinted backgrounds for income / expense badges */
  incomeSoft: string;
  expenseSoft: string;
  /** Lantern amber: errors, warnings, offline / stale-data banner */
  warning: string;
}

export const dark_colors: ColorsType = {
  text: "hsl(198, 32%, 92%)",
  textMuted: "hsl(203, 16%, 68%)",
  background: "hsl(214, 29%, 11%)",
  surface: "hsl(211, 26%, 17%)",
  surface2: "hsla(207, 24%, 34%, 0.55)",
  secondary: "hsl(192, 73%, 30%)",
  primary: "hsl(200, 48%, 72%)",
  accent: "hsl(355, 58%, 48%)",
  onAccent: "hsl(0, 0%, 100%)",
  accentSoft: "hsla(350, 78%, 73%, 0.12)",
  accentText: "hsl(350, 78%, 73%)",
  expense: "hsl(350, 78%, 73%)",
  incomeSoft: "hsla(200, 48%, 72%, 0.16)",
  expenseSoft: "hsla(350, 78%, 73%, 0.16)",
  warning: "hsl(36, 85%, 62%)",
};

export const light_colors: ColorsType = {
  text: "hsl(211, 30%, 14%)",
  textMuted: "hsl(209, 14%, 38%)",
  background: "hsl(203, 31%, 95%)",
  surface: "hsl(200, 60%, 99%)",
  surface2: "hsla(205, 30%, 78%, 0.55)",
  secondary: "hsl(192, 73%, 30%)",
  primary: "hsl(203, 55%, 34%)",
  accent: "hsl(355, 62%, 45%)",
  onAccent: "hsl(0, 0%, 100%)",
  accentSoft: "hsla(355, 62%, 45%, 0.08)",
  accentText: "hsl(355, 62%, 45%)",
  expense: "hsl(352, 65%, 40%)",
  incomeSoft: "hsla(203, 55%, 34%, 0.12)",
  expenseSoft: "hsla(352, 65%, 40%, 0.10)",
  warning: "hsl(30, 90%, 33%)",
};

// Previous palette (before 25/10/2026), kept for reference:
// dark  - text hsl(186,70%,91%), background hsl(210,27%,13%), surface hsl(207,30%,20%),
//         surface2 hsla(207,29%,30%,0.74), primary hsl(198,60%,55%), accent hsl(358,47%,50%)
// light - text hsl(210,26%,15%), background hsl(192,65%,91%), surface hsl(192,50%,97%),
//         surface2 hsla(192,35%,82%,0.7), primary hsl(198,60%,55%), accent hsl(358,47%,50%)
