---

# ✦ Bent Planet — Complete Master Build Prompt

---

## WHAT IS BENT PLANET

**Bent Planet** is an invite-only SaaS platform for churches to create, publish, and manage online conferences — and automatically grow and nurture their audience through email. Churches get their own branded dashboard. Attendees subscribe to conferences and receive automated emails whenever their church goes live with something new. The Bent Planet super admin (you) controls who gets on the platform.

---

## HOW IT WORKS (The Core Flow)

```
You (Super Admin)
  → Invite a church → Church gets login + their own dashboard
      → Church creates a conference (AI generates the full page)
          → Public conference page is live with a shareable link
              → Attendee finds the page (via church's Instagram, WhatsApp, Google)
                  → Attendee subscribes → becomes a lead for that church
                      → Church publishes next conference
                          → All their leads get notified automatically by email
```

---

## ROLE 1 — SUPER ADMIN (You / Bent Planet)

**Dashboard at `/super-admin`**     /*implement very fast and must show in the dashboard of the superadmin*
follow the newplans write and rewrite to fit the state

**Church Management:**
- Invite a church by entering their name + admin email → system sends them a setup email with a one-time onboarding link
- View all churches on the platform (name, country, total conferences, total subscribers, joined date)
- Suspend or revoke access to any church
- Impersonate any church dashboard for support purposes
- Set platform-wide limits per church (e.g. max conferences, max email sends per month)

**Platform Analytics:**
- Total churches · Total conferences published · Total subscribers (all churches combined) · Total emails sent
- Growth chart (new churches per month, new subscribers per month)
- Most active churches ranked by conferences and subscriber count

**Email Controls:**
- Override and send a platform-wide announcement to all subscribers across all churches (e.g. Bent Planet updates)
- View full email delivery log across the entire platform

---

## ROLE 2 — CHURCH (Host Dashboard)

Each church gets their own isolated space. They log in and manage everything themselves.

**Onboarding Flow:**
- Church receives invite email → clicks link → sets up their profile:
  - Church name
  - Logo upload
  - church banner upload 
  - Country + timezone
  - Admin name + password
  - Short bio / description ("Who we are")  /*allow up to 100 character limit.*
  - Social links (Instagram, Facebook, YouTube, whatsapp channel link, WhatsApp group link)
- After setup, they land on their dashboard

---

### CHURCH DASHBOARD (`/dashboard`)

**Overview cards:**
- Total subscribers · New subscribers (last 7 days) · Live conferences · Total emails sent · Email open rate

**Quick actions:**
- Create New Conference
- Send Email to Subscribers
- View My Subscribers

---

### CONFERENCE CREATOR (`/dashboard/conferences/new`)

Church fills in a simple form — AI handles the rest. make the form ui/ux friendly with all devices with clear visibility

**Input fields:** /always provide guides in the input areas.
- Conference name
- Short caption (2–4 sentences about the conference — AI expands this)
- Banner image upload (stored in Supabase Storage)
-type of event(Church Programmes, Women conference, men conference, Youth conference, Revival, Monthly programes,retreat, others)
- Speaker(s) / preacher(s)/ minister(s) name(allow multiple)
- whatsapp group invite link 
- name of Host (person in charge)
- Date(start date, end date), start time per each day, timezone(default to the time set by the church during the signup ask for location)
- Conference theme / topic (dropdown: Revival, Prophetic, Healing, Youth, Leadership, Worship, Prayer, Evangelism, or custom) allow the custom titles
- Scheduled Stream or updated stream link (YouTube Live, Vimeo, or Zoom — URL input) for live viewong of videos.
- allow uploads of flyers to two banner layout.
- Enable Replay toggle (stream saved for on-demand viewing after conference)
- Free resource toggle (upload a PDF — conference notes, devotional guide, or e-book/ Ebook purchase link  — auto-sent to subscribers)

**On Submit — AI Auto-Generates:** should be editable
- Full conference description (500–700 words, Spirit-filled, warm Christian tone with context from the uploaded banner when creating that conference and the input submissions)
- Conference agenda (prayer, worship, ministration, altar call, closing — time-blocked)- not necessary except added. Allow upload of conference programme outline for this or a clean text area for the update + Date of commencement and time per day.
- Speaker bio (based on name given(input or banner) + theme)
-Host name
- OG meta tags (title(MARK IMPORTANT), description(USE THE ONE GIVEN), image(USE UPLOADED)) — so the link looks rich when shared on WhatsApp or Instagram
- allow the SHORTENING OF LINKS TO THE SLUG IF AVAILABLE FOR FREE ON BIT.LY
- A clean URL slug: `bentplanet.com/c/church-name/conference-slug`
- Invite email copy (subject + body) — ready for the church to send to their subscribers full of all the necessary details needed.
Support whatsapp channel updates

**After generation:**
- Church reviews the AI content, edits everything, then clicks **Publish**
- Conference page goes live instantly
- All existing subscribers of that church receive an automatic notification email

---

### PUBLIC CONFERENCE PAGE (`/c/[church-slug]/[conference-slug]`)

This is the public-facing page that gets shared everywhere.

**Page sections:**
- Church logo + name (top left, links to church profile)
- Full-width banner image (uploaded) with gradient overlay 
- Conference name (large, bold)
- Speaker name + AI-generated bio
- Date, time, timezone, format (Online / Livestream) for each day of the conference(if multiple days)
- Full AI-generated description
- Conference agenda (time-blocked or any if available)
- Working Embedded stream player (YouTube/Vimeo) — shows countdown timer if event hasn't started, live player during event, replay player after
- **Subscribe box** (name + email + phone(optional)) with CTA: "Subscribe & Get Updates"
- Free resource section (if church uploaded one): "Get the Conference Guide — Free" (auto-sent after subscribing)
- Church social links - just icons (Instagram, Facebook, YouTube, X and many more if available,Support whatsapp channel updates)
- Related conferences from the same church (past or upcoming)
- Show ** Powered By Bent Planet + {Year}**


**OG Preview (when link is pasted in WhatsApp, Instagram bio, Twitter, etc.):**
- Generates a rich link preview: conference banner, name, date, church name
- Powered by `@vercel/og`
- Makes the link look professional and clickable in every platform

---

### SHAREABLE LINK & MARKETING TOOLS (`/dashboard/conferences/[id]/promote`)

After publishing, church sees a Promote tab.

**Shareable Links (per platform):**
- Generic link: `bentplanet.com/c/house-of-glory/open-heavens-2025`
- UTM-tagged links auto-generated for: Instagram Bio · WhatsApp Blast · Facebook Post · Twitter/X · Email Campaign · YouTube Description
- One-click copy for each
- allow shorten of links with custom back-HA urlLF

**AI Social Media Captions (auto-generated on publish):**
- **Instagram caption** — hook + description + hashtags + CTA (fits 2,200 char limit)
- **WhatsApp broadcast message** — short, punchy, emoji-rich, with link
- **Twitter/X thread** — 4-tweet thread (hook tweet + 3 content tweets + CTA tweet)
- **Facebook post** — warm community tone, event details, link
- **YouTube community post** — announcement format
- Regenerate button for each caption individually
- One-click copy, no friction

**Poster Generator:**
- Auto-generates a shareable conference poster (1080×1080 for Instagram, 1080×1920 for Stories)
- Uses the uploaded banner + conference name + date + church name overlaid
- Download as PNG — ready to post immediately

---

### SUBSCRIBER MANAGEMENT (`/dashboard/subscribers`)

- Table: Name · Email · Phone · Subscribed Date · Conferences Subscribed · Emails Received · Last Opened
- Search and filter by name, email, date
- import/Export CSV
- Manually add a subscriber (for walk-in registrations or WhatsApp signups)
- Remove a subscriber
- View per-subscriber history (which conferences they subscribed to, which emails they opened)

---

### EMAIL CENTER (`/dashboard/emails`)

Churches control their own email communication with their subscribers.(Provide onboarding guide for the new users and make it a chelist they had to do for a complete setup)always add "powered by bent planet" at the botom not the head.

**Automated Emails (set-and-forget):**

**Email 1 — Welcome (sent immediately when someone subscribes):**
- Subject: `Welcome to [Church Name] — You're in! 🙌`
- Content: Welcome message, what to expect, conference details they subscribed to, free resource download link (if enabled), stream link
- Branded with church logo, name, and colors

**Email 2 — Conference Reminder (sent 24 hours before conference):**
- Subject: `Tomorrow! [Conference Name] goes live 🔥`
- Content: Reminder of date/time, stream link, agenda preview, "invite a friend" share link

**Email 3 — It's Live! (sent when church marks conference per day has started):**
- Subject: `We're LIVE now — Join us 🎙️`
- Content: Direct stream link, one-click join button, quick word from the host

**Email 4 — Post-Conference (sent 1 day after conference ends):**
- Subject: `Thank you for joining — Replay + Notes inside 🙏`
- Content: Thank-you message, replay link (if enabled), conference notes/PDF download, notification about next conference

**Email 5 — New Conference Announcement (auto-sent when church publishes any new conference):**
- Subject: `[Church Name] has a new conference — Save your spot`
- Content: AI-generated announcement, conference details, subscribe/join link

**Manual Broadcast Email:**
- Church writes a custom email to all their subscribers any time
- Input: subject + body (or let AI generate it from a prompt)
- Schedule for a specific date/time or send immediately
- Preview as HTML before sending
- Track opens and clicks in email log

**Email Log:**
- Table of all emails sent: type, subject, sent at, recipients, open rate, click rate

---

### CHURCH PUBLIC PROFILE (`/c/[church-slug]`)

A public page for each church — acts as their Bent Planet home.

- Church banner + logo
- Church name, country, bio, location 
- Social links (Instagram, Facebook, YouTube, WhatsApp)
- All published conferences (upcoming first, then past)
- Total subscriber count (optional — church can hide this)
- "Subscribe to all updates" button — subscribes them to all future conferences from this church

---

## ROLE 3 — ATTENDEE (Subscriber)

Attendees don't have accounts. They just subscribe and receive emails/ alerts.

**Subscribe Flow:**
- Attendee lands on public conference page
- Fills in: Full name · Email · Phone (optional)
- Clicks Subscribe
- Saved to Supabase `subscribers` table linked to that church
- Welcome email sent immediately
- If conference has a free resource, download link included in welcome email
- once subscribed they have
only for them to be recieving email and i think we should provide turn on optional bells for notification about many other confrences within the church or auto get updtaes depending on what each subriber wants but they will certainly get updates when new confernce is created but may choose to ignore other mails in prep for the conference. 

**What they receive after subscribing:**
- Welcome email (immediate)
- Conference reminder (once created, 7 days, 24hrs before the start date)
- It's Live email (when stream starts)
- Post-conference email with replay + notes
- New conference announcements (every time the church publishes something new)
- One-click unsubscribe link in every email footer

**They never need to log in, create an account, or visit the site again** — everything comes to their inbox.
- At every email invite for subscribers directl/via the conference page Encourage the users to view the main website in case they have programmes they want to host and From there they can **Request for Access** from the super admin and right from there they got registered as a church (Only the official events manager per church can register i.e 1 church 1 account.)

---

## DATABASE SCHEMA **create new queries at will to suit the well and smooth running of the database**


```sql
-- Churches
churches (
  id uuid PRIMARY KEY,
  name text,
  slug text UNIQUE,
  logo_url text,
  banner_url text,
  bio text,
  country text,
  timezone text,
  admin_name text,
  admin_email text UNIQUE,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  whatsapp_url text,
  status text DEFAULT 'active',  -- active | suspended
  invited_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- Conferences
conferences (
  id uuid PRIMARY KEY,
  church_id uuid REFERENCES churches(id),
  title text,
  slug text,
  caption text,
  full_description text,        -- AI generated
  agenda jsonb,                 -- AI generated
  speaker_name text,
  speaker_bio text,             -- AI generated
  banner_url text,
  stream_url text,
  theme text,
  conference_date date,
  conference_time time,
  timezone text,
  enable_replay boolean DEFAULT true,
  free_resource_url text,
  status text DEFAULT 'draft',  -- draft | published | live | ended
  created_at timestamptz DEFAULT now()
)

-- Subscribers (Leads per Church)
subscribers (
  id uuid PRIMARY KEY,
  church_id uuid REFERENCES churches(id),
  conference_id uuid REFERENCES conferences(id),
  full_name text,
  email text,
  phone text,
  emails_received text[] DEFAULT '{}',
  last_email_opened_at timestamptz,
  subscribed_at timestamptz DEFAULT now()
)

-- Email Log
email_log (
  id uuid PRIMARY KEY,
  church_id uuid REFERENCES churches(id),
  subscriber_id uuid REFERENCES subscribers(id),
  email_type text,
  subject text,
  sent_at timestamptz,
  opened boolean DEFAULT false,
  clicked boolean DEFAULT false
)

-- UTM Tracking
utm_clicks (
  id uuid PRIMARY KEY,
  conference_id uuid,
  utm_source text,
  clicked_at timestamptz,
  converted boolean DEFAULT false
)
```

---

## PAGES STRUCTURE

```
-- Public
/                              → Bent Planet landing page
/c/[church-slug]               → Church public profile
/c/[church-slug]/[conf-slug]   → Public conference page

-- Church Dashboard
/dashboard                     → Overview
/dashboard/conferences         → All conferences
/dashboard/conferences/new     → Create conference (AI generator)
/dashboard/conferences/[id]    → Edit conference
/dashboard/conferences/[id]/promote  → Shareable links + social captions
/dashboard/subscribers         → Subscriber management
/dashboard/emails              → Email center + log

-- Super Admin
/super-admin                   → Platform overview
/super-admin/churches          → Manage all churches
/super-admin/invite            → Invite a church
/super-admin/analytics         → Platform-wide analytics

-- API
/api/generate-conference       → OpenAI content generation
/api/subscribe                 → Handle subscription form
/api/send-email                → Resend email trigger
/api/cron/email-sequences      → Daily email automation (Vercel Cron)
/api/og/[conference-slug]      → Dynamic OG image generation
/api/webhooks/resend           → Email open/click tracking
```

---

## TECH STACK

| Layer | Tool |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui |
| AI Content | OpenAI API `gpt-4o` |
| Database | Supabase (PostgreSQL + Storage + Auth) |
| Email | Resend + React Email |
| OG Images | `@vercel/og` |
| Cron Jobs | Vercel Cron |
| Deployment | Vercel |

---

## ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://bentplanet.com
CRON_SECRET=
SUPER_ADMIN_EMAIL=
```

