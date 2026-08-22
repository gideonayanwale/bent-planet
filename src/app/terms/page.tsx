import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { PublicFooter } from "@/components/public-footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto max-w-5xl h-16 flex items-center justify-between px-4">
          <Link href="/">
            <BrandLogo iconSize={36} />
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-600">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8 flex-1">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: August 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing or using Bent Planet (&quot;the Service&quot;), you agree to be bound by these Terms of Service. Bent Planet is an invite-only SaaS platform built for churches and Christian ministries to publish conferences and manage attendee communications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Workspace Administration & Acceptable Use</h2>
            <p className="text-slate-600">
              Churches are responsible for maintaining the confidentiality of their administrator login credentials. The service must not be used to transmit unlawful content, spam, or unsolicited mass communications that violate applicable anti-spam legislation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Livestreams & Media Assets</h2>
            <p className="text-slate-600">
              Churches retain full copyright and ownership of their sermon content, audio, banners, and streaming broadcasts hosted via external providers (YouTube Live, Vimeo, Zoom).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Limitation of Liability</h2>
            <p className="text-slate-600">
              Bent Planet is provided &quot;as is&quot; without warranties of any kind. Bent Planet shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime or third-party stream service interruptions.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
