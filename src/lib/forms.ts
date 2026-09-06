import { z } from "zod";

export const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;
export const CHURCH_LOGO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.string().url().safeParse(value).success,
    "Enter a valid URL.",
  )
  .transform((value) => (value === "" ? null : value));

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .refine((val) => /[A-Z]/.test(val), "Must contain at least one uppercase letter.")
      .refine((val) => /[a-z]/.test(val), "Must contain at least one lowercase letter.")
      .refine((val) => /[0-9]/.test(val), "Must contain at least one number.")
      .refine((val) => /[^A-Za-z0-9]/.test(val), "Must contain at least one special character (!@#$%^&*)."),
    confirmPassword: z.string().min(8, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const inviteSchema = z.object({
  churchName: z.string().trim().min(2, "Church name is required.").max(120),
  adminEmail: z.string().trim().email("Enter a valid admin email address."),
});

export const onboardingSchema = z
  .object({
    token: z.string().trim().min(1),
    churchName: z.string().trim().min(2, "Church name is required.").max(120),
    adminName: z.string().trim().min(2, "Admin name is required.").max(120),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
    country: z.string().trim().min(2, "Country is required.").max(80),
    timezone: z.string().trim().min(2, "Timezone is required.").max(80),
    bio: z.string().trim().min(12, "Add a short church bio.").max(600),
    instagramUrl: optionalUrlSchema,
    facebookUrl: optionalUrlSchema,
    youtubeUrl: optionalUrlSchema,
    whatsappUrl: optionalUrlSchema,
    denomination: z.string().trim().max(80).optional().nullable(),
    yearFounded: z.string().trim().max(10).optional().nullable(),
    motto: z.string().trim().max(100).optional().nullable(),
    adminRole: z.string().trim().max(100).optional().nullable(),
    phoneNumber: z.string().trim().max(40).optional().nullable(),
    churchWebsiteUrl: optionalUrlSchema.optional(),
    state: z.string().trim().max(80).optional().nullable(),
    town: z.string().trim().max(80).optional().nullable(),
    xUrl: optionalUrlSchema.optional(),
    telegramUrl: optionalUrlSchema.optional(),
    tiktokUrl: optionalUrlSchema.optional(),
    threadsUrl: optionalUrlSchema.optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  payload?: string;
};

export const INITIAL_ACTION_STATE: ActionState = {
  status: "idle",
};

export function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function actionSuccess(message: string): ActionState {
  return {
    status: "success",
    message,
  };
}

export function actionError(
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export function fromValidationError(error: z.ZodError): ActionState {
  return actionError("Please correct the highlighted fields and try again.", error.flatten().fieldErrors);
}

export function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return value !== null && typeof value !== "string";
}

export function validateLogoFile(value: FormDataEntryValue | null) {
  if (!isUploadedFile(value) || value.size === 0) {
    return "Upload a church logo.";
  }

  if (!CHURCH_LOGO_MIME_TYPES.includes(value.type)) {
    return "Upload a PNG, JPEG, WEBP, or SVG logo.";
  }

  if (value.size > MAX_LOGO_SIZE_BYTES) {
    return "Logo size must be 5MB or less.";
  }

  return null;
}
