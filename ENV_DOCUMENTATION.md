# ✦ Bent Planet — Environment Variables & Secrets Reference

This document provides a comprehensive inventory of all environment variables, API keys, and secrets used in **Bent Planet**, where to locate them, and their fallback behaviors.

---

## 1. Quick Location Map

| Key Name | Category | Scope | Required / Optional | Where to Find / How to Generate |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Database & Auth | Public (Client + Server) | **Required** | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database & Auth | Public (Client + Server) | **Required** | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Database Admin | **Secret** (Server Only) | **Required** | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API → `service_role` secret (bypasses RLS for admin tasks) |
| `NEXT_PUBLIC_APP_URL` | Application URL | Public | **Required** | Production domain (e.g., `https://bentplanet.com`) or local dev (`http://localhost:3000`) |
| `OPENAI_API_KEY` | AI Generation | **Secret** (Server Only) | Optional (Primary) | [OpenAI Platform](https://platform.openai.com/api-keys) → Create secret key (uses `gpt-4o` / `gpt-4o-mini`) |
| `GEMINI_API_KEY` / `GOOGLE_AI_API_KEY` | AI Generation | **Secret** (Server Only) | Optional (Fallback 1) | [Google AI Studio](https://aistudio.google.com/app/apikey) → Get Gemini API Key (uses `gemini-1.5-flash` / `gemini-2.0-flash`) |
| `DEEPSEEK_API_KEY` | AI Generation | **Secret** (Server Only) | Optional (Fallback 2) | [DeepSeek Open Platform](https://platform.deepseek.com/api_keys) → Create API Key |
| `ANTHROPIC_API_KEY` | AI Generation | **Secret** (Server Only) | Optional (Fallback 3) | [Anthropic Console](https://console.anthropic.com/settings/keys) → Create API Key (uses `claude-3-5-sonnet`) |
| `OPENROUTER_API_KEY` | AI Generation | **Secret** (Server Only) | Optional (Free Tier) | [OpenRouter Dashboard](https://openrouter.ai/keys) → Create Key (accesses free OpenRouter models) |
| `RESEND_API_KEY` | Email Broadcast | **Secret** (Server Only) | Optional | [Resend Dashboard](https://resend.com/api-keys) → Create API Key (sending domain must be verified) |
| `RESEND_FROM_EMAIL` | Email Broadcast | Public/Config | Optional | Default: `noreply@bentplanet.com` or custom verified sender email |
| `CLOUDINARY_CLOUD_NAME` | Cloud CDN Storage | Public/Server | Optional | [Cloudinary Console](https://cloudinary.com/console) → Dashboard → Cloud Name |
| `CLOUDINARY_UPLOAD_PRESET` | Cloud CDN Storage | Server Only | Optional | Cloudinary Console → Settings → Upload → Upload presets (unsigned/signed preset) |
| `EXTERNAL_STORAGE_GATEWAY_URL` | Cloud CDN Storage | Server Only | Optional | Custom proxy URL for TeraBox Gateway, S3, or R2 media offloading |
| `EXTERNAL_STORAGE_API_KEY` | Cloud CDN Storage | **Secret** (Server Only) | Optional | Bearer API token for your custom media storage gateway |
| `BITLY_ACCESS_TOKEN` | Link Shortening | **Secret** (Server Only) | Optional | [Bitly Developer Portal](https://app.bitly.com/settings/api/) → Generate Access Token |
| `CRON_SECRET` | System Automation | **Secret** (Server Only) | Optional | Random 32+ character string used to authenticate cron routes (`/api/cron/...`) |
| `SUPER_ADMIN_EMAILS` | Authorization | Server Only | Optional | Comma-separated list of emails authorized for `/super-admin` portal |
| `SENTRY_AUTH_TOKEN` | Error Monitoring | **Secret** (Build Only) | Optional | [Sentry Settings](https://sentry.io/settings/account/api/auth-tokens/) → Create Auth Token |
| `NEXT_PUBLIC_SENTRY_DSN` | Error Monitoring | Public | Optional | Sentry Project Settings → Client Keys (DSN) |

---

## 2. Multi-Provider AI Fallback Behavior

Bent Planet uses a **zero-downtime multi-model AI waterfall** (`src/lib/ai-generator.ts`):
1. **OpenAI (`gpt-4o`)**: Used first if `OPENAI_API_KEY` is present.
2. **Google Gemini (`gemini-1.5-flash`)**: Used if OpenAI fails or key is missing (`GEMINI_API_KEY`).
3. **DeepSeek (`deepseek-chat`)**: Used if Gemini fails (`DEEPSEEK_API_KEY`).
4. **Anthropic Claude (`claude-3-5-sonnet`)**: Used if DeepSeek fails (`ANTHROPIC_API_KEY`).
5. **OpenRouter Free Tier**: Used if other commercial providers are unconfigured (`OPENROUTER_API_KEY`).
6. **Pre-Built Faith Engine (`getVariantContent`)**: **Guaranteed zero-fail offline fallback**. If NO API keys are provided or network fails, the system automatically hydrates rich, Spirit-filled conference copy tailored to the theme without throwing an error.

---

## 3. Storage Hierarchy (Cloud Storage CDN)

Bent Planet protects server memory by offloading high-resolution conference flyers and PDFs (`src/lib/storage.ts`):
1. **Cloudinary**: Primary external CDN if `CLOUDINARY_CLOUD_NAME` is configured.
2. **External Gateway (TeraBox / S3 / R2)**: Used if `EXTERNAL_STORAGE_GATEWAY_URL` is set.
3. **Supabase Storage Bucket**: Native fallback if external cloud providers are unconfigured.

---

## 4. Local Development `.env.local` Template

Copy this template into `.env.local` in the project root:

```env
# ==========================================
# 1. Supabase (Database & Authentication)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==========================================
# 2. Application Core
# ==========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SUPER_ADMIN_EMAILS="admin@bentplanet.com"
CRON_SECRET="your-super-secret-cron-token-here"

# ==========================================
# 3. AI Providers (Waterfall Sequence)
# ==========================================
OPENAI_API_KEY=""
GEMINI_API_KEY=""
DEEPSEEK_API_KEY=""
ANTHROPIC_API_KEY=""
OPENROUTER_API_KEY=""

# ==========================================
# 4. Email Infrastructure (Resend)
# ==========================================
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@bentplanet.com"

# ==========================================
# 5. Cloud Storage CDN (Optional)
# ==========================================
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_UPLOAD_PRESET=""
EXTERNAL_STORAGE_GATEWAY_URL=""
EXTERNAL_STORAGE_API_KEY=""

# ==========================================
# 6. URL Shortening & Monitoring (Optional)
# ==========================================
BITLY_ACCESS_TOKEN=""
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""
```
