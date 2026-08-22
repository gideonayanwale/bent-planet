import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { PublicFooter } from "@/components/public-footer";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: August 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p className="text-slate-600">
              Bent Planet collects information required to provide church workspace administration and conference streaming landing pages. This includes Church Administrator names, official ministry email addresses, passwords (securely hashed), subscriber contact information (names, emails, phone numbers voluntarily submitted for event registrations), and ministry media assets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. How We Use Information</h2>
            <p className="text-slate-600">
              We utilize collected information strictly to:
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>Deliver event landing pages and livestream notifications to attendees.</li>
              <li>Facilitate automated email updates from churches to their registered subscribers.</li>
              <li>Provide workspace analytics, attendee growth metrics, and campaign insights.</li>
              <li>Ensure platform safety, compliance, and prevent unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Subscriber Data & Ministry Ownership</h2>
            <p className="text-slate-600">
              Each church owns their respective subscriber roster. Bent Planet does not sell, rent, or trade subscriber contact information to third parties. Church administrators can export or delete their subscriber records at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Data Security</h2>
            <p className="text-slate-600">
              We implement enterprise-grade encryption, secure token authentication, and Row-Level Security (RLS) across all database records to safeguard your ministry and attendee information.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
