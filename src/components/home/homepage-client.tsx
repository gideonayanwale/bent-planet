import { type ReactNode } from "react";

interface HomepageClientProps {
  children: ReactNode;
}

/** Lightweight static ambient backdrop; avoids a continuous canvas loop and autoplay video. */
export function HomepageClient({ children }: HomepageClientProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1020] font-sans text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute -right-40 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
