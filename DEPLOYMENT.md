# Bent Planet Deployment Guide

This guide covers everything you need to deploy the Bent Planet platform from zero to production, including environment variables, database migrations, and Vercel setup.

---

## 1. Environment Variables Configuration

Before deploying or running locally, you must provide the following environment variables. Create a `.env.local` file for local development, and add these exact keys to your hosting provider (e.g., Vercel) for production.

### Supabase
- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL (e.g., `https://xxxx.supabase.co`).
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Your Supabase anonymous API key. Safe to expose to the browser.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Your Supabase service role key. **KEEP THIS SECRET**. It bypasses Row-Level Security (RLS) and is used by server actions/APIs to manage administrative tasks.

### AI Engine Providers (Multi-LLM Fallback)
- **`OPENAI_API_KEY`**: Primary LLM key for GPT-4o conference generation.
- **`DEEPSEEK_API_KEY`**: Fallback 1 LLM key for DeepSeek Chat/V3.
- **`GEMINI_API_KEY` / `GOOGLE_AI_API_KEY`**: Fallback 2 LLM key for Google Gemini 1.5.
- **`ANTHROPIC_API_KEY`**: Fallback 3 LLM key for Anthropic Claude.

### Email & Communications
- **`RESEND_API_KEY`**: Resend API key for sending transactional emails (welcome emails, reminders, live broadcast notifications).
- **`RESEND_FROM_EMAIL`**: Verified sender address (defaults to `noreply@bentplanet.com`).

### Cloud Media Storage (Optional CDN Offload)
- **`CLOUDINARY_CLOUD_NAME`**: Cloudinary cloud name for direct asset hosting.
- **`CLOUDINARY_UPLOAD_PRESET`**: Cloudinary unsigned upload preset for browser uploads.
- **`EXTERNAL_STORAGE_GATEWAY_URL`**: High-capacity external file gateway URL (e.g. S3, R2, TeraBox).
- **`EXTERNAL_STORAGE_API_KEY`**: API key for external storage gateway.

### Platform & Security
- **`NEXT_PUBLIC_APP_URL`**: The base URL of your deployed application (e.g., `https://bentplanet.com`). Used for generating absolute links for emails and OG images.
- **`CRON_SECRET`**: A random secure string (e.g., a 32-character UUID) used to secure your automated Vercel Cron routes from unauthorized triggers.
- **`SUPER_ADMIN_EMAILS`**: A comma-separated list of up to two emails for the platform owners (e.g., `admin1@bentplanet.com,admin2@bentplanet.com`). Only these emails can access the `/super-admin` dashboard to invite new churches.

---

## 2. Database Migration Setup

Bent Planet uses Supabase (PostgreSQL). We have four sequential migration files located in `supabase/migrations/` that must be executed in order.

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
4. **`0004_church_assets.sql`**:
   - Creates the `church-assets` storage bucket with RLS policies for church logos and media.
   - Enables Supabase Realtime for `subscribers` and `conferences` tables for live analytics updates.

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

1. **Super Admin Access**: Navigate to `/super-admin`. It should redirect you to `/login`. Sign in using one of the emails you set in `SUPER_ADMIN_EMAILS`. You should gain access to the Super Admin dashboard.
2. **Invite a Test Church**: Send an invite to a secondary email address. Check if Resend delivers the invite email.
3. **AI Generation Check**: Log in as the test church, navigate to `/dashboard/conferences/new`, fill in some dummy details, and verify that OpenAI successfully generates the content.
4. **Storage Check**: Upload a banner during the conference creation process. Verify it displays correctly on the public conference page and appears in your Supabase Storage bucket.
5. **Subscription & Webhooks**: Go to the public conference page, submit a subscription. Verify the user appears in the `/dashboard/subscribers` table. (To fully test webhook opens/clicks, you must configure a Webhook endpoint in your Resend dashboard pointing to `https://yourdomain.com/api/webhooks/resend`).

---

## 5. Docker Deployment (Alternative to Vercel)

Bent Planet can be deployed to **any server with Docker** using the included Docker Compose setup. This includes a multi-stage build for the Next.js app, an Nginx reverse proxy, and automatic TLS via Let's Encrypt.

### Prerequisites

- Docker Engine 20+ and Docker Compose v2+
- A server with ports 80 and 443 open
- A domain name with DNS A record pointing to your server's IP
- Your `.env.local` file with all environment variables from Section 1

### 5.1 — Build the Docker Image

The `NEXT_PUBLIC_*` variables must be passed as build arguments because Next.js inlines them into the client-side JavaScript bundle at build time:

```bash
docker compose build
```

> **Note**: The `docker-compose.yml` reads `NEXT_PUBLIC_*` values from your `.env.local` file and passes them as build args automatically.

### 5.2 — Initial TLS Certificate Setup

Before starting the full stack, you need to provision Let's Encrypt certificates:

1. **Edit the init script** — Open `init-letsencrypt.sh` and update:
   - `DOMAINS` — your domain(s)
   - `EMAIL` — your email for renewal notices
   - `STAGING=1` — set to `1` first to test without hitting rate limits

2. **Edit Nginx config** — In `nginx/nginx.conf` and `nginx/nginx-initial.conf`, replace `bentplanet.com` with your actual domain.

3. **Run the init script**:
   ```bash
   chmod +x init-letsencrypt.sh
   ./init-letsencrypt.sh
   ```

4. Once successful with staging, set `STAGING=0` in the script and run it again for production certificates.

### 5.3 — Start the Full Stack

```bash
docker compose up -d
```

This starts three containers:

| Container | Purpose |
|---|---|
| `bent-planet-app` | Next.js application (port 3000, internal only) |
| `bent-planet-nginx` | Nginx reverse proxy (ports 80 & 443) |
| `bent-planet-certbot` | Auto-renews TLS certs every 12 hours |

### 5.4 — Verify Deployment

```bash
# Check all containers are running and healthy
docker compose ps

# View application logs
docker compose logs -f app

# Test HTTPS
curl -I https://yourdomain.com
```

### 5.5 — Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart (zero-downtime with health checks)
docker compose build
docker compose up -d
```

### 5.6 — Useful Commands

```bash
# View logs for a specific service
docker compose logs -f app
docker compose logs -f nginx

# Restart a single service
docker compose restart app

# Force certificate renewal
docker compose run --rm certbot renew --force-renewal
docker compose exec nginx nginx -s reload

# Stop everything
docker compose down

# Stop and remove volumes
docker compose down -v
```

