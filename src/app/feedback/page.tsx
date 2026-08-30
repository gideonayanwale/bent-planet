import Link from "next/link";
import { MessageSquareIcon, ArrowLeftIcon, GlobeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback-form";

export const metadata = {
  title: "Feedback & Support | Bent Planet",
  description: "Send inquiries, feature requests, or technical support messages to the Bent Planet team.",
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition">
              <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Bent Planet
              </span>
            </Link>

            <Button asChild size="sm" variant="ghost" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link href="/">
                <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </header>

        {/* Content Box */}
        <main className="container py-12 sm:py-16 px-4 sm:px-6 max-w-lg mx-auto">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <MessageSquareIcon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Feedback & Support
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Have a question, encountered an issue, or want to suggest a new feature? We would love to hear from you.
              </p>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-3xl overflow-hidden p-2 sm:p-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-slate-900 dark:text-slate-100">Send an Inquiry</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Please specify your correct contact email so our team can follow up if needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackForm />
              </CardContent>
            </Card>

            <div className="text-center">
              <Link
                href="/docs"
                className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold underline transition-colors"
              >
                Need immediate help? Browse our documentation guides →
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="container mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Bent Planet Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
