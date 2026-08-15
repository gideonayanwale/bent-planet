import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  OPENAI_API_KEY: z.string().optional().default(""),
  GEMINI_API_KEY: z.string().optional().default(""),
  GOOGLE_AI_API_KEY: z.string().optional().default(""),
  DEEPSEEK_API_KEY: z.string().optional().default(""),
  ANTHROPIC_API_KEY: z.string().optional().default(""),
  RESEND_API_KEY: z.string().optional().default(""),
  RESEND_FROM_EMAIL: z.string().optional().default("noreply@bentplanet.com"),
  CRON_SECRET: z.string().optional().default(""),
  SUPER_ADMIN_EMAILS: z.string().optional().default(""),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional().default(""),
  EXTERNAL_STORAGE_GATEWAY_URL: z.string().optional().default(""),
  EXTERNAL_STORAGE_API_KEY: z.string().optional().default(""),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
}

export function getServerEnv(): ServerEnv {
  const isBuildTime = process.env.npm_lifecycle_event === "build";
  
  if (isBuildTime) {
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || "",
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || "",
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
      RESEND_API_KEY: process.env.RESEND_API_KEY || "",
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || "noreply@bentplanet.com",
      CRON_SECRET: process.env.CRON_SECRET || "",
      SUPER_ADMIN_EMAILS: process.env.SUPER_ADMIN_EMAILS || "",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || "",
      EXTERNAL_STORAGE_GATEWAY_URL: process.env.EXTERNAL_STORAGE_GATEWAY_URL || "",
      EXTERNAL_STORAGE_API_KEY: process.env.EXTERNAL_STORAGE_API_KEY || "",
    };
  }

  return serverEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    CRON_SECRET: process.env.CRON_SECRET,
    SUPER_ADMIN_EMAILS: process.env.SUPER_ADMIN_EMAILS,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
    EXTERNAL_STORAGE_GATEWAY_URL: process.env.EXTERNAL_STORAGE_GATEWAY_URL,
    EXTERNAL_STORAGE_API_KEY: process.env.EXTERNAL_STORAGE_API_KEY,
  });
}
