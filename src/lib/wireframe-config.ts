import { TemplateId, THEME_CONFIGS } from "./theme-config";

export type WireframePresetId =
  | "bento_apex"
  | "cinematic_fire"
  | "cathedral_editorial"
  | "neon_surge"
  | "executive_summit"
  | "grace_sage";

export type WireframeBlockType =
  | "brand_nav"
  | "hero_stage"
  | "stream_dock"
  | "about_mandate"
  | "ministers_roster"
  | "track_agenda"
  | "study_resource"
  | "prayer_wall"
  | "rsvp_sticky"
  | "whatsapp_community"
  | "church_footer";

export interface WireframeBlockDef {
  id: WireframeBlockType;
  title: string;
  description: string;
  isFixed: boolean; // Fixed core conversion backbone vs flexible custom
  defaultEnabled: boolean;
  category: "core" | "media" | "ministry" | "conversion" | "community";
}

export const WIREFRAME_BLOCK_CATALOG: Record<WireframeBlockType, WireframeBlockDef> = {
  brand_nav: {
    id: "brand_nav",
    title: "Sticky Brand Header",
    description: "Church identity, logo avatar, and event index navigation",
    isFixed: true,
    defaultEnabled: true,
    category: "core",
  },
  hero_stage: {
    id: "hero_stage",
    title: "Hero & Spiritual Proclamation",
    description: "Atmospheric backdrop, event mandate badge, dynamic title, and host credit",
    isFixed: true,
    defaultEnabled: true,
    category: "core",
  },
  stream_dock: {
    id: "stream_dock",
    title: "Livestream & Countdown Dock",
    description: "Embedded video player, live countdown timer, and post-event replay vault",
    isFixed: false,
    defaultEnabled: true,
    category: "media",
  },
  about_mandate: {
    id: "about_mandate",
    title: "Spiritual Mandate & Scripture",
    description: "Context, revelation notes, and Biblical foundation for the gathering",
    isFixed: true,
    defaultEnabled: true,
    category: "core",
  },
  ministers_roster: {
    id: "ministers_roster",
    title: "Featured Ministers & Speakers",
    description: "Minister bios, calling mandates, and ministerial credential badges",
    isFixed: false,
    defaultEnabled: true,
    category: "ministry",
  },
  track_agenda: {
    id: "track_agenda",
    title: "Time-Blocked Track Agenda",
    description: "Schedule timeline with session categories (Worship, Keynote, Altar Call)",
    isFixed: false,
    defaultEnabled: true,
    category: "ministry",
  },
  study_resource: {
    id: "study_resource",
    title: "Free Devotional & Study Guide",
    description: "High-value lead magnet that delivers instant digital companion notes upon RSVP",
    isFixed: false,
    defaultEnabled: true,
    category: "conversion",
  },
  prayer_wall: {
    id: "prayer_wall",
    title: "Live Prayer & Intercession Wall",
    description: "Real-time attendee prayer requests with pastoral intercession counter",
    isFixed: false,
    defaultEnabled: false,
    category: "community",
  },
  rsvp_sticky: {
    id: "rsvp_sticky",
    title: "Sticky RSVP & Capacity Meter",
    description: "High-converting 1-click registration card with seat limit urgency bar",
    isFixed: true,
    defaultEnabled: true,
    category: "conversion",
  },
  whatsapp_community: {
    id: "whatsapp_community",
    title: "WhatsApp Community & Chat RSVP",
    description: "Direct community group link and 1-click coordinator chat trigger",
    isFixed: true,
    defaultEnabled: true,
    category: "community",
  },
  church_footer: {
    id: "church_footer",
    title: "Church Details & Bent Planet Badge",
    description: "Official footer with copyright, church socials, and platform attribution",
    isFixed: true,
    defaultEnabled: true,
    category: "core",
  },
};

export interface WireframePreset {
  id: WireframePresetId;
  name: string;
  tagline: string;
  vibe: string;
  recommendedTheme: TemplateId;
  layoutStyle: "bento" | "cinematic" | "editorial" | "kinetic" | "executive" | "organic";
  gridStructure: string;
  highlights: string[];
  activeBlocks: WireframeBlockType[];
  accentColorHex: string;
}

export const WIREFRAME_PRESETS: Record<WireframePresetId, WireframePreset> = {
  bento_apex: {
    id: "bento_apex",
    name: "Bento Apex Architecture",
    tagline: "High-density modular bento cards with glassmorphic depth & kinetic widgets",
    vibe: "Tech-Forward & Modern Kingdom",
    recommendedTheme: "bento_apex",
    layoutStyle: "bento",
    gridStructure: "12-column dynamic bento grid with asymmetrical spans",
    highlights: [
      "Modular bento cards with responsive flex spans",
      "Floating live stream dock with picture-in-picture countdown",
      "High visual density for packed schedules & multi-minister summits",
      "Subtle violet & indigo aura gradients",
    ],
    activeBlocks: [
      "brand_nav",
      "hero_stage",
      "stream_dock",
      "ministers_roster",
      "about_mandate",
      "track_agenda",
      "study_resource",
      "rsvp_sticky",
      "whatsapp_community",
      "church_footer",
    ],
    accentColorHex: "#6366f1",
  },

  cinematic_fire: {
    id: "cinematic_fire",
    name: "Cinematic Fire Revival",
    tagline: "Atmospheric obsidian & fiery amber halo for Holy Ghost encounters",
    vibe: "Prophetic, Fire & Miracles",
    recommendedTheme: "dark_revival",
    layoutStyle: "cinematic",
    gridStructure: "Full-width immersive hero stage with centered focal column",
    highlights: [
      "Cinematic glowing embers & deep contrast typography",
      "Wide-screen livestream viewport as the visual anchor",
      "Apostolic ministerial highlight with prophetic calling tags",
      "Atmospheric dark cards with 24px corner radiuses",
    ],
    activeBlocks: [
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
    ],
    accentColorHex: "#f59e0b",
  },

  cathedral_editorial: {
    id: "cathedral_editorial",
    name: "Cathedral Sacred Editorial",
    tagline: "Quiet liturgical reverence, classical serif elegance, and serene white-space",
    vibe: "Liturgical, Theological & Worship",
    recommendedTheme: "cathedral_minimal",
    layoutStyle: "editorial",
    gridStructure: "Clean asymmetrical 2-column with generous editorial margins",
    highlights: [
      "Refined classical serif headings with understated stone borders",
      "Scripture anchor rendered as an illuminated quotation block",
      "Timeline agenda formatted with serene vertical rule markers",
      "Uncluttered, peaceful reading experience for in-depth teaching",
    ],
    activeBlocks: [
      "brand_nav",
      "hero_stage",
      "about_mandate",
      "ministers_roster",
      "track_agenda",
      "study_resource",
      "stream_dock",
      "rsvp_sticky",
      "whatsapp_community",
      "church_footer",
    ],
    accentColorHex: "#78716c",
  },

  neon_surge: {
    id: "neon_surge",
    name: "Neon Surge Kinetic",
    tagline: "High-voltage kinetic typography & cyber-lime contrast for NextGen youth",
    vibe: "Youth Explosion & Campus Movement",
    recommendedTheme: "youth_energy",
    layoutStyle: "kinetic",
    gridStructure: "Bold punchy staggered cards with diagonal badge trims",
    highlights: [
      "High-contrast cyber-lime badges with energetic micro-animations",
      "Fast-action WhatsApp Community CTA placed front-and-center",
      "Short, punchy agenda tracks tailored for high-energy sessions",
      "Audience capacity bar with urgent youth camp reservation count",
    ],
    activeBlocks: [
      "brand_nav",
      "hero_stage",
      "stream_dock",
      "ministers_roster",
      "about_mandate",
      "track_agenda",
      "rsvp_sticky",
      "whatsapp_community",
      "church_footer",
    ],
    accentColorHex: "#4ade80",
  },

  executive_summit: {
    id: "executive_summit",
    name: "Executive Kingdom Summit",
    tagline: "Prestigious royal navy & champagne gold architecture for leadership assemblies",
    vibe: "Apostolic Leadership & Marketplace",
    recommendedTheme: "executive_summit",
    layoutStyle: "executive",
    gridStructure: "Structured institutional layout with executive speaker dossier",
    highlights: [
      "Champagne gold badges with fine hairline borders",
      "Executive dossier styling for apostolic & keynote ministers",
      "Multi-track corporate breakout structure (Governance, Finance, Ministry)",
      "High-level networking WhatsApp VIP lounge connection",
    ],
    activeBlocks: [
      "brand_nav",
      "hero_stage",
      "about_mandate",
      "ministers_roster",
      "track_agenda",
      "study_resource",
      "stream_dock",
      "rsvp_sticky",
      "whatsapp_community",
      "church_footer",
    ],
    accentColorHex: "#d97706",
  },

  grace_sage: {
    id: "grace_sage",
    name: "Grace & Fellowship Organic",
    tagline: "Warm ivory, calming sage emerald, and welcoming community spaces",
    vibe: "Family, Marriage & Healing",
    recommendedTheme: "grace_sage",
    layoutStyle: "organic",
    gridStructure: "Soft rounded cards with gentle shadows and warm borders",
    highlights: [
      "Sage emerald badges with calming organic visual rhythm",
      "Community prayer and testimony wall prioritized",
      "Study booklet companion card prominently framed for discipleship",
      "Warm, hospitable invitation tone with friendly WhatsApp coordinator link",
    ],
    activeBlocks: [
      "brand_nav",
      "hero_stage",
      "about_mandate",
      "ministers_roster",
      "study_resource",
      "prayer_wall",
      "track_agenda",
      "stream_dock",
      "rsvp_sticky",
      "whatsapp_community",
      "church_footer",
    ],
    accentColorHex: "#166534",
  },
};

export const ALL_WIREFRAME_PRESETS = Object.values(WIREFRAME_PRESETS);

export function getWireframePreset(id: string | null | undefined): WireframePreset {
  if (id && id in WIREFRAME_PRESETS) {
    return WIREFRAME_PRESETS[id as WireframePresetId];
  }
  return WIREFRAME_PRESETS.bento_apex;
}

// ----------------------------------------------------
// Structured AI Wireframe Slot Data Definition
// ----------------------------------------------------
export interface WireframeSlotData {
  conferenceTitle: string;
  eventTypeBadge: string;
  themeTagline: string;
  churchName: string;
  hostName: string;
  heroContextHeadline: string;
  scriptureAnchor: string;
  fullDescription: string;
  streamUrl?: string;
  conferenceDate: string;
  conferenceTime: string;
  timezone: string;
  rsvpLimit?: number;
  confirmedRsvps?: number;
  speaker: {
    name: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    callingBadges: string[];
  };
  agenda: {
    time: string;
    title: string;
    trackCategory: "Worship" | "Keynote" | "Impartation" | "Workshop" | "Altar Call";
    description: string;
  }[];
  freeResource?: {
    title: string;
    subtitle: string;
    format: "PDF Booklet" | "Audio MP3" | "Sermon Notes";
    downloadUrl?: string;
  };
  whatsapp: {
    groupUrl?: string;
    coordinatorPhone?: string;
    prefilledMessage: string;
  };
  prayerRequests?: {
    id: string;
    name: string;
    location: string;
    requestText: string;
    prayedCount: number;
  }[];
}

// ----------------------------------------------------
// Pre-Seeded AI Fine-Tuned Samples for Instant Demo
// ----------------------------------------------------
export const SAMPLE_AI_WIREFRAME_PACKS: Record<string, WireframeSlotData> = {
  revival: {
    conferenceTitle: "Nights of Divine Fire & Glory 2025",
    eventTypeBadge: "HOLY GHOST REVIVAL",
    themeTagline: "The Outpouring of Power & Signs",
    churchName: "Grace City Apostolic Center",
    hostName: "Bishop Emmanuel Adeleke",
    heroContextHeadline: "Prepare for an Unprecedented Infilling of the Holy Spirit",
    scriptureAnchor: "“And it shall come to pass afterward, that I will pour out my spirit upon all flesh...” — Joel 2:28",
    fullDescription:
      "Join believers from across the nations for three consecutive nights of deep consecration, apostolic teaching, and raw miraculous power. This is not just another conference; it is a sacred convocation where yokes will be dismantled, sicknesses will bow to the Name of Jesus, and ministers will receive fresh mantles for end-time harvest.\n\nWhether you join us in the physical auditorium or stream with your family online, prepare your heart for a life-altering encounter.",
    streamUrl: "https://www.youtube.com/watch?v=live_revival_stream",
    conferenceDate: "October 16–18, 2025",
    conferenceTime: "06:00 PM",
    timezone: "GMT+1 (West Africa)",
    rsvpLimit: 1200,
    confirmedRsvps: 840,
    speaker: {
      name: "Apostle David K. Okon",
      title: "General Overseer & Healing Evangelist",
      bio: "Apostle David has traversed over 40 nations with a proven prophetic mantle accompanied by undeniable signs, wonders, and supernatural deliverances. He carries a burning passion to see this generation revived and consecrated to Christ.",
      callingBadges: ["Apostolic", "Healing Mantle", "Prophetic Revival"],
    },
    agenda: [
      {
        time: "06:00 PM",
        title: "Consecration & Atmospheric Worship",
        trackCategory: "Worship",
        description: "Intense unbroken praise and prayer ushering in the tangible weight of God's presence.",
      },
      {
        time: "07:15 PM",
        title: "Apostolic Word: Breaking Generational Limits",
        trackCategory: "Keynote",
        description: "Deep exposition into kingdom dominion, faith covenants, and dismantling demonic hindrances.",
      },
      {
        time: "08:45 PM",
        title: "Prophetic Ministration & Altar Call",
        trackCategory: "Altar Call",
        description: "Laying on of hands, targeted deliverance, personal prophecy, and salvation dedication.",
      },
    ],
    freeResource: {
      title: "The Fire Covenant: 21-Day Fasting & Prayer Manual",
      subtitle: "Instant PDF companion booklet with daily scripture declarations and prayer points",
      format: "PDF Booklet",
      downloadUrl: "#",
    },
    whatsapp: {
      groupUrl: "https://chat.whatsapp.com/sample_revival_group",
      coordinatorPhone: "+2348012345678",
      prefilledMessage: "Hi Pastor Emmanuel, I am registering for Nights of Divine Fire & Glory 2025!",
    },
    prayerRequests: [
      {
        id: "p1",
        name: "Sister Deborah O.",
        location: "Lagos, Nigeria",
        requestText: "Believing God for total healing in my mother's lungs and divine marital open doors.",
        prayedCount: 38,
      },
      {
        id: "p2",
        name: "Brother Michael T.",
        location: "London, UK",
        requestText: "Praying for ministerial direction and supernatural breakthrough in our youth campus fellowship.",
        prayedCount: 52,
      },
    ],
  },

  youth: {
    conferenceTitle: "IGNITE NextGen Youth Movement",
    eventTypeBadge: "YOUTH & CAMPUS FESTIVAL",
    themeTagline: "Bold, Unashamed, Commissioned",
    churchName: "Vanguard Christian Youth Fellowship",
    hostName: "Pastor Joshua Stern & The Vanguard Team",
    heroContextHeadline: "A Generation Rising in Purpose, Tech Innovation & Spiritual Boldness",
    scriptureAnchor: "“Don’t let anyone look down on you because you are young, but set an example for the believers...” — 1 Tim 4:12",
    fullDescription:
      "IGNITE 2025 brings together high-schoolers, varsity students, young professionals, and creatives who refuse to conform to the culture of compromise. Expect electrifying modern worship, real talk on identity and mental health, hands-on tech/faith breakout workshops, and deep personal encounters at the altar.",
    streamUrl: "https://www.youtube.com/watch?v=live_youth_stream",
    conferenceDate: "November 22, 2025",
    conferenceTime: "10:00 AM",
    timezone: "EST (New York)",
    rsvpLimit: 600,
    confirmedRsvps: 489,
    speaker: {
      name: "Pastor Maya & Chris Sterling",
      title: "NextGen Youth Pastors & Creatives",
      bio: "Chris and Maya lead one of the fastest-growing multi-campus youth ministries in North America, passionately mentoring Gen-Z leaders in gospel identity, digital media, and social impact.",
      callingBadges: ["Youth Leadership", "Digital Evangelism", "Creative Arts"],
    },
    agenda: [
      {
        time: "10:00 AM",
        title: "Live Concert & Youth Collective Worship",
        trackCategory: "Worship",
        description: "High-energy praise led by the IGNITE youth band with live acoustic sets.",
      },
      {
        time: "11:30 AM",
        title: "Breakout Labs: Faith in the AI Era & Mental Resilience",
        trackCategory: "Workshop",
        description: "Practical roundtable sessions on ethical tech creation, university pressures, and purpose.",
      },
      {
        time: "02:00 PM",
        title: "The Send-Off: Impartation & Campus Commissioning",
        trackCategory: "Impartation",
        description: "Anointed commissioning prayer equipping youth to return as gospel lights on campus.",
      },
    ],
    freeResource: {
      title: "Gen-Z Kingdom Survival Guide & Campus Devotional",
      subtitle: "30-Day actionable study guide with audio podcasts and journaling prompts",
      format: "PDF Booklet",
      downloadUrl: "#",
    },
    whatsapp: {
      groupUrl: "https://chat.whatsapp.com/sample_youth_group",
      coordinatorPhone: "+12125550199",
      prefilledMessage: "Yo Pastor Chris! Count me in for IGNITE NextGen 2025!",
    },
  },

  leadership: {
    conferenceTitle: "Global Apostolic Leadership Summit 2025",
    eventTypeBadge: "EXECUTIVE SUMMIT",
    themeTagline: "Governance, Multi-Generational Legacy & Kingdom Economics",
    churchName: "Metropolitan Faith Cathedral International",
    hostName: "Archbishop Dr. Samuel Sterling",
    heroContextHeadline: "Equipping Apostles, Senior Pastors, and Marketplace Leaders to Govern with Integrity",
    scriptureAnchor: "“And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men...” — 2 Tim 2:2",
    fullDescription:
      "A high-level assembly convening over 500 senior ministers, ministry founders, and executive trustees from 25 countries. The Global Leadership Summit delivers actionable blueprints on ministry structure, succession planning, ethical financial stewardship, and strategic cultural engagement in an increasingly volatile global landscape.",
    streamUrl: "https://www.youtube.com/watch?v=live_leadership_summit",
    conferenceDate: "December 4–6, 2025",
    conferenceTime: "09:00 AM",
    timezone: "GMT (London, UK)",
    rsvpLimit: 400,
    confirmedRsvps: 345,
    speaker: {
      name: "Dr. Elizabeth Vance",
      title: "Dean of Global Theological Governance",
      bio: "Dr. Vance is a respected consultant to international ecclesiastical councils and author of 7 books on institutional integrity, multi-site church expansion, and pastoral succession.",
      callingBadges: ["Kingdom Governance", "Executive Strategy", "Succession Planning"],
    },
    agenda: [
      {
        time: "09:00 AM",
        title: "Executive Plenary: Institutional Resilience in Shifting Cultures",
        trackCategory: "Keynote",
        description: "Analysis of global ecclesiastical data, legal compliance, and theological fidelity.",
      },
      {
        time: "11:30 AM",
        title: "Apostolic Council & Roundtable Workshops",
        trackCategory: "Workshop",
        description: "Closed-door interactive breakout on crisis management and capital stewardship.",
      },
      {
        time: "03:00 PM",
        title: "Succession & Mantle Transfer Ceremony",
        trackCategory: "Impartation",
        description: "Solemn prayer of dedication and generational blessing over rising senior pastors.",
      },
    ],
    freeResource: {
      title: "Executive Church Governance & Financial Safeguards Dossier",
      subtitle: "Official 48-page executive whitepaper with legal frameworks and governance templates",
      format: "PDF Booklet",
      downloadUrl: "#",
    },
    whatsapp: {
      groupUrl: "https://chat.whatsapp.com/sample_leadership_group",
      coordinatorPhone: "+442079460123",
      prefilledMessage: "Greetings Archbishop Samuel, I am registering for the Global Leadership Summit 2025.",
    },
  },

  cathedral: {
    conferenceTitle: "Sacred Epistles & Patristic Theology Symposium",
    eventTypeBadge: "LITURGICAL SYMPOSIUM",
    themeTagline: "Ancient Faith, Unshakable Truth",
    churchName: "St. Augustine Cathedral of Grace",
    hostName: "The Very Rev. Canon Dr. Jonathan Blair",
    heroContextHeadline: "Contending Earnestly for the Faith Once Delivered unto the Saints",
    scriptureAnchor: "“Hold fast the form of sound words, which thou hast heard of me, in faith and love which is in Christ Jesus.” — 2 Tim 1:13",
    fullDescription:
      "A quiet, contemplative gathering of Bible scholars, ministers, and seekers dedicated to rich expository teaching, historic liturgical worship, and rigorous scriptural exegesis. Immerse yourself in sacred choral psalms, deep Patristic theology, and the timeless beauty of holiness in Christ.",
    streamUrl: "https://www.youtube.com/watch?v=live_cathedral_stream",
    conferenceDate: "January 15–17, 2026",
    conferenceTime: "10:00 AM",
    timezone: "GMT (Edinburgh, UK)",
    rsvpLimit: 300,
    confirmedRsvps: 215,
    speaker: {
      name: "Prof. Alistair R. Thorne",
      title: "Chair of Systematic Theology & Biblical Languages",
      bio: "Prof. Thorne has lectured across European theological faculties for three decades, specializing in Pauline epistles, early church hermeneutics, and contemplative worship practices.",
      callingBadges: ["Theological Exegesis", "Hermeneutics", "Liturgical Scholar"],
    },
    agenda: [
      {
        time: "10:00 AM",
        title: "Morning Mattins & Sacred Choral Introit",
        trackCategory: "Worship",
        description: "Choral psalmody and responsive prayers opening the sacred gathering.",
      },
      {
        time: "11:15 AM",
        title: "Theological Plenary: The Christology of the Nicene Creed",
        trackCategory: "Keynote",
        description: "Exegesis into apostolic doctrines of redemption and divine grace.",
      },
      {
        time: "02:30 PM",
        title: "Colloquium: Manuscript Traditions & Modern Translation",
        trackCategory: "Workshop",
        description: "Interactive manuscript examination and scholarly question session.",
      },
    ],
    freeResource: {
      title: "The Nicene & Pauline Compendium: A Study Reader",
      subtitle: "Annotated 64-page liturgical syllabus with original Greek translation notes",
      format: "PDF Booklet",
      downloadUrl: "#",
    },
    whatsapp: {
      groupUrl: "https://chat.whatsapp.com/sample_cathedral_group",
      coordinatorPhone: "+441314960812",
      prefilledMessage: "Reverend Blair, I would like to attend the Sacred Epistles Symposium.",
    },
  },

  grace: {
    conferenceTitle: "Wholeness, Marriage & Family Fellowship 2026",
    eventTypeBadge: "FAMILY & HEALING CONVOCATION",
    themeTagline: "Restored in Love, Rooted in Grace",
    churchName: "Living Streams Family Fellowship",
    hostName: "Pastors Caleb & Ruth Adebayo",
    heroContextHeadline: "A Safe Haven for Spiritual Refreshing, Marital Healing & Family Breakthrough",
    scriptureAnchor: "“And above all these things put on charity, which is the bond of perfectness.” — Col 3:14",
    fullDescription:
      "Join us for an uplifting family weekend designed to heal broken hearts, strengthen marriages, and nurture Christ-centered homes. Featuring interactive couples breakouts, parent-teen workshops, and personal pastoral counseling in a warm, welcoming atmosphere.",
    streamUrl: "https://www.youtube.com/watch?v=live_grace_stream",
    conferenceDate: "February 13–15, 2026",
    conferenceTime: "05:00 PM",
    timezone: "GMT+1 (Lagos, Nigeria)",
    rsvpLimit: 500,
    confirmedRsvps: 378,
    speaker: {
      name: "Pastors Michael & Sarah Jenkins",
      title: "Founders of Covenant Home Ministries",
      bio: "With over 25 years of pastoral marriage counseling, Michael and Sarah have guided thousands of families into divine reconciliation, spiritual intimacy, and peaceful homes.",
      callingBadges: ["Marriage Healing", "Family Counseling", "Pastoral Care"],
    },
    agenda: [
      {
        time: "05:00 PM",
        title: "Acoustic Worship & Opening Communion",
        trackCategory: "Worship",
        description: "Gentle acoustic praise and covenant family communion service.",
      },
      {
        time: "06:15 PM",
        title: "Rebuilding Marital Trust & Intimacy",
        trackCategory: "Keynote",
        description: "Practical Biblical principles for open communication, forgiveness, and healing.",
      },
      {
        time: "08:00 PM",
        title: "Family Altar & Generational Blessing",
        trackCategory: "Altar Call",
        description: "Pastoral laying of hands and prayer of blessing over parents and children.",
      },
    ],
    freeResource: {
      title: "The Covenant Home: 30-Day Family Devotional",
      subtitle: "Daily discussion cards and dinner table prayer points for couples and parents",
      format: "PDF Booklet",
      downloadUrl: "#",
    },
    whatsapp: {
      groupUrl: "https://chat.whatsapp.com/sample_grace_group",
      coordinatorPhone: "+2348098765432",
      prefilledMessage: "Dear Pastor Ruth, our family will be attending the Wholeness & Marriage Fellowship.",
    },
    prayerRequests: [
      {
        id: "p3",
        name: "Brother Anthony & Sis Mary",
        location: "Abuja, Nigeria",
        requestText: "Praying for marital peace and divine fruit of the womb after 4 years of marriage.",
        prayedCount: 64,
      },
      {
        id: "p4",
        name: "Sister Hannah K.",
        location: "Accra, Ghana",
        requestText: "Lifting up our teenage son for spiritual salvation and emotional peace.",
        prayedCount: 41,
      },
    ],
  },
};
