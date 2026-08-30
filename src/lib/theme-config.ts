/**
 * Theme configuration for conference public pages.
 * Each template_id maps to a full set of CSS design tokens.
 */

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

// -----------------------------------------------
// Extended full-page template configs
// -----------------------------------------------
export type TemplateId =
  | "modern_gradient"
  | "dark_revival"
  | "cathedral_minimal"
  | "youth_energy";

export interface ThemeConfig {
  id: TemplateId;
  name: string;
  description: string;
  previewColors: string[]; // For the color swatch in the picker
  // Page-level
  pageBg: string;
  pageText: string;
  // Hero
  heroBg: string;
  heroOverlay: string;
  heroFallbackGradient: string;
  badgeBg: string;
  badgeText: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardText: string;
  cardSubtext: string;
  // Typography
  headingText: string;
  accentColor: string;
  accentLight: string;
  accentDark: string;
  // Sidebar
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  // WhatsApp box
  whatsappBg: string;
  whatsappText: string;
  whatsappButtonBg: string;
  whatsappButtonText: string;
  // Church card
  churchBoxBg: string;
  churchBoxText: string;
  churchBoxSubtext: string;
  // CTA
  ctaBg: string;
  ctaText: string;
  // Footer
  footerBg: string;
  footerText: string;
  footerBorder: string;
  // Font
  fontHeading: string;
}

export const THEME_CONFIGS: Record<TemplateId, ThemeConfig> = {
  modern_gradient: {
    id: "modern_gradient",
    name: "Modern Gradient",
    description: "Sleek indigo & purple glow with clean white content",
    previewColors: ["#4f46e5", "#7c3aed", "#f8fafc"],
    pageBg: "bg-slate-50",
    pageText: "text-slate-900",
    heroBg: "bg-slate-950",
    heroOverlay: "bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent",
    heroFallbackGradient: "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950",
    badgeBg: "bg-white/10 backdrop-blur-md border border-white/20",
    badgeText: "text-indigo-300",
    cardBg: "bg-white",
    cardBorder: "border-slate-200/80",
    cardShadow: "shadow-sm",
    cardText: "text-slate-900",
    cardSubtext: "text-slate-600",
    headingText: "text-slate-900",
    accentColor: "text-indigo-600",
    accentLight: "bg-indigo-50",
    accentDark: "bg-indigo-900",
    sidebarBg: "bg-white",
    sidebarBorder: "border-slate-200/80",
    sidebarText: "text-slate-900",
    whatsappBg: "bg-emerald-950",
    whatsappText: "text-emerald-200",
    whatsappButtonBg: "bg-emerald-500 hover:bg-emerald-400",
    whatsappButtonText: "text-slate-950",
    churchBoxBg: "bg-slate-900",
    churchBoxText: "text-white",
    churchBoxSubtext: "text-slate-400",
    ctaBg: "bg-indigo-600 hover:bg-indigo-700",
    ctaText: "text-white",
    footerBg: "bg-white",
    footerText: "text-slate-500",
    footerBorder: "border-slate-200",
    fontHeading: "font-heading",
  },

  dark_revival: {
    id: "dark_revival",
    name: "Dark Atmosphere & Fire",
    description: "Cinematic deep amber & gold with warm dark cards",
    previewColors: ["#09090b", "#92400e", "#fbbf24"],
    pageBg: "bg-zinc-950",
    pageText: "text-zinc-100",
    heroBg: "bg-zinc-950",
    heroOverlay: "bg-gradient-to-t from-zinc-950 via-zinc-900/70 to-transparent",
    heroFallbackGradient: "bg-gradient-to-br from-amber-950 via-zinc-900 to-orange-950",
    badgeBg: "bg-amber-900/50 backdrop-blur-md border border-amber-700/40",
    badgeText: "text-amber-300",
    cardBg: "bg-zinc-900",
    cardBorder: "border-zinc-800",
    cardShadow: "shadow-lg shadow-black/40",
    cardText: "text-zinc-100",
    cardSubtext: "text-zinc-400",
    headingText: "text-amber-100",
    accentColor: "text-amber-400",
    accentLight: "bg-amber-950/50",
    accentDark: "bg-amber-900",
    sidebarBg: "bg-zinc-900",
    sidebarBorder: "border-zinc-800",
    sidebarText: "text-zinc-100",
    whatsappBg: "bg-emerald-950",
    whatsappText: "text-emerald-200",
    whatsappButtonBg: "bg-emerald-600 hover:bg-emerald-500",
    whatsappButtonText: "text-white",
    churchBoxBg: "bg-zinc-800",
    churchBoxText: "text-zinc-100",
    churchBoxSubtext: "text-zinc-500",
    ctaBg: "bg-amber-600 hover:bg-amber-500",
    ctaText: "text-zinc-950",
    footerBg: "bg-zinc-950",
    footerText: "text-zinc-600",
    footerBorder: "border-zinc-800",
    fontHeading: "font-heading",
  },

  cathedral_minimal: {
    id: "cathedral_minimal",
    name: "Minimalist Cathedral",
    description: "Clean white & slate elegance with classic typography",
    previewColors: ["#fafaf9", "#78716c", "#292524"],
    pageBg: "bg-stone-50",
    pageText: "text-stone-900",
    heroBg: "bg-stone-900",
    heroOverlay: "bg-gradient-to-t from-stone-900 via-stone-800/50 to-transparent",
    heroFallbackGradient: "bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900",
    badgeBg: "bg-white/20 backdrop-blur-md border border-white/30",
    badgeText: "text-stone-200",
    cardBg: "bg-white",
    cardBorder: "border-stone-200",
    cardShadow: "shadow-sm",
    cardText: "text-stone-900",
    cardSubtext: "text-stone-600",
    headingText: "text-stone-900",
    accentColor: "text-stone-700",
    accentLight: "bg-stone-100",
    accentDark: "bg-stone-800",
    sidebarBg: "bg-white",
    sidebarBorder: "border-stone-200",
    sidebarText: "text-stone-900",
    whatsappBg: "bg-emerald-900",
    whatsappText: "text-emerald-100",
    whatsappButtonBg: "bg-emerald-600 hover:bg-emerald-500",
    whatsappButtonText: "text-white",
    churchBoxBg: "bg-stone-800",
    churchBoxText: "text-stone-100",
    churchBoxSubtext: "text-stone-400",
    ctaBg: "bg-stone-800 hover:bg-stone-700",
    ctaText: "text-white",
    footerBg: "bg-white",
    footerText: "text-stone-500",
    footerBorder: "border-stone-200",
    fontHeading: "font-serif",
  },

  youth_energy: {
    id: "youth_energy",
    name: "High Energy Youth",
    description: "Vibrant neon & bold typography for dynamic events",
    previewColors: ["#030712", "#4ade80", "#a3e635"],
    pageBg: "bg-gray-950",
    pageText: "text-gray-50",
    heroBg: "bg-gray-950",
    heroOverlay: "bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent",
    heroFallbackGradient: "bg-gradient-to-br from-lime-950 via-gray-900 to-cyan-950",
    badgeBg: "bg-lime-400/10 backdrop-blur-md border border-lime-400/30",
    badgeText: "text-lime-400",
    cardBg: "bg-gray-900",
    cardBorder: "border-gray-800",
    cardShadow: "shadow-xl shadow-black/50",
    cardText: "text-gray-50",
    cardSubtext: "text-gray-400",
    headingText: "text-lime-300",
    accentColor: "text-lime-400",
    accentLight: "bg-lime-950/50",
    accentDark: "bg-lime-900",
    sidebarBg: "bg-gray-900",
    sidebarBorder: "border-gray-800",
    sidebarText: "text-gray-100",
    whatsappBg: "bg-emerald-950",
    whatsappText: "text-emerald-200",
    whatsappButtonBg: "bg-lime-500 hover:bg-lime-400",
    whatsappButtonText: "text-gray-950",
    churchBoxBg: "bg-gray-800",
    churchBoxText: "text-gray-100",
    churchBoxSubtext: "text-gray-500",
    ctaBg: "bg-lime-500 hover:bg-lime-400",
    ctaText: "text-gray-950",
    footerBg: "bg-gray-950",
    footerText: "text-gray-600",
    footerBorder: "border-gray-800",
    fontHeading: "font-heading",
  },
};

export function getThemeConfig(templateId: string | null | undefined): ThemeConfig {
  if (templateId && templateId in THEME_CONFIGS) {
    return THEME_CONFIGS[templateId as TemplateId];
  }
  return THEME_CONFIGS.modern_gradient;
}

export const ALL_TEMPLATES = Object.values(THEME_CONFIGS);
