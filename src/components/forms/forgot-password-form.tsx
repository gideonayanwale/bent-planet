"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

import { forgotPasswordAction } from "@/app/forgot-password/actions";
import { FieldError } from "@/components/forms/field-error";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/forms";

export function ForgotPasswordForm() {
  const [state, setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending, setIsPending] = useState(false);

  async function formAction(formData: FormData) {
    setIsPending(true);
    setState(INITIAL_ACTION_STATE);

    const nextState = await forgotPasswordAction(formData);
    if (nextState) {
      setState(nextState);
    }
    setIsPending(false);
  }

  if (state.status === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-foreground">Check your inbox</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {state.message ||
              "If an account with that email exists, a password reset magic link has been sent. The link expires strictly in 15 minutes."}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          ⏱️ <span className="font-medium text-foreground">15-Minute Expiry Limit:</span> Security tokens expire automatically after 15 minutes.
        </div>
        <div className="pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Work/Ministry Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@church.org"
          required
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>

      <FormFeedback state={state} />

      <Button className="w-full" size="lg" type="submit" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 animate-spin" /> Sending Reset Link...
          </span>
        ) : (
          "Send 15-Min Password Reset Link"
        )}
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </form>
  );
}
