# Bent Planet Deployment Guide

This guide covers everything you need to deploy the Bent Planet platform from zero to production, including environment variables, database migrations, and Vercel setup.

---

## 1. Environment Variables Configuration

Before deploying or running locally, you must provide the following environment variables. Create a `.env.local` file for local development, and add these exact keys to your hosting provider (e.g., Vercel) for production.

### Supabase
- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL (e.g., `https://xxxx.supabase.co`).
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Your Supabase anonymous API key. Safe to expose to the browser.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Your Supabase service role key. **KEEP THIS SECRET**. It bypasses Row-Level Security (RLS) and is used by server actions/APIs to manage administrative tasks.

### Third-Party Services
- **`OPENAI_API_KEY`**: Your OpenAI API key for generating conference pages via `gpt-4o`.
- **`RESEND_API_KEY`**: Your Resend API key for sending transactional emails (welcome emails, reminders).

### Platform & Security
- **`NEXT_PUBLIC_APP_URL`**: The base URL of your deployed application (e.g., `https://bentplanet.com`). Used for generating absolute links for emails and OG images.
- **`CRON_SECRET`**: A random secure string (e.g., a 32-character UUID) used to secure your automated Vercel Cron routes from unauthorized triggers.
- **`SUPER_ADMIN_EMAIL`**: The email address of the platform owner (you). Only this email can access the `/super-admin` dashboard to invite new churches.

---

## 2. Database Migration Setup

Bent Planet uses Supabase (PostgreSQL). We have three sequential migration files located in `supabase/migrations/` that must be executed in order.

### Option A: Using the Supabase Dashboard (SQL Editor)
If you don't have the Supabase CLI installed, you can simply run the scripts manually in the Supabase SQL Editor. 
*Note: You must run them exactly in this order.*

1. **`0001_initial_schema.sql`**: 
   - Creates the core tables (`churches`, `conferences`, `subscribers`, `email_log`, `utm_clicks`, `invites`).
   - Enables Row-Level Security (RLS) and creates policies ensuring churches can only see their own data.
2. **`0002_storage_setup.sql`**: 
   - Initializes the `conference-banners` storage bucket.
   - Sets up public read access and authenticated upload policies.
3. **`0003_social_captions.sql`**: 
   - Alters the `conferences` table to include the `social_captions` JSONB column for storing AI-generated social media content.

### Option B: Using the Supabase CLI
If you use the Supabase CLI for local development or CI/CD:
```bash
# Link your project
supabase link --project-ref <your-project-ref>

# Push migrations directly to your database
supabase db push
```

---

## 3. Deployment on Vercel

Bent Planet is designed specifically to run seamlessly on Vercel.

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2. **Import Project**: Go to the Vercel Dashboard and click "Add New..." > "Project". Select your GitHub repository.
3. **Configure Environment Variables**: In the "Environment Variables" section of the deployment settings, paste all the keys documented in Section 1.
4. **Deploy**: Click "Deploy". Vercel will automatically detect Next.js, build the app, and assign a production URL.
5. **Update NEXT_PUBLIC_APP_URL**: If you are using a custom domain (e.g., `bentplanet.com`), ensure `NEXT_PUBLIC_APP_URL` is set to your final domain rather than the auto-generated Vercel URL.

---

## 4. Post-Deployment Verification

Once deployed, follow these steps to verify the platform is fully operational:

1. **Super Admin Access**: Navigate to `/super-admin`. It should redirect you to `/login`. Sign in using the email you set as `SUPER_ADMIN_EMAIL`. You should gain access to the Super Admin dashboard.
2. **Invite a Test Church**: Send an invite to a secondary email address. Check if Resend delivers the invite email.
3. **AI Generation Check**: Log in as the test church, navigate to `/dashboard/conferences/new`, fill in some dummy details, and verify that OpenAI successfully generates the content.
4. **Storage Check**: Upload a banner during the conference creation process. Verify it displays correctly on the public conference page and appears in your Supabase Storage bucket.
5. **Subscription & Webhooks**: Go to the public conference page, submit a subscription. Verify the user appears in the `/dashboard/subscribers` table. (To fully test webhook opens/clicks, you must configure a Webhook endpoint in your Resend dashboard pointing to `https://yourdomain.com/api/webhooks/resend`).
