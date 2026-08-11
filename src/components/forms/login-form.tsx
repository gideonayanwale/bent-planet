"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { loginAction } from "@/app/login/actions";
import { FieldError } from "@/components/forms/field-error";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/forms";

type LoginFormProps = {
  defaultEmail?: string;
};

export function LoginForm({ defaultEmail }: LoginFormProps) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending, setIsPending] = useState(false);

  async function formAction(formData: FormData) {
    setIsPending(true);
    setState(INITIAL_ACTION_STATE);

    const nextState = await loginAction(formData);

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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaultEmail}
          placeholder="admin@church.org"
          required
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
        <FieldError errors={state.fieldErrors?.password} />
      </div>

      <FormFeedback state={state} />

      <Button className="w-full" size="lg" type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
