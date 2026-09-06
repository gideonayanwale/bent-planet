"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, X } from "lucide-react";

import { resetPasswordAction } from "@/app/reset-password/actions";
import { FieldError } from "@/components/forms/field-error";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/forms";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending, setIsPending] = useState(false);
  const [password, setPassword] = useState("");

  // Strength checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;

  async function formAction(formData: FormData) {
    setIsPending(true);
    setState(INITIAL_ACTION_STATE);

    const nextState = await resetPasswordAction(formData);

    if (nextState?.payload) {
      router.push(nextState.payload);
      return;
    }

    if (nextState) {
      setState(nextState);
    }
    setIsPending(false);
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FieldError errors={state.fieldErrors?.password} />
      </div>

      {/* Password Strength Checklist Indicator */}
      <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between font-medium text-foreground pb-1 border-b border-border/50">
          <span>Password Requirements</span>
          <span
            className={
              strengthScore === 5
                ? "text-emerald-600 font-bold"
                : strengthScore >= 3
                ? "text-amber-600 font-bold"
                : "text-rose-500 font-bold"
            }
          >
            {strengthScore}/5 Passed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            {checks.length ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={checks.length ? "text-foreground font-medium" : ""}>At least 8 chars</span>
          </div>

          <div className="flex items-center gap-1.5">
            {checks.uppercase ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={checks.uppercase ? "text-foreground font-medium" : ""}>Uppercase (A-Z)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {checks.lowercase ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={checks.lowercase ? "text-foreground font-medium" : ""}>Lowercase (a-z)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {checks.number ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={checks.number ? "text-foreground font-medium" : ""}>Number (0-9)</span>
          </div>

          <div className="col-span-2 flex items-center gap-1.5">
            {checks.special ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={checks.special ? "text-foreground font-medium" : ""}>Special character (!@#$%^&*)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          required
        />
        <FieldError errors={state.fieldErrors?.confirmPassword} />
      </div>

      <FormFeedback state={state} />

      <Button
        className="w-full"
        size="lg"
        type="submit"
        disabled={isPending || strengthScore < 5}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 animate-spin" /> Updating Password...
          </span>
        ) : (
          "Save New Password"
        )}
      </Button>
    </form>
  );
}
