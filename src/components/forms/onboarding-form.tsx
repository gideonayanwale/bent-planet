"use client";

import { useState } from "react";

import { completeOnboardingAction } from "@/app/onboarding/[token]/actions";
import { FieldError } from "@/components/forms/field-error";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/forms";

type OnboardingFormProps = {
  adminEmail: string;
  token: string;
  defaultValues: {
    churchName: string;
    adminName: string;
    country: string;
    timezone: string;
    bio: string;
    instagramUrl: string;
    facebookUrl: string;
    youtubeUrl: string;
    whatsappUrl: string;
  };
};

export function OnboardingForm({ adminEmail, token, defaultValues }: OnboardingFormProps) {
  const [state, setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending, setIsPending] = useState(false);

  async function formAction(formData: FormData) {
    setIsPending(true);
    setState(INITIAL_ACTION_STATE);

    const nextState = await completeOnboardingAction(formData);

    if (nextState) {
      setState(nextState);
    }

    setIsPending(false);
  }

  return (
    <form action={formAction} className="space-y-8" encType="multipart/form-data">
      <input type="hidden" name="token" value={token} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="churchName">Church name</Label>
          <Input id="churchName" name="churchName" defaultValue={defaultValues.churchName} required />
          <FieldError errors={state.fieldErrors?.churchName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminName">Admin name</Label>
          <Input id="adminName" name="adminName" defaultValue={defaultValues.adminName} required />
          <FieldError errors={state.fieldErrors?.adminName} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Invited admin email</Label>
        <Input value={adminEmail} disabled />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FieldError errors={state.fieldErrors?.confirmPassword} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue={defaultValues.country} required />
          <FieldError errors={state.fieldErrors?.country} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" name="timezone" defaultValue={defaultValues.timezone} required />
          <FieldError errors={state.fieldErrors?.timezone} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Church bio</Label>
        <Textarea id="bio" name="bio" defaultValue={defaultValues.bio} required />
        <FieldError errors={state.fieldErrors?.bio} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Church logo</Label>
        <Input
          id="logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          required
        />
        <p className="text-sm text-slate-500">PNG, JPEG, WEBP, or SVG. Maximum 5MB.</p>
        <FieldError errors={state.fieldErrors?.logo} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            name="instagramUrl"
            type="url"
            defaultValue={defaultValues.instagramUrl}
            placeholder="https://instagram.com/yourchurch"
          />
          <FieldError errors={state.fieldErrors?.instagramUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            name="facebookUrl"
            type="url"
            defaultValue={defaultValues.facebookUrl}
            placeholder="https://facebook.com/yourchurch"
          />
          <FieldError errors={state.fieldErrors?.facebookUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">YouTube URL</Label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            defaultValue={defaultValues.youtubeUrl}
            placeholder="https://youtube.com/@yourchurch"
          />
          <FieldError errors={state.fieldErrors?.youtubeUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappUrl">WhatsApp URL</Label>
          <Input
            id="whatsappUrl"
            name="whatsappUrl"
            type="url"
            defaultValue={defaultValues.whatsappUrl}
            placeholder="https://chat.whatsapp.com/..."
          />
          <FieldError errors={state.fieldErrors?.whatsappUrl} />
        </div>
      </div>

      <FormFeedback state={state} />

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Completing setup..." : "Finish onboarding"}
      </Button>
    </form>
  );
}
