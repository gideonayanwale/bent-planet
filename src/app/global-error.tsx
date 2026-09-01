import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
        <div className="space-y-4 max-w-md">
          <span className="text-5xl font-extrabold text-rose-500">Error</span>
          <h1 className="text-2xl font-bold tracking-tight">Application Encountered an Error</h1>
          <p className="text-sm text-slate-400">
            A critical error occurred. The incident has been reported to our engineering team.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button onClick={() => reset()} variant="outline" size="sm" className="rounded-xl border-slate-700 text-white hover:bg-slate-800">
              Try Again
            </Button>
            <Button asChild size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              <a href="/">Go to Home</a>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
