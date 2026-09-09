# ✦ Bent Planet — Complex Conference Wireframe & Design Architecture Plan

---

## 1. Architectural Context & Gap Analysis (Phase 1)

### Existing State
Bent Planet currently provides a conference creation flow (`/dashboard/conferences/new`) and public conference renderer (`/c/[church-slug]/[conference-slug]`). It features 4 initial themes (`modern_gradient`, `dark_revival`, `cathedral_minimal`, `youth_energy`) with static CSS token mapping.

### Key Gaps Addressed by This Architecture
1. **Monolithic Page Layout**: Existing public conference pages use a single, hardcoded layout structure. Churches cannot adjust layout hierarchy (e.g. placing speaker roster ahead of video stream, or opting for a dense modern bento grid).
2. **Disconnected Design Discovery**: Churches and visitors have no dedicated way to explore design themes, wireframe variations, or design library resources before generating a conference.
3. **AI Generation Disconnected from Layout Topology**: Current AI generation produces plain text description and simple array items without awareness of the targeted wireframe slots (e.g. Bento grid callouts, liturgical verses, kinetic youth hooks).
4. **Design Library Disconnect**: Design components (typography scales, ministerial badge systems, color palettes) were scattered instead of centralized in an accessible, production-grade library.

---

## 2. System Decomposition & Entity Modeling (Phase 2)

### A. The Fixed But Flexible Wireframe Model

```
                    ┌─────────────────────────────────────────┐
                    │       BENT PLANET WIREFRAME MODEL       │
                    └─────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │  FIXED SKELETON LAYER │                       │ FLEXIBLE CUSTOMS LAYER│
     │  (Invariant Quality)  │                       │ (Modular Adaptability)│
     ├───────────────────────┤                       ├───────────────────────┤
     │ • Church Brand Nav    │                       │ • 6 Layout Topologies │
     │ • Hero Context Hook   │                       │ • Block Ordering      │
     │ • Stream / Countdown  │                       │ • Block Visibility    │
     │ • Spiritual Mandate   │                       │ • 8 Theme Palettes    │
     │ • Ministers Roster    │                       │ • Custom Badges/Tags  │
     │ • Track-Blocked Agenda│                       │ • Accent Overrides    │
     │ • Free Study Resource │                       │ • Custom Slot Content │
     │ • WhatsApp RSVP Dock  │                       │ • Custom Audio/Replay │
     │ • Bent Planet Footer  │                       └───────────────────────┘
     └───────────────────────┘
```

### B. Wireframe Block Registry Schema
Each wireframe comprises modular, typed blocks:
```typescript
export type WireframeBlockId =
  | "brand_nav"
  | "hero_banner"
  | "stream_dock"
  | "about_mandate"
  | "ministers_roster"
  | "track_agenda"
  | "study_resource"
  | "prayer_wall"
  | "rsvp_sticky"
  | "church_footer";

export interface WireframeBlockConfig {
  id: WireframeBlockId;
  label: string;
  enabled: boolean;
  order: number;
  layoutVariant?: "default" | "split" | "bento" | "cinematic" | "compact";
  customData?: Record<string, unknown>;
}

export interface WireframeLayoutConfig {
  presetId: WireframePresetId;
  templateId: TemplateId;
  blocks: WireframeBlockConfig[];
  customAccents?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontHeading?: string;
    fontBody?: string;
  };
}
```

### C. The 6 Production Wireframe Presets
1. **`bento_apex` (Bento Grid)**:
   - High information density, asymmetrical cards, interactive track pill filters, live countdown badge.
   - Best for: Tech summits, Christian leadership conferences, city-wide congresses.
2. **`cinematic_fire` (Atmospheric Dark Revival)**:
   - Deep obsidian background, golden fire embers, wide-screen immersive stream player, passionate minister focus.
   - Best for: Holy Ghost rallies, miracle services, overnight prayer vigils.
3. **`cathedral_editorial` (Minimalist Liturgical)**:
   - Warm stone tones, serif typography, serene line spacing, scripture verses as prominent design elements.
   - Best for: Bible study symposia, theological retreats, sacred choral festivals.
4. **`neon_surge` (High-Energy Kinetic Youth)**:
   - Radical lime/cyber dark accents, dynamic badge angles, instant WhatsApp community hype cards.
   - Best for: Youth camps, university fellowships, music & creative ministries.
5. **`executive_summit` (Corporate Kingdom Leadership)**:
   - Royal navy and champagne gold, formal executive speaker cards, structured business ministry tracks.
   - Best for: Marketplace ministry, pastors conferences, global leadership summits.
6. **`grace_sage` (Organic Community & Fellowship)**:
   - Soft cream and sage green, warm community photo grids, welcoming RSVP drawer.
   - Best for: Family conferences, women's retreats, marriage seminars.

---

## 3. Distributed Execution & AI Fine-Tuning Pipeline (Phase 3)

### AI Fine-Tuning Sequence
```
[User Input / Flyer OCR]
       │
       ▼
[AI Model Selection] (OpenAI gpt-4o -> Gemini 2.0 -> Claude -> Fallback Faith Engine)
       │
       ▼
[System Prompt Injection]
  - Target Wireframe: {presetId} (e.g. bento_apex)
  - Target Theme: {templateId} (e.g. dark_revival)
  - Event Type: {eventType}
  - Context & Scriptures: {caption}
       │
       ▼
[Strict JSON Schema Enforcement]
  - Slotted Content:
    - hero.headlineHook
    - hero.biblicalAnchor
    - about.theologicalSynopsis
    - speakers[].ministerialCalling
    - agenda[].trackCategory (General, Workshop, Prayer, Impartation)
    - rsvp.urgencyTagline
    - whatsapp.broadcastPrompt
       │
       ▼
[Wireframe Slot Hydration]
  - Merges AI output directly into selected wireframe blocks
  - Real-time client preview rendering (<100ms)
```

---

## 4. Standalone Webpage: Templates & Resources Library (Phase 4)

### Route: `/templates`
A high-converting, visually breathtaking standalone page designed with `/frontend-design` principles:
- **Hero & Showcase Header**: Clean typography, curated status pills, quick statistics.
- **Canvas Device Simulator**: Toggle between Desktop (1280px), Tablet (768px), and Mobile (375px) viewports with smooth transition animations.
- **Live Wireframe Inspector**: Inspect slot boundaries and block configurations.
- **Interactive AI Fine-Tuner Studio**:
  - Live playground where organizers can pick any wireframe preset.
  - Choose one of 3 instant faith presets or write custom prompts.
  - Click "Fine-Tune Wireframe with AI" and watch real-time slot hydration.
  - Reorder blocks and toggle components live.
  - "Apply to Conference Creator" with pre-filled wireframe parameters.
- **Curated Resources Library (from Design Libraries)**:
  - Wireframe component blocks (Hero styles, Bento grids, Speaker cards, Stream docks, Sticky RSVP cards).
  - Ministry color swatches with one-click hex copying.
  - Curated spiritual typography pairings.
  - Badges, status pills, and micro-copy systems.

---

## 5. UI/UX Motion Engineering (Phase 5)

Using `/framer-motion` patterns and CSS spring curves:
1. **Device Canvas Morphing**: Smooth spring-based width animation when toggling between desktop, tablet, and mobile views.
2. **Staggered Card Reveals**: Staggered opacity and scale transitions for template cards.
3. **Interactive Tab Morphing**: Active pill indicators that glide smoothly across category tabs.
4. **Drawer & Modal Transitions**: Backdrop blur with spring scale (`scale: 0.96 -> 1.0`).
5. **Interactive Hover Physics**: Card elevation and subtle glowing border highlights on hover.

---

## 6. Implementation & Verification Roadmap (Phase 6)

1. **Step 1**: Write `BRAINSTORMING_AND_RESEARCH.md` (Benchmarking & 10x features).
2. **Step 2**: Write `COMPLEX_CONFERENCE_WIREFRAME_PLAN.md` (This master plan).
3. **Step 3**: Expand `src/lib/theme-config.ts` with 8 complete design themes.
4. **Step 4**: Create `src/lib/wireframe-config.ts` (Fixed-but-flexible wireframe schemas, presets, and AI slot mappers).
5. **Step 5**: Build `src/components/wireframes/conference-wireframe.tsx` (Reusable, multi-preset responsive renderer).
6. **Step 6**: Build `/templates` standalone page (`src/app/templates/page.tsx`).
7. **Step 7**: Update `/dashboard/conferences/new/page.tsx` with Wireframe Selection and link to `/templates`.
8. **Step 8**: Verify with typecheck (`tsc --noEmit`), test build, ensure 0 regressions, and commit to git.
