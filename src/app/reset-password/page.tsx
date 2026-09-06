import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = {
  title: "Set New Password | Bent Planet",
  description: "Set a new secure password for your Bent Planet account.",
};

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  // Guard: User must be authenticated via recovery token session
  if (!user) {
    redirect("/forgot-password?error=session_expired");
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85">
              <BrandLogo iconSize={44} />
            </Link>
            <div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Identity Verified
              </Badge>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Create New Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your new account password below. Ensure it meets all 5 security standards.
            </p>
          </div>

          <Card className="border-border bg-card shadow-lg backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
                <Lock className="h-5 w-5 text-primary" />
                <span>Set New Password</span>
              </div>
              <CardDescription>
                Logged in as <span className="font-medium text-foreground">{user.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
