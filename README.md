# Bent Planet

Bent Planet is an invite-only SaaS platform for churches to publish online conferences, capture subscribers, and automate email communication.

## Phase 1 Status

This workspace includes:

- Next.js 14 App Router scaffold with TypeScript
- Tailwind CSS configuration
- shadcn/ui base setup
- Supabase client helpers for browser, server, middleware, and service-role usage
- Initial SQL migration with the requested schema and row-level security policies
- Middleware route protection for dashboard, super-admin, and protected APIs
- A Supabase verification script

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in all environment variables from your Supabase, Resend, OpenAI, and Vercel projects.
3. Run the SQL in `supabase/migrations/0001_initial_schema.sql` inside your Supabase SQL editor.
4. Install dependencies with `npm install`.
5. Verify Supabase connectivity with `npm run verify:supabase`.
6. Start the app with `npm run dev`.

## Important Note

The provided database schema does not include an `auth_user_id` column on `churches`. This scaffold maps a signed-in church user to their church row using `churches.admin_email = auth user email`, which preserves the exact schema from the spec.

