import type { ActionState } from "@/lib/forms";
import { cn } from "@/lib/utils";

type FormFeedbackProps = {
  state: ActionState;
};

export function FormFeedback({ state }: FormFeedbackProps) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        state.status === "error"
          ? "border-destructive/20 bg-destructive/5 text-destructive"
          : "border-success/20 bg-success/10 text-emerald-900",
      )}
    >
      {state.message}
    </div>
  );
}
