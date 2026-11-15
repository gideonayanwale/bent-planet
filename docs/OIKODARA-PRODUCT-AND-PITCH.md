# OIKODARA — Product & Partnership Brief

> Proposed product name for the Bent Planet church conference platform. Name, domain and trademark availability have not been cleared. All demo data in the interactive showcase is fictional.

## Positioning

**OIKODARA is a digital event and audience engagement platform for churches and Christian ministries.** It helps ministries publish branded conference pages, capture registrations, organise their own subscriber audiences and coordinate event communications from one church workspace.

## Audiences and pitches

### Churches and ministry leaders

**Message:** Make every conference the beginning of a stronger connection.

Churches often coordinate promotion, registration, livestream information and follow-up across disconnected tools. OIKODARA brings those workflows into a church-branded workspace.

- Publish event pages with conference details, speakers, schedules and livestream information.
- Use AI-assisted event descriptions, schedules and promotional copy.
- Collect attendee details and organise contacts in a church workspace.
- Prepare email announcements, reminders, replay links and study resources.
- Review audience and event activity.

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

**Message:** Find the event, register easily and stay connected afterwards.

- One event page for details, speakers, programme and livestream links.
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

**Tagline:** Building the Church. Connecting the People.

**Descriptor:** A connected digital ministry platform for church administration, fellowship, discipleship, events, communication and member engagement.

The name is an approved working brand, not a claim of legal exclusivity. Complete trademark, company-name, domain and social-handle clearance before public commercial launch.

## Suggested 60-second spoken pitch

"Churches carry out important work across administration, events, communication, discipleship and member care, but the digital tools supporting that work are often fragmented. OIKODARA brings essential ministry workflows into one connected platform. Churches can organise their workspaces, publish events, manage registrations and member engagement, and coordinate communications and follow-up. For church networks, it provides a repeatable way to equip member churches while keeping church workspaces distinct. We want to begin with a focused pilot, measure actual outcomes, and grow based on what ministries find useful."
