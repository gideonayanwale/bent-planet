export type EmailThemeStyle =
  | "modern_indigo"
  | "warm_amber"
  | "revival_purple"
  | "live_crimson"
  | "emerald_growth"
  | "cathedral_slate";

export interface EmailThemePreset {
  id: EmailThemeStyle;
  name: string;
  primaryColor: string;
  headerBg: string;
  headerText: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonText: string;
  accentBorder: string;
  highlightBoxBg: string;
  highlightBoxText: string;
}

export const EMAIL_THEME_PRESETS: Record<EmailThemeStyle, EmailThemePreset> = {
  modern_indigo: {
    id: "modern_indigo",
    name: "Modern Indigo",
    primaryColor: "#4f46e5",
    headerBg: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #4f46e5 100%)",
    headerText: "#ffffff",
    badgeBg: "#e0e7ff",
    badgeText: "#3730a3",
    buttonBg: "#4f46e5",
    buttonText: "#ffffff",
    accentBorder: "#c7d2fe",
    highlightBoxBg: "#eef2ff",
    highlightBoxText: "#312e81",
  },
  warm_amber: {
    id: "warm_amber",
    name: "Warm Gold & Amber",
    primaryColor: "#d97706",
    headerBg: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    headerText: "#ffffff",
    badgeBg: "#fef3c7",
    badgeText: "#92400e",
    buttonBg: "#d97706",
    buttonText: "#ffffff",
    accentBorder: "#fde68a",
    highlightBoxBg: "#fffbeb",
    highlightBoxText: "#78350f",
  },
  revival_purple: {
    id: "revival_purple",
    name: "Revival & Fire",
    primaryColor: "#7c3aed",
    headerBg: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)",
    headerText: "#ffffff",
    badgeBg: "#f3e8ff",
    badgeText: "#581c87",
    buttonBg: "#7c3aed",
    buttonText: "#ffffff",
    accentBorder: "#e9d5ff",
    highlightBoxBg: "#faf5ff",
    highlightBoxText: "#4c1d95",
  },
  live_crimson: {
    id: "live_crimson",
    name: "Live Broadcast Crimson",
    primaryColor: "#e11d48",
    headerBg: "linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)",
    headerText: "#ffffff",
    badgeBg: "#ffe4e6",
    badgeText: "#9f1239",
    buttonBg: "#e11d48",
    buttonText: "#ffffff",
    accentBorder: "#fecdd3",
    highlightBoxBg: "#fff1f2",
    highlightBoxText: "#881337",
  },
  emerald_growth: {
    id: "emerald_growth",
    name: "Emerald Grace",
    primaryColor: "#059669",
    headerBg: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
    headerText: "#ffffff",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    buttonBg: "#059669",
    buttonText: "#ffffff",
    accentBorder: "#a7f3d0",
    highlightBoxBg: "#ecfdf5",
    highlightBoxText: "#064e3b",
  },
  cathedral_slate: {
    id: "cathedral_slate",
    name: "Classic Cathedral Slate",
    primaryColor: "#334155",
    headerBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    headerText: "#ffffff",
    badgeBg: "#f1f5f9",
    badgeText: "#1e293b",
    buttonBg: "#0f172a",
    buttonText: "#ffffff",
    accentBorder: "#cbd5e1",
    highlightBoxBg: "#f8fafc",
    highlightBoxText: "#0f172a",
  },
};

export interface EmailTemplateDefinition {
  id: string;
  name: string;
  category: "Events" | "Live Alerts" | "Reminders" | "Follow-up" | "Weekly" | "Special";
  themeStyle: EmailThemeStyle;
  badgeLabel: string;
  description: string;
  subject: (church: string) => string;
  preheader: string;
  greetingType: "name" | "saints" | "fellowship" | "custom";
  scriptureQuote?: {
    verse: string;
    reference: string;
  };
  body: (church: string) => string;
  ctaText: string;
  ctaUrlPlaceholder: string;
  includeSecondaryLink?: boolean;
  secondaryLinkText?: string;
}

export const RICH_EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  {
    id: "conference-announcement",
    name: "Major Conference Announcement",
    category: "Events",
    themeStyle: "modern_indigo",
    badgeLabel: "CONFERENCE INVITATION",
    description: "High-impact invitation with speaker highlight, conference dates, and reserve spot call to action.",
    subject: (church) => `📢 Announcing Our Upcoming Conference at ${church}!`,
    preheader: "God has prepared an extraordinary time of breakthrough and empowerment for you.",
    greetingType: "name",
    scriptureQuote: {
      verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
      reference: "Jeremiah 29:11",
    },
    body: (church) =>
      `We are overjoyed to invite you to our upcoming gathering at ${church}!\n\nExpect an atmospheric dimension of vibrant worship, revelatory teachings, and powerful ministrations designed to elevate your walk with God.\n\nSave your spot online today and invite your family, colleagues, and loved ones to join us online!`,
    ctaText: "Reserve Your Free Spot Now",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
    includeSecondaryLink: true,
    secondaryLinkText: "Join WhatsApp Community for Updates",
  },
  {
    id: "live-now-broadcast",
    name: "Livestream Broadcast Is LIVE Now",
    category: "Live Alerts",
    themeStyle: "live_crimson",
    badgeLabel: "🔴 BROADCASTING LIVE",
    description: "Urgent broadcast alert designed for maximum click-through when your service or stream kicks off.",
    subject: (church) => `🎙️ We are LIVE Right Now — Join ${church}!`,
    preheader: "Worship is underway and the Word is about to be ministered. Don't miss out!",
    greetingType: "saints",
    body: (church) =>
      `The broadcast from ${church} is currently streaming live!\n\nWorship has started and the spiritual atmosphere is charged. Jump in right now to participate in prayer, worship, and the ministration of the Word.`,
    ctaText: "Watch Live Stream Immediately",
    ctaUrlPlaceholder: "https://youtube.com/live/...",
    includeSecondaryLink: true,
    secondaryLinkText: "Click to Chat with Coordinator",
  },
  {
    id: "24h-countdown-reminder",
    name: "24-Hour Countdown Reminder",
    category: "Reminders",
    themeStyle: "warm_amber",
    badgeLabel: "⏳ 24 HOURS TO GO",
    description: "Pre-event countdown reminder with study notes link and broadcast schedule reminder.",
    subject: (church) => `🔥 Tomorrow! Our Live Conference Begins — ${church}`,
    preheader: "Tomorrow is the day! Prepare your heart and test your stream setup.",
    greetingType: "name",
    scriptureQuote: {
      verse: "Draw near to God, and he will draw near to you.",
      reference: "James 4:8",
    },
    body: (church) =>
      `This is your 24-hour reminder that our special conference starts tomorrow!\n\nWe encourage you to prepare your heart and tune in 10 minutes early so you don't miss the opening prayer and consecration.\n\nClick below to bookmark the broadcast page and download your conference study guide.`,
    ctaText: "Access Livestream & Guide",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
  {
    id: "post-event-replay-notes",
    name: "Post-Event Replay & Study Guide",
    category: "Follow-up",
    themeStyle: "emerald_growth",
    badgeLabel: "📖 REPLAY & STUDY NOTES",
    description: "Follow-up email with on-demand video replay links and downloadable sermon notes and slides.",
    subject: (church) => `🙏 Glory to God! Access the Replay & Study Notes — ${church}`,
    preheader: "Missed a session or want to re-watch? Full video replay and sermon notes are now live.",
    greetingType: "name",
    body: (church) =>
      `What a transformative time we experienced in God's presence at ${church}!\n\nIf you missed any of the sessions or wish to re-listen to the revelations shared, the full on-demand video replay and companion study guide are now accessible.\n\nBe blessed as you meditate on these truths!`,
    ctaText: "Watch Replay & Download Notes",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
  {
    id: "weekly-sunday-communion",
    name: "Weekly Fellowship & Sunday Service",
    category: "Weekly",
    themeStyle: "revival_purple",
    badgeLabel: "✨ SUNDAY FELLOWSHIP",
    description: "Nurturing weekly communion and invitation for Sunday service and midweek Bible study.",
    subject: (church) => `✨ Join Us This Sunday for Worship & Word at ${church}`,
    preheader: "Come expecting a fresh touch from God as we fellowship together.",
    greetingType: "fellowship",
    scriptureQuote: {
      verse: "Let us not neglect meeting together, as some have made a habit, but let us encourage one another.",
      reference: "Hebrews 10:25",
    },
    body: (church) =>
      `We warmly invite you and your loved ones to join us for our weekly worship gathering at ${church}.\n\nGod is doing remarkable things in our midst, and there is a seat and a spiritual blessing reserved for you.\n\nConnect online or in-person as we lift our voices and receive timely direction.`,
    ctaText: "Join Sunday Service Online",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
  {
    id: "ministry-partner-update",
    name: "Ministry Partner & Vision Update",
    category: "Special",
    themeStyle: "cathedral_slate",
    badgeLabel: "🤝 VISION & PARTNERSHIP",
    description: "Impact report, thanksgiving for members, and vision update for ongoing kingdom outreach.",
    subject: (church) => `🤝 Ministry Progress & Kingdom Impact Report — ${church}`,
    preheader: "See what God has accomplished through your prayers and partnership.",
    greetingType: "saints",
    body: (church) =>
      `Grace and peace be multiplied unto you in the precious name of Jesus!\n\nWe are taking a moment to express our deepest gratitude for your continued prayers and fellowship with ${church}.\n\nThrough God's grace, our online outreach and ministry gatherings are touching lives across multiple cities and nations. Here is a brief report of what the Lord has done and where we are heading next.`,
    ctaText: "View Full Ministry Vision",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
];
