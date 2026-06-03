"use client";

import { useRef, useState } from "react";

import { inviteChurchAction } from "@/app/super-admin/invite/actions";
import { FieldError } from "@/components/forms/field-error";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/forms";

export function InviteChurchForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending, setIsPending] = useState(false);

  async function formAction(formData: FormData) {
    setIsPending(true);
    setState(INITIAL_ACTION_STATE);

    const nextState = await inviteChurchAction(formData);
    setState(nextState);

    if (nextState.status === "success") {
      formRef.current?.reset();
    }

    setIsPending(false);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="churchName">Church name</Label>
        <Input id="churchName" name="churchName" placeholder="House of Glory" required />
        <FieldError errors={state.fieldErrors?.churchName} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminEmail">Admin email</Label>
        <Input
          id="adminEmail"
          name="adminEmail"
          type="email"
          autoComplete="email"
          placeholder="admin@houseofglory.org"
          required
        />
        <FieldError errors={state.fieldErrors?.adminEmail} />
      </div>

      <FormFeedback state={state} />

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Sending invite..." : "Send onboarding invite"}
      </Button>
    </form>
  );
}
