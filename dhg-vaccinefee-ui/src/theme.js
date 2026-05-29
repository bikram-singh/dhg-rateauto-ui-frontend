// ── DHG Theme Helper ──
// Import this in any page component to get light/dark aware styles
// Usage: const t = theme(darkMode);
// Then use: style={{ background: t.card, color: t.text }}

export const theme = (dark = true) => ({
  // Backgrounds
  page:       dark ? "#0A1628"                  : "#EBF5F7",
  card:       dark ? "#0D1F35"                  : "#FFFFFF",
  cardAlt:    dark ? "#0F2440"                  : "#F0FBFC",
  surface:    dark ? "rgba(255,255,255,0.06)"   : "#FFFFFF",
  surfaceAlt: dark ? "rgba(255,255,255,0.04)"   : "#F5FEFF",
  input:      dark ? "rgba(255,255,255,0.08)"   : "#F0FBFC",
  hover:      dark ? "rgba(255,255,255,0.04)"   : "rgba(8,145,178,0.05)",
  tableHead:  dark ? "rgba(255,255,255,0.05)"   : "#EBF8FA",

  // Text
  text:       dark ? "rgba(255,255,255,0.88)"   : "#0C2340",
  textSec:    dark ? "rgba(255,255,255,0.55)"   : "#2E6B7A",
  textMuted:  dark ? "rgba(255,255,255,0.35)"   : "#6B9EAA",

  // Borders
  border:     dark ? "rgba(255,255,255,0.08)"   : "rgba(8,145,178,0.12)",
  borderMid:  dark ? "rgba(255,255,255,0.12)"   : "rgba(8,145,178,0.2)",
  borderBold: dark ? "rgba(255,255,255,0.18)"   : "rgba(8,145,178,0.3)",

  // Accents — same in both modes
  teal:       "#2DD4BF",
  tealMid:    "#0891B2",
  tealBg:     dark ? "rgba(45,212,191,0.1)"     : "rgba(8,145,178,0.08)",
  tealBorder: dark ? "rgba(45,212,191,0.25)"    : "rgba(8,145,178,0.2)",
  green:      "#34D399",
  red:        "#F87171",
  amber:      "#FCD34D",
  orange:     "#FFA726",
  purple:     "#AB47BC",
  blue:       "#60A5FA",

  // Price color
  price:      dark ? "#2DD4BF"                  : "#0891B2",
});
