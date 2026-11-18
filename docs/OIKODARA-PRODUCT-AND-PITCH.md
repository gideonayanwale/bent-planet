# OIKODARA — Product & Partnership Brief

> OIKODARA is the approved product identity for this connected digital ministry platform. Name, domain and trademark availability have not been cleared. All demo data in the interactive showcase is fictional.

## Positioning

**OIKODARA is a connected digital ministry platform that helps churches turn fragmented digital reach into sustained relationships, coordinated ministry and measurable engagement.**

Churches already reach people through livestreams, online services, social channels, event registrations, messaging groups and subscriber lists. The problem is that these touchpoints are often disconnected. A church may have livestream viewers and online subscribers but lack a dependable way to recognise returning participants, keep contact records current, coordinate follow-up, understand engagement over time or connect digital participation to the wider life of the ministry. The result is fragmented data, missed follow-up, limited analytics and relationships that are difficult to sustain.

OIKODARA bridges that gap by connecting ministry workspaces, event publishing, registration, audience records, communication and follow-up. Its broader product direction is to help churches connect people across physical and digital ministry, understand activity over time and build stronger pathways into fellowship and discipleship. Analytics from third-party livestream or social platforms depend on supported integrations and permissions; OIKODARA must not imply it already identifies every viewer or subscriber from external channels.

**In one sentence:** OIKODARA helps churches move from fragmented digital reach to connected people, continuous engagement and better-informed ministry.

## Audiences and pitches

### Churches and ministry leaders

**Message:** Make every conference the beginning of a stronger connection.

Churches may have livestream viewers, online subscribers and event participants spread across different platforms, but no connected record of those relationships. They lose continuity, timely follow-up and the ability to understand engagement over time. OIKODARA connects event publishing, registration, church-owned audience records, communication and follow-up in one workspace, with deeper external-channel analytics added only through supported integrations.

- Publish event pages with conference details, speakers, schedules and livestream information.
- Use AI-assisted event descriptions, schedules and promotional copy.
- Collect attendee details and organise contacts in a church workspace.
- Prepare email announcements, reminders, replay links and study resources.
- Review available audience and event activity, and identify follow-up gaps.
- Build a more continuous picture of engagement over time from data the church has permission to collect.

**Ask:** Pilot one upcoming conference with one ministry team. Agree success measures before launch: setup time, registration completion, contact-data quality, follow-up completion and administrator satisfaction.

### Denominations and church networks

**Message:** Give member churches a consistent digital event system while preserving ministry-level ownership.

- Provision distinct church workspaces.
- Standardise event publishing and onboarding.
- Maintain church-level audience separation.
- Review platform adoption and operational health through authorised administration.

**Ask:** Select a small cohort of churches for a time-bounded network pilot.

### Technology, media and distribution partners

**Message:** Help churches move from one-off event promotion to connected digital experiences.

Potential collaboration includes implementation and training, livestream and media services, referrals, reseller/managed-service arrangements and complementary integrations.

**Ask:** Define one co-delivered pilot and the partner's measurable contribution.

### Attendees and end users

**Message:** Discover ministry activities, participate and stay connected afterwards.

- One event page for details, speakers, programme and livestream links.
- Clear pathways from livestreams, online programmes and subscriptions into ongoing ministry communication.
- Clear registration and event updates.
- Relevant replay and resource follow-up from the organising ministry.

**Ask:** Test an event page and provide feedback on the registration and follow-up journey.

### Sponsors, foundations and supporters

**Message:** Support practical digital infrastructure that helps ministries serve their communities.

A sponsor may fund access, onboarding, training or a defined pilot. Report verified adoption, usability and workflow outcomes; do not overstate registrations or reach as social impact.

**Ask:** Co-design a funded pilot with transparent scope, budget and reporting.

## Product capabilities evidenced in the repository

- Multi-tenant church workspaces and invite/access-request onboarding.
- Conference management and public church/event routes.
- AI-assisted conference copy and agenda generation with multiple provider integrations and prebuilt fallback content.
- Theme and wireframe presets, including revival, editorial, youth, executive and fellowship directions.
- Audience/subscriber management and CSV workflows.
- Email broadcast and scheduled sequence infrastructure using Resend.
- Public event pages with registration, livestream, speaker, agenda, WhatsApp and optional prayer/community components.
- Platform administration for church onboarding, access requests, workspace operations and platform analytics.
- Supabase database, authentication and row-level security scaffolding.
- Vercel deployment configuration, analytics and monitoring integrations.

## Important validation and product-readiness items

1. The README's initial SQL migration is not the entire schema used by the current app. The super-admin page references additional tables/columns such as `access_requests`, `feedback_messages`, denomination, plan limits and premium flags. Reconcile migrations against the actual application schema before onboarding production churches.
2. Verify every tenant-scoped query and API route against row-level security. Service-role access bypasses RLS and must be guarded by server-side authorization.
3. Validate consent, unsubscribe, sender-domain authentication, bounce handling, rate limits and email deliverability before sending real campaigns.
4. Test all AI provider fallback paths, cost controls, generated-content review and failure handling. Avoid claiming guaranteed uptime.
5. Validate media storage permissions, file-size/type restrictions, retention and public/private asset rules.
6. Confirm event time-zone handling, registration deduplication, export permissions and data deletion workflows.
7. Run production build, typecheck, security review and end-to-end tests with a non-production Supabase project.
8. The public demo intentionally uses fictional records and simulated actions. It must not be presented as a live connected production tenant.

## Suggested pilot scorecard

| Area | Measure |
|---|---|
| Setup | Time from invitation to published event |
| Discovery | Event-page visits by source |
| Conversion | Registrations / unique event-page visits |
| Data quality | Duplicate, invalid and incomplete contact rates |
| Communication | Delivery, bounce, unsubscribe and complaint rates |
| Follow-up | Share of registrants receiving the intended follow-up |
| Adoption | Active church admins and repeat event creation |
| Experience | Church administrator and attendee satisfaction |
| Economics | Hosting, AI, storage and email cost per active church/event |

## Demo

- Interactive demo: `/demo`
- Audience-specific pitch: `/pitch`
- Both pages label their sample data and simulated actions clearly.

## Brand identity

**OIKODARA** — inspired by the New Testament concept *oikodomē*, building up and strengthening the Church.

## Core problem and solution narrative

**Problem:** Churches are increasingly present online, but their digital ministry is fragmented. Livestream viewers, online subscribers, event registrants and community members are spread across separate platforms. Ministries often cannot keep their records current, recognise returning participants, coordinate consistent follow-up or analyse engagement over time. Digital reach therefore does not reliably become an ongoing relationship.

**Solution:** OIKODARA provides connected infrastructure for the ministry relationship journey: discover → participate → register or subscribe → communicate → follow up → stay connected. It brings church administration, events, audience records, communication and community-oriented ministry workflows into one platform. The aim is not to replace every streaming or social platform; it is to connect the people and ministry processes around them, and progressively incorporate external engagement data through supported integrations.

**What success should mean:** more complete church-owned contact records; fewer missed follow-ups; repeat participation; clearer event and audience trends; stronger connection between online participation and in-person ministry; and better-informed decisions by ministry leaders. These are outcomes to measure in pilots, not guaranteed results or claims that all third-party analytics are already integrated.

**Tagline:** Building the Church. Connecting the People.

**Descriptor:** A connected digital ministry platform for church administration, fellowship, discipleship, events, communication and member engagement.

The name is an approved working brand, not a claim of legal exclusivity. Complete trademark, company-name, domain and social-handle clearance before public commercial launch.

## Suggested 60-second spoken pitch

"Churches are reaching people online through livestreams, subscriptions, social channels and digital programmes, but those relationships are often scattered across disconnected tools. A church may know how many people viewed a stream, yet still struggle to know who is returning, keep contact details current, follow up consistently or understand engagement over time. OIKODARA bridges that gap by connecting church workspaces, events, registrations, audience records, communication and follow-up. We want to help ministries move from fragmented digital reach to sustained relationships, stronger community connection and better-informed decisions. We will measure what the platform can verify today and add deeper external-channel analytics through supported integrations."
