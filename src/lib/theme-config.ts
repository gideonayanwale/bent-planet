export interface ThemePreset {
  id: string;
  name: string;
  bgClass: string;
  cardClass: string;
  textClass: string;
  accentClass: string;
  badgeClass: string;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  cool_dark: {
    id: "cool_dark",
    name: "Cool Dark (Obsidian & Cyan)",
    bgClass: "bg-slate-950 text-slate-100",
    cardClass: "bg-slate-900/90 border-slate-800 text-slate-100",
    textClass: "text-slate-100",
    accentClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
    badgeClass: "bg-indigo-950/80 text-cyan-300 border-cyan-800",
  },
  warm_light: {
    id: "warm_light",
    name: "Warm Light (Radiant Amber)",
    bgClass: "bg-amber-50/40 text-slate-900",
    cardClass: "bg-white/95 border-amber-200/80 text-slate-900 shadow-sm",
    textClass: "text-slate-900",
    accentClass: "bg-amber-600 hover:bg-amber-700 text-white",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  emerald_revival: {
    id: "emerald_revival",
    name: "Emerald Revival",
    bgClass: "bg-slate-950 text-emerald-50",
    cardClass: "bg-slate-900/90 border-emerald-900/50 text-emerald-50",
    textClass: "text-emerald-50",
    accentClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    badgeClass: "bg-emerald-950 text-emerald-300 border-emerald-700",
  },
  royal_purple: {
    id: "royal_purple",
    name: "Royal Purple",
    bgClass: "bg-slate-950 text-purple-50",
    cardClass: "bg-purple-950/40 border-purple-800/40 text-purple-50",
    textClass: "text-purple-50",
    accentClass: "bg-purple-600 hover:bg-purple-700 text-white",
    badgeClass: "bg-purple-900/80 text-purple-200 border-purple-700",
  },
};
