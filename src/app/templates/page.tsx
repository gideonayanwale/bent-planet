"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SparklesIcon,
  LayersIcon,
  LayoutGridIcon,
  LaptopIcon,
  TabletIcon,
  SmartphoneIcon,
  PaletteIcon,
  Wand2Icon,
  CheckIcon,
  CopyIcon,
  ArrowRightIcon,
  SlidersHorizontalIcon,
  ShieldCheckIcon,
  RadioIcon,
  FlameIcon,
  BookOpenIcon,
  EyeIcon,
  MessageCircleIcon,
  UsersIcon,
  ClockIcon,
  DownloadIcon,
  ChevronRightIcon,
  TypeIcon,
  CompassIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WireframePresetId,
  WireframeBlockType,
  WireframeSlotData,
  WIREFRAME_PRESETS,
  ALL_WIREFRAME_PRESETS,
  WIREFRAME_BLOCK_CATALOG,
  SAMPLE_AI_WIREFRAME_PACKS,
  getWireframePreset,
} from "@/lib/wireframe-config";
import { THEME_CONFIGS, TemplateId, ALL_TEMPLATES, getThemeConfig } from "@/lib/theme-config";
import { ConferenceWireframe } from "@/components/wireframes/conference-wireframe";

// =========================================================================
// Curated UI Component Specs pulled from Design Libraries (Relume / Untitled UI / Cruip / Tailwind UI / Aceternity)
// =========================================================================
const DESIGN_LIBRARY_BLOCKS = [
  {
    id: "bento_dock",
    name: "Asymmetric Bento Stream Dock",
    category: "media",
    categoryLabel: "Media & Broadcast",
    sourceLibrary: "Untitled UI + Modern Bento System",
    description: "12-column responsive bento viewport with picture-in-picture countdown and ambient glow filter.",
    tags: ["High Density", "1080p Dock", "Glass Backdrop"],
    tokens: "bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6",
  },
  {
    id: "split_hero",
    name: "Atmospheric Faith Hero",
    category: "hero",
    categoryLabel: "Hero Stage",
    sourceLibrary: "Cruip + Tailwind UI Faith Kit",
    description: "Centered spiritual proclamation with glowing amber/violet halo, scripture pill, and host attribution.",
    tags: ["High Contrast", "Scripture Anchor", "Aura Gradient"],
    tokens: "bg-radial-gradient from-slate-950 to-indigo-950/80 text-white rounded-3xl",
  },
  {
    id: "track_timeline",
    name: "Time-Blocked Track Matrix",
    category: "schedule",
    categoryLabel: "Ministry Schedule",
    sourceLibrary: "Relume Design System",
    description: "Chronological multi-session timeline featuring session category tags (Worship, Keynote, Altar Call).",
    tags: ["Monospace Time", "Track Pills", "Expandable Details"],
    tokens: "p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600",
  },
  {
    id: "sticky_rsvp",
    name: "Conversion RSVP & Capacity Meter",
    category: "conversion",
    categoryLabel: "Lead Capture",
    sourceLibrary: "Luma + High-Conversion SaaS Kit",
    description: "Sticky 1-click registration card featuring dynamic seat limits, urgency bar, and WhatsApp chat sync.",
    tags: ["Urgency Meter", "1-Click Lead", "WhatsApp Sync"],
    tokens: "sticky top-20 rounded-3xl p-6 shadow-2xl border bg-slate-900/90",
  },
  {
    id: "speaker_dossier",
    name: "Executive Ministerial Dossier",
    category: "dossier",
    categoryLabel: "Speaker Roster",
    sourceLibrary: "Aceternity + Corporate Summit Kit",
    description: "Apostolic minister profile card with calling credentials, mission tags, and session linking.",
    tags: ["Apostolic Badges", "Avatar Framing", "Social Pop"],
    tokens: "rounded-3xl p-8 border backdrop-blur-md shadow-xl bg-slate-900/90",
  },
  {
    id: "prayer_wall_card",
    name: "Live Intercession & Prayer Drawer",
    category: "fellowship",
    categoryLabel: "Community & Fellowship",
    sourceLibrary: "Bent Planet Faith Design System",
    description: "Real-time attendee prayer request grid with interactive 'I Prayed 🙏' counter and pastoral reply badge.",
    tags: ["Faith Community", "Live Counter", "Pastoral Care"],
    tokens: "p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600",
  },
  {
    id: "devotional_lead_magnet",
    name: "Devotional Study Notes Companion Card",
    category: "conversion",
    categoryLabel: "Lead Capture",
    sourceLibrary: "Refactoring UI + Faith Kit",
    description: "High-perceived-value digital syllabus or prayer booklet deliverable offered immediately upon attendee registration.",
    tags: ["Lead Magnet", "PDF Download", "Instant Value"],
    tokens: "p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border",
  },
  {
    id: "whatsapp_vip_lounge",
    name: "Direct WhatsApp Community Gate",
    category: "fellowship",
    categoryLabel: "Community & Fellowship",
    sourceLibrary: "Tailwind UI Marketing Kit",
    description: "One-click WhatsApp Community banner with direct phone pre-fill for church coordinators and pastoral staff.",
    tags: ["Zero Friction", "WhatsApp Deep-Link", "Instant Chat"],
    tokens: "p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
  },
];

// =========================================================================
// Curated Faith & Ministry Typography Pairings
// =========================================================================
const FAITH_TYPOGRAPHY_PAIRINGS = [
  {
    name: "Liturgical Sacred Editorial",
    vibe: "Cathedral, Reformed, Biblical Theology, Hymnody",
    headingFont: "Cormorant Garamond (Serif)",
    bodyFont: "Plus Jakarta Sans (Modern Sans)",
    sampleText: "“For where two or three are gathered in my name, there am I in the midst of them.”",
    recommendedFor: "cathedral_editorial & grace_sage",
    cssClass: "font-serif",
  },
  {
    name: "Modern Tech Kingdom",
    vibe: "Bento Summits, Global Congress, Innovation Ministry",
    headingFont: "Syne & Outfit (Geometric Display)",
    bodyFont: "Inter / System Sans (Neutral Sans)",
    sampleText: "“And they that be wise shall shine as the brightness of the firmament.”",
    recommendedFor: "bento_apex & modern_gradient",
    cssClass: "font-heading",
  },
  {
    name: "Apostolic Authority & Fire",
    vibe: "Revival, Miracles, Consecration, Deliverance",
    headingFont: "Playfair Display / Cinzel (Majestic)",
    bodyFont: "DM Sans (High Legibility)",
    sampleText: "“And it shall come to pass afterward, that I will pour out my spirit upon all flesh.”",
    recommendedFor: "cinematic_fire & dark_revival",
    cssClass: "font-serif",
  },
  {
    name: "NextGen High-Voltage Kinetic",
    vibe: "Campus Movement, Youth Festival, Digital Creatives",
    headingFont: "Cabinet Grotesk / Clash Display (Heavy)",
    bodyFont: "Plus Jakarta Sans (Punchy Sans)",
    sampleText: "“Let no one despise your youth, but be an example in word, in conduct, in love.”",
    recommendedFor: "neon_surge & youth_energy",
    cssClass: "font-heading",
  },
];

// =========================================================================
// Curated Faith & Ministry Color Palettes
// =========================================================================
const FAITH_COLOR_PALETTES = [
  {
    name: "Obsidian & Divine Fire",
    vibe: "Revival, Miracles, Holy Ghost Gatherings",
    colors: [
      { role: "Canvas", hex: "#09090b", label: "Deep Obsidian" },
      { role: "Surface", hex: "#18181b", label: "Zinc Dark" },
      { role: "Primary Accent", hex: "#f59e0b", label: "Fire Amber" },
      { role: "Secondary", hex: "#d97706", label: "Golden Flame" },
      { role: "Highlight", hex: "#fef3c7", label: "Warm Light" },
    ],
  },
  {
    name: "Electric Indigo & Cyber Slate",
    vibe: "Modern Tech, Bento Summits, Global Congress",
    colors: [
      { role: "Canvas", hex: "#020617", label: "Midnight Deep" },
      { role: "Surface", hex: "#0f172a", label: "Slate Glass" },
      { role: "Primary Accent", hex: "#6366f1", label: "Electric Indigo" },
      { role: "Secondary", hex: "#a855f7", label: "Radiant Violet" },
      { role: "Highlight", hex: "#e0e7ff", label: "Ice Indigo" },
    ],
  },
  {
    name: "Sacred Stone & Liturgical Bronze",
    vibe: "Cathedral, Theological Symposia, Worship Nights",
    colors: [
      { role: "Canvas", hex: "#fafaf9", label: "Stone Light" },
      { role: "Surface", hex: "#ffffff", label: "Pure White" },
      { role: "Primary Accent", hex: "#44403c", label: "Sacred Stone" },
      { role: "Secondary", hex: "#78716c", label: "Liturgical Warm" },
      { role: "Highlight", hex: "#f5f5f4", label: "Soft Cream" },
    ],
  },
  {
    name: "Cyber Lime & Dark Matrix",
    vibe: "NextGen Youth, Campus Revival, Creatives",
    colors: [
      { role: "Canvas", hex: "#030712", label: "Abyss Dark" },
      { role: "Surface", hex: "#111827", label: "Charcoal Card" },
      { role: "Primary Accent", hex: "#4ade80", label: "Cyber Lime" },
      { role: "Secondary", hex: "#a3e635", label: "Neon Volt" },
      { role: "Highlight", hex: "#f0fdf4", label: "Electric Tint" },
    ],
  },
  {
    name: "Royal Navy & Champagne Gold",
    vibe: "Executive Leadership, Kingdom Governance, Marketplace",
    colors: [
      { role: "Canvas", hex: "#0a0f1d", label: "Royal Navy" },
      { role: "Surface", hex: "#111a2e", label: "Deep Sapphire" },
      { role: "Primary Accent", hex: "#d97706", label: "Champagne Gold" },
      { role: "Secondary", hex: "#b45309", label: "Burnished Bronze" },
      { role: "Highlight", hex: "#fef3c7", label: "Pearl Gold" },
    ],
  },
  {
    name: "Warm Ivory & Sage Emerald",
    vibe: "Family, Marriage, Community & Healing",
    colors: [
      { role: "Canvas", hex: "#fdfbf7", label: "Warm Ivory" },
      { role: "Surface", hex: "#ffffff", label: "Linen White" },
      { role: "Primary Accent", hex: "#166534", label: "Sage Emerald" },
      { role: "Secondary", hex: "#4ade80", label: "Fresh Sprout" },
      { role: "Highlight", hex: "#f0fdf4", label: "Calm Mist" },
    ],
  },
];

export default function TemplatesShowcasePage() {
  // Active state
  const [selectedPresetId, setSelectedPresetId] = useState<WireframePresetId>("bento_apex");
  const [selectedThemeId, setSelectedThemeId] = useState<TemplateId>("bento_apex");
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePresetCategory, setActivePresetCategory] = useState<string>("all");
  const [activeResourceCategory, setActiveResourceCategory] = useState<string>("all");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // AI Fine-Tuner Playground State
  const [fineTunerSample, setFineTunerSample] = useState<"revival" | "youth" | "leadership" | "cathedral" | "grace">("revival");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [fineTunedData, setFineTunedData] = useState<WireframeSlotData>(
    SAMPLE_AI_WIREFRAME_PACKS.revival
  );

  // Wireframe Block Customization State
  const [enabledBlocks, setEnabledBlocks] = useState<WireframeBlockType[]>([
    "brand_nav",
    "hero_stage",
    "stream_dock",
    "about_mandate",
    "ministers_roster",
    "track_agenda",
    "study_resource",
    "prayer_wall",
    "rsvp_sticky",
    "whatsapp_community",
    "church_footer",
  ]);
  const [selectedInspectorBlock, setSelectedInspectorBlock] = useState<WireframeBlockType | null>("hero_stage");
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState<string | null>(null);

  // Filter presets by category
  const filteredPresets = ALL_WIREFRAME_PRESETS.filter((preset) => {
    if (activePresetCategory === "all") return true;
    if (activePresetCategory === "revival") return preset.id === "cinematic_fire";
    if (activePresetCategory === "tech") return preset.id === "bento_apex";
    if (activePresetCategory === "minimal") return preset.id === "cathedral_editorial";
    if (activePresetCategory === "youth") return preset.id === "neon_surge";
    if (activePresetCategory === "executive") return preset.id === "executive_summit";
    if (activePresetCategory === "community") return preset.id === "grace_sage";
    return true;
  });

  // Filter resources by category
  const filteredResources = DESIGN_LIBRARY_BLOCKS.filter((block) => {
    if (activeResourceCategory === "all") return true;
    return block.category === activeResourceCategory;
  });

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyTokens = (tokens: string, id: string) => {
    navigator.clipboard.writeText(tokens);
    setCopiedTokens(id);
    setTimeout(() => setCopiedTokens(null), 2000);
  };

  const handleCopyWireframeConfig = () => {
    const config = {
      presetId: selectedPresetId,
      templateId: selectedThemeId,
      activeBlocks: enabledBlocks,
      sampleData: fineTunedData.conferenceTitle,
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2500);
  };

  // Toggle wireframe block
  const toggleBlock = (blockId: WireframeBlockType) => {
    if (WIREFRAME_BLOCK_CATALOG[blockId].isFixed) return;
    if (enabledBlocks.includes(blockId)) {
      setEnabledBlocks(enabledBlocks.filter((id) => id !== blockId));
    } else {
      setEnabledBlocks([...enabledBlocks, blockId]);
    }
  };

  // Trigger AI Fine-Tuning Simulation
  const runAiFineTuning = () => {
    setIsFineTuning(true);
    setTimeout(() => {
      let basePack = SAMPLE_AI_WIREFRAME_PACKS[fineTunerSample] || SAMPLE_AI_WIREFRAME_PACKS.revival;
      if (customPrompt.trim()) {
        basePack = {
          ...basePack,
          conferenceTitle: customPrompt.trim(),
          heroContextHeadline: `AI Slotted for ${customPrompt.trim()}: Tailored with spiritual revelation, targeted breakout tracks, and WhatsApp community sync.`,
        };
      }
      setFineTunedData(basePack);
      setIsFineTuning(false);
    }, 750);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* =========================================================
            HEADER / NAVIGATION
           ========================================================= */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  BP
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-white block">
                    Bent Planet
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase block -mt-1">
                    Design System & Templates Showroom
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800">
                <Link href="/dashboard/conferences/new">
                  <ArrowRightIcon className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Open Conference Builder
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* =========================================================
            HERO SECTION
           ========================================================= */}
        <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20 border-b border-slate-800/80">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-inner">
              <SparklesIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Design Library Resources & Fixed-but-Flexible Wireframe Customs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Craft High-Converting Church Gatherings with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300">
                Slotted AI Wireframes
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
              Every generation of conferences is anchored on an <strong>invariant, high-converting faith skeleton</strong>{" "}
              (Brand, Hero, Livestream, Ministers, Tracks, Devotional, WhatsApp RSVP), rendered through{" "}
              <strong>6 polymorphic wireframe topologies</strong> that AI fine-tunes directly into production.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                <span className="text-xs text-slate-400 block mb-0.5">Wireframe Presets</span>
                <span className="text-xl font-bold text-white">6 Topologies</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                <span className="text-xs text-slate-400 block mb-0.5">Design Libraries</span>
                <span className="text-xl font-bold text-indigo-400">40+ Production Specs</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                <span className="text-xs text-slate-400 block mb-0.5">Spiritual Themes</span>
                <span className="text-xl font-bold text-amber-400">8 Curated Palettes</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                <span className="text-xs text-slate-400 block mb-0.5">AI Fine-Tuning</span>
                <span className="text-xl font-bold text-emerald-400">100% Slotted Output</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            INTERACTIVE DEVICE CANVAS & WIREFRAME SIMULATOR
           ========================================================= */}
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <LayersIcon className="w-5 h-5 text-indigo-400" />
                Live Wireframe Canvas Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Preview how the polymorphic wireframe topologies adapt seamlessly across Desktop, Tablet, and Mobile devices.
              </p>
            </div>

            {/* Device Viewport Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
              <button
                onClick={() => setDeviceViewport("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  deviceViewport === "desktop"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LaptopIcon className="w-3.5 h-3.5" /> Desktop (1280px)
              </button>
              <button
                onClick={() => setDeviceViewport("tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  deviceViewport === "tablet"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TabletIcon className="w-3.5 h-3.5" /> Tablet (768px)
              </button>
              <button
                onClick={() => setDeviceViewport("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  deviceViewport === "mobile"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <SmartphoneIcon className="w-3.5 h-3.5" /> Mobile (375px)
              </button>
            </div>
          </div>

          {/* Quick Preset Selector Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ALL_WIREFRAME_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setSelectedThemeId(preset.recommendedTheme);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20 scale-[1.02]"
                      : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: preset.accentColorHex }}
                  />
                  {preset.name}
                </button>
              );
            })}
          </div>

          {/* Device Canvas Frame with Fluid Transition */}
          <div className="w-full flex justify-center bg-slate-950/60 p-4 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
            <div
              className={`transition-all duration-500 ease-out border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-950 ${
                deviceViewport === "desktop"
                  ? "w-full max-w-6xl"
                  : deviceViewport === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              {/* Simulator Browser Top Bar */}
              <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 text-[11px] text-slate-400 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                  bentplanet.com/c/grace-city/{fineTunedData.conferenceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                  {selectedPresetId} ({deviceViewport})
                </span>
              </div>

              {/* Rendered Wireframe Inside Canvas */}
              <div className="max-h-[750px] overflow-y-auto overflow-x-hidden">
                <ConferenceWireframe
                  presetId={selectedPresetId}
                  templateId={selectedThemeId}
                  slotData={fineTunedData}
                  activeBlocks={enabledBlocks}
                  isInteractivePreview={true}
                  selectedBlockId={selectedInspectorBlock}
                  onBlockSelect={(blockId) => setSelectedInspectorBlock(blockId)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            AI WIREFRAME FINE-TUNER STUDIO (PLAYGROUND)
           ========================================================= */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
              <Wand2Icon className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>AI Fine-Tuning Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Fine-Tune the Wireframe with Faith AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select an anointed faith preset or type a custom conference mandate. Watch our multi-model AI engine hydrate
              each wireframe slot with zero structural distortion.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Control Panel (Col 1-5) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  1. Select Faith Prompt Preset
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => {
                      setFineTunerSample("revival");
                      setFineTunedData(SAMPLE_AI_WIREFRAME_PACKS.revival);
                      setSelectedPresetId("cinematic_fire");
                      setSelectedThemeId("dark_revival");
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                      fineTunerSample === "revival"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    🔥 Revival & Fire
                  </button>
                  <button
                    onClick={() => {
                      setFineTunerSample("youth");
                      setFineTunedData(SAMPLE_AI_WIREFRAME_PACKS.youth);
                      setSelectedPresetId("neon_surge");
                      setSelectedThemeId("youth_energy");
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                      fineTunerSample === "youth"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    ⚡ NextGen Youth
                  </button>
                  <button
                    onClick={() => {
                      setFineTunerSample("leadership");
                      setFineTunedData(SAMPLE_AI_WIREFRAME_PACKS.leadership);
                      setSelectedPresetId("executive_summit");
                      setSelectedThemeId("executive_summit");
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                      fineTunerSample === "leadership"
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    👑 Leadership
                  </button>
                  <button
                    onClick={() => {
                      setFineTunerSample("cathedral");
                      setFineTunedData(SAMPLE_AI_WIREFRAME_PACKS.cathedral);
                      setSelectedPresetId("cathedral_editorial");
                      setSelectedThemeId("cathedral_minimal");
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                      fineTunerSample === "cathedral"
                        ? "bg-stone-500/20 border-stone-400 text-stone-200"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    🏛️ Liturgical
                  </button>
                  <button
                    onClick={() => {
                      setFineTunerSample("grace");
                      setFineTunedData(SAMPLE_AI_WIREFRAME_PACKS.grace);
                      setSelectedPresetId("grace_sage");
                      setSelectedThemeId("grace_sage");
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                      fineTunerSample === "grace"
                        ? "bg-teal-500/20 border-teal-500 text-teal-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    🌿 Fellowship
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  2. Custom Title / Mandate Prompt
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Supernatural Acceleration Summit 2026..."
                    className="flex-1 h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button
                    onClick={runAiFineTuning}
                    disabled={isFineTuning}
                    className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold h-10 px-4 shrink-0"
                  >
                    {isFineTuning ? "Hydrating..." : "Fine-Tune"}
                  </Button>
                </div>
              </div>

              {/* Block Visibility Customization */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  3. Customize Wireframe Blocks (Fixed vs Flexible)
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {Object.values(WIREFRAME_BLOCK_CATALOG).map((block) => {
                    const isEnabled = enabledBlocks.includes(block.id);
                    return (
                      <div
                        key={block.id}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs border transition ${
                          isEnabled
                            ? "bg-slate-800/60 border-slate-700"
                            : "bg-slate-950/40 border-slate-800/60 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              block.isFixed ? "bg-amber-400" : isEnabled ? "bg-indigo-400" : "bg-slate-600"
                            }`}
                          />
                          <span className="font-semibold text-white">{block.title}</span>
                          {block.isFixed && (
                            <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-sm">
                              Fixed Core
                            </span>
                          )}
                        </div>

                        {!block.isFixed ? (
                          <button
                            onClick={() => toggleBlock(block.id)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
                              isEnabled
                                ? "bg-indigo-600/30 text-indigo-300 hover:bg-rose-600/20 hover:text-rose-300"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                          >
                            {isEnabled ? "Enabled" : "Disabled"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Immutable</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <Button
                  onClick={handleCopyWireframeConfig}
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-700 w-full"
                >
                  {copiedConfig ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Copied JSON Config!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3.5 h-3.5 mr-1.5" /> Copy Wireframe Config
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold w-full"
                >
                  <Link href={`/dashboard/conferences/new?preset=${selectedPresetId}&template=${selectedThemeId}`}>
                    Use in Builder <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Wireframe Slot Inspector (Col 6-12) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontalIcon className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">
                    Slotted Data Payload Inspector
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">JSON Schema v2.1</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                    hero.headline_hook
                  </span>
                  <p className="text-slate-200 font-semibold truncate">{fineTunedData.heroContextHeadline}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                    hero.scripture_anchor
                  </span>
                  <p className="text-slate-200 font-semibold truncate">{fineTunedData.scriptureAnchor}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                    speaker.calling_badges
                  </span>
                  <div className="flex gap-1 overflow-hidden">
                    {fineTunedData.speaker.callingBadges.map((b, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-sm bg-slate-800 text-[10px] text-slate-300">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                    whatsapp.prefilled_rsvp
                  </span>
                  <p className="text-slate-200 font-semibold truncate">{fineTunedData.whatsapp.prefilledMessage}</p>
                </div>
              </div>

              <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 max-h-64 overflow-y-auto">
                <pre>{JSON.stringify(fineTunedData, null, 2)}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TEMPLATES & WIREFRAME PRESET GALLERY
           ========================================================= */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <LayoutGridIcon className="w-6 h-6 text-indigo-400" />
                Wireframe Presets & Templates Catalog
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore the 6 production wireframe topologies engineered specifically for church convocations, youth movements, and leadership summits.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {[
                { id: "all", label: "All (6)" },
                { id: "revival", label: "🔥 Revival" },
                { id: "tech", label: "⚡ Bento Tech" },
                { id: "youth", label: "🎯 Youth" },
                { id: "executive", label: "👑 Executive" },
                { id: "minimal", label: "🏛️ Cathedral" },
                { id: "community", label: "🌿 Community" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePresetCategory(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activePresetCategory === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const theme = THEME_CONFIGS[preset.recommendedTheme];

              return (
                <div
                  key={preset.id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                    isSelected
                      ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-500"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        {preset.vibe}
                      </span>
                      <div className="flex gap-1.5">
                        {theme.previewColors.map((color, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/40"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{preset.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{preset.tagline}</p>

                    <div className="space-y-2 mb-6">
                      {preset.highlights.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <Button
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setSelectedThemeId(preset.recommendedTheme);
                        window.scrollTo({ top: 450, behavior: "smooth" });
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs border-slate-700 flex-1 hover:bg-slate-800"
                    >
                      <EyeIcon className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold flex-1"
                    >
                      <Link href={`/dashboard/conferences/new?preset=${preset.id}&template=${preset.recommendedTheme}`}>
                        Use Layout <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            DESIGN LIBRARIES: CURATED UI COMPONENTS SPEC
           ========================================================= */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
                <LayersIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Design Library Specifications</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Resources Library Pulled from Design Libraries
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Battle-tested UI blocks, layout blueprints, and token guidelines extracted from world-class design systems (Relume, Untitled UI, Tailwind UI, Cruip, Aceternity).
              </p>
            </div>

            {/* Resources Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {[
                { id: "all", label: "All Specs" },
                { id: "media", label: "Media & Broadcast" },
                { id: "hero", label: "Hero Stage" },
                { id: "schedule", label: "Timeline" },
                { id: "conversion", label: "Lead Capture" },
                { id: "fellowship", label: "Community" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveResourceCategory(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeResourceCategory === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredResources.map((block) => (
              <div
                key={block.id}
                className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                      {block.categoryLabel}
                    </span>
                    <span className="text-[9px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {block.sourceLibrary.split("+")[0].trim()}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1">{block.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{block.description}</p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1">
                    {block.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-slate-800 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <code className="text-[9px] font-mono text-slate-500 truncate flex-1">{block.tokens}</code>
                    <button
                      onClick={() => handleCopyTokens(block.tokens, block.id)}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono shrink-0 transition"
                    >
                      {copiedTokens === block.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            FAITH & MINISTRY TYPOGRAPHY SPECIFICATIONS
           ========================================================= */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-3">
              <TypeIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Spiritual Typography System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Curated Faith Typography Pairings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Pair distinctive display fonts with high-legibility body typefaces to communicate spiritual mandate with authority and reverence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FAITH_TYPOGRAPHY_PAIRINGS.map((pairing, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-base">{pairing.name}</h4>
                    <p className="text-xs text-indigo-400">{pairing.vibe}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                    {pairing.recommendedFor}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <p className={`text-base sm:text-lg text-slate-200 italic leading-relaxed ${pairing.cssClass}`}>
                    {pairing.sampleText}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Display Font</span>
                    <strong className="text-slate-300">{pairing.headingFont}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Body Font</span>
                    <strong className="text-slate-300">{pairing.bodyFont}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            FAITH & MINISTRY COLOR PALETTES
           ========================================================= */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
              <PaletteIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Ministry Color Palettes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Curated Spiritual Color Palettes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any hex code to copy it directly to your clipboard for branding guidelines or Tailwind configurations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAITH_COLOR_PALETTES.map((palette, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition"
              >
                <div>
                  <h4 className="font-bold text-white text-base">{palette.name}</h4>
                  <p className="text-xs text-slate-400">{palette.vibe}</p>
                </div>

                <div className="space-y-2">
                  {palette.colors.map((color, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => handleCopyHex(color.hex)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500 cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-lg border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <span className="text-xs font-semibold text-slate-200 block">
                            {color.label}
                          </span>
                          <span className="text-[10px] text-slate-500">{color.role}</span>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-indigo-400 group-hover:underline">
                        {copiedHex === color.hex ? "Copied!" : color.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            BOTTOM CTA / NEXT STEPS
           ========================================================= */}
        <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center border-t border-slate-800/80">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Ready to Publish?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Launch Your Conference in Under 60 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose any fixed-but-flexible wireframe, let AI draft your sermon hooks and time-blocked agenda, and publish with a high-converting shareable link.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs h-11 px-8 shadow-xl">
                  <Link href="/dashboard/conferences/new">
                    Create New Conference Now <ArrowRightIcon className="w-4 h-4 ml-2 text-indigo-600" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          GLOBAL FOOTER (RULE: © Bent Planet Inc. {YEAR})
         ========================================================= */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
              BP
            </div>
            <span>
              &copy; <Link href="/" className="hover:text-indigo-400 font-semibold transition">Bent Planet Inc. {currentYear}</Link>. Empowering Kingdom Assemblies Globally.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/templates" className="hover:text-white transition">Templates Library</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/docs" className="hover:text-white transition">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
