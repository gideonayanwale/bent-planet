import { BrandIcon } from "@/components/brand-logo";

export function BrandLoader({ label = "Loading OIKODARA" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground" role="status" aria-live="polite">
      <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10">
        <BrandIcon size={34} className="animate-pulse motion-reduce:animate-none" />
        <span aria-hidden="true" className="absolute inset-0 rounded-2xl border-2 border-primary/40 border-t-primary animate-spin motion-reduce:animate-none" />
      </span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
