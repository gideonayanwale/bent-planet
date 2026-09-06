import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Timer } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/current-user";
import { getAppRouteForEmail } from "@/lib/auth";

export const metadata = {
  title: "Forgot Password | Bent Planet",
  description: "Request a secure 15-minute magic link to reset your Bent Planet workspace password.",
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user?.email) {
    redirect(getAppRouteForEmail(user.email));
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-12 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85">
              <BrandLogo iconSize={44} />
            </Link>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">
              Account Security
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Reset your workspace password.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Enter the email address registered with your Bent Planet church account to receive a secure, single-use 15-minute magic link.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border bg-card/80 shadow-sm backdrop-blur">
                <CardHeader className="pb-2">
                  <Timer className="h-7 w-7 text-primary" />
                  <CardTitle className="text-base font-semibold">15-Min Link Expiry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reset tokens remain active for exactly 15 minutes to guarantee maximum protection against unauthorized access.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/80 shadow-sm backdrop-blur">
                <CardHeader className="pb-2">
                  <ShieldCheck className="h-7 w-7 text-emerald-500" />
                  <CardTitle className="text-base font-semibold">Rate-Limited & Hardened</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Requests are rate-limited to 3 attempts per 15-minute window to stop brute-force & spam attacks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-border bg-card shadow-lg backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold font-heading">Forgot Password</CardTitle>
              <CardDescription>
                We&apos;ll send a 15-minute magic reset link directly to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
