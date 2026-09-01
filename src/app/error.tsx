"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <div className="space-y-4 max-w-md">
        <span className="text-5xl font-extrabold text-destructive">500</span>
        <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try refreshing or return home.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="outline" size="sm" className="rounded-xl">
            Try Again
          </Button>
          <Button asChild size="sm" className="rounded-xl">
            <a href="/">Go to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
