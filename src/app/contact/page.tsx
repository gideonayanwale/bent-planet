"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MailIcon,
  MessageCircleIcon,
  HelpCircleIcon,
  SparklesIcon,
  SendIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  PhoneCallIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  Building2Icon,
  SearchIcon,
  ArrowRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { PublicFooter } from "@/components/public-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDynamicTitle } from "@/lib/hooks";

type ContactTab = "form" | "whatsapp" | "faq";

interface FaqItem {
  question: string;
  answer: string;
  category: "access" | "features" | "media" | "audience";
}

const FAQS: FaqItem[] = [
  {
    category: "access",
    question: "How does our church request access to OIKODARA?",
    answer:
      "OIKODARA is an invite-only platform engineered specifically for verified ministries and church organizations. You can submit an access request through our online application form. Our review team verifies ministry credentials within 24 hours and issues a secure, isolated workspace onboarding link.",
  },
  {
    category: "features",
    question: "Can we broadcast live streams to attendees with zero lag?",
    answer:
      "Yes! You can embed YouTube Live, Vimeo OTT, Facebook Live, M3U8 HLS streams, or custom RTMP streams directly into your dedicated conference room. Attendees enjoy high-definition playback, synchronized live chat, and instant prayer request submission without leaving your branded portal.",
  },
  {
    category: "audience",
    question: "Does our ministry own 100% of our attendee data?",
    answer:
      "Absolutely. Every attendee who subscribes or registers for your conference belongs strictly to your church's isolated database. You have full data sovereignty to search, filter, tag, import offline spreadsheets, and export full CSV lists anytime.",
  },
  {
    category: "features",
    question: "How does the WhatsApp community integration work?",
    answer:
      "OIKODARA generates seamless click-to-join WhatsApp buttons with prefilled RSVP confirmation text. When attendees register, they can be immediately routed to your church's WhatsApp group or channel for real-time announcements, sermon notes, and prayer circles.",
  },
  {
    category: "media",
    question: "Where are our conference banners, flyers, and devotional PDFs hosted?",
    answer:
      "All heavy assets are automatically offloaded to high-speed external Cloud CDNs (such as Cloudinary, TeraBox Gateway, or AWS S3/R2). This ensures your conference pages load in milliseconds globally without bogging down server memory.",
  },
  {
    category: "access",
    question: "How fast can our media team launch our first conference?",
    answer:
      "With our built-in 60-Second AI Event Creator, you simply input your conference theme, scripture, and guest ministers. AI automatically generates a Spirit-filled description, time-blocked agenda, promotional captions, and ready-to-broadcast landing page in under a minute.",
  },
];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<ContactTab>("form");

  // Dynamic Browser Tab Title
  const tabTitles: Record<ContactTab, string> = {
    form: "Contact Us & Send Message",
    whatsapp: "WhatsApp & Direct Channels",
    faq: "Frequently Asked Questions",
  };
  useDynamicTitle(tabTitles[activeTab], "Church Conference & Growth Platform");

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    churchName: "",
    category: "Church Onboarding & Access",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // FAQ State
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        message: `[Church / Ministry: ${formData.churchName.trim() || "Not specified"}]\n\n${formData.message.trim()}`,
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver message. Please try again.");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        churchName: "",
        category: "Church Onboarding & Access",
        message: "",
      });
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitStatus("error");
      setErrorMessage(error.message || "An unexpected error occurred. Please reach out via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = faqCategory === "all" || faq.category === faqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const whatsappNumber = "2348152048160";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello OIKODARA team, I am reaching out regarding church workspace setup and conference streaming."
  )}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo iconSize={38} />
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold hidden sm:inline-flex">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
              <Link href="/request-access">Request Access</Link>
            </Button>
            <Button asChild size="sm" className="btn-gradient text-xs font-semibold shadow-sm">
              <Link href="/login">Church Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-border bg-gradient-to-b from-indigo-500/5 via-transparent to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-5 shadow-xs">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Dedicated Ministry Support & Partnership Desk</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-foreground">
              Contact & Partner with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                OIKODARA
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions about church workspace onboarding, live stream distribution, attendee audience ownership, or custom domain setup? We are here to support your mission.
            </p>

            {/* Interactive Tab Switcher */}
            <div className="mt-6 sm:mt-8 inline-flex flex-wrap items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-secondary/80 border border-border shadow-inner gap-1 max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "form"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MailIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Send Message</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("whatsapp")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "whatsapp"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                <span>WhatsApp & Direct</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("faq")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "faq"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HelpCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Knowledge Base & FAQ</span>
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Body */}
        <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
          {/* TAB 1: CONTACT FORM */}
          {activeTab === "form" && (
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-6">
                <div className="p-6 rounded-3xl bg-secondary/40 border border-border space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Building2Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-foreground">Church Partnerships</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      We collaborate with denominations, independent ministries, and campus fellowships worldwide to amplify gospel broadcasts.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Response time: Under 4 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Dedicated technical onboarding engineer</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-300 font-bold">
                    Live Ministry Support
                  </span>
                  <h4 className="font-bold text-base">Hosting a Sunday Conference?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our platform support team maintains live standby monitoring during registered church conferences to ensure uninterrupted streams and instant attendee check-ins.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 mt-2"
                  >
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircleIcon className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                      Chat with Live Tech Standby
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Form Card (Col 6-12) */}
              <div className="md:col-span-7">
                <Card className="border-border shadow-xl bg-card rounded-3xl overflow-hidden">
                  <CardHeader className="p-6 sm:p-8 border-b border-border bg-secondary/20">
                    <CardTitle className="text-xl font-bold font-heading">Send Us a Direct Message</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Fill out this form and our operations desk will route your inquiry immediately to the appropriate team.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 sm:p-8">
                    {submitStatus === "success" ? (
                      <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2Icon className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold font-heading text-foreground">Message Received!</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Thank you for reaching out. Our ministry coordination team has been notified and will reply to{" "}
                            <span className="font-semibold text-foreground">{formData.email || "your email"}</span> promptly.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmitStatus("idle")}
                          className="text-xs mt-2"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {submitStatus === "error" && (
                          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                            <AlertCircleIcon className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact-name" className="text-xs font-semibold">
                              Your Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact-name"
                              required
                              placeholder="Pastor David Olawale"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="text-xs h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-email" className="text-xs font-semibold">
                              Work / Ministry Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact-email"
                              type="email"
                              required
                              placeholder="pastor@church.org"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="text-xs h-10"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact-church" className="text-xs font-semibold">
                              Church / Ministry Name
                            </Label>
                            <Input
                              id="contact-church"
                              placeholder="Grace Covenant Church"
                              value={formData.churchName}
                              onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                              className="text-xs h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-category" className="text-xs font-semibold">
                              Inquiry Category
                            </Label>
                            <select
                              id="contact-category"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="Church Onboarding & Access">Church Onboarding & Access</option>
                              <option value="Live Stream & Broadcast Setup">Live Stream & Broadcast Setup</option>
                              <option value="WhatsApp Community Automations">WhatsApp Community Automations</option>
                              <option value="Billing, Plans & Custom Domain">Billing, Plans & Custom Domain</option>
                              <option value="Technical Support">Technical Support</option>
                              <option value="Ministry Partnership">Ministry Partnership</option>
                              <option value="Other Inquiry">Other Inquiry</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact-message" className="text-xs font-semibold">
                            Your Message <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="contact-message"
                            required
                            rows={4}
                            placeholder="Tell us about your upcoming event, expected attendee size, or any technical questions you have..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="text-xs resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn-gradient text-xs font-bold h-11 shadow-md"
                        >
                          {isSubmitting ? (
                            <span>Sending Message...</span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <SendIcon className="w-3.5 h-3.5" /> Submit Inquiry
                            </span>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP & DIRECT CHANNELS */}
          {activeTab === "whatsapp" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid md:grid-cols-3 gap-6">
                {/* WhatsApp Quick Chat */}
                <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                      <MessageCircleIcon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-[10px] mb-2 font-mono">
                      Fastest Response
                    </Badge>
                    <h3 className="font-heading font-bold text-lg text-foreground">WhatsApp Quick-Chat</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Connect directly with our operations desk on WhatsApp for immediate onboarding guidance, live conference emergency support, or product walkthroughs.
                    </p>
                  </div>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md mt-4">
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircleIcon className="w-4 h-4 mr-2" />
                      Open WhatsApp Chat
                    </Link>
                  </Button>
                </div>

                {/* Email Direct Desk */}
                <div className="p-6 rounded-3xl border border-border bg-card space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                      <MailIcon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] mb-2 font-mono">
                      Formal Inquiries
                    </Badge>
                    <h3 className="font-heading font-bold text-lg text-foreground">Official Email Support</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      For formal ministry proposals, partnership agreements, data protection questions, or custom enterprise terms.
                    </p>
                    <div className="mt-4 space-y-1 text-xs">
                      <div className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        support@bentplanet.com
                      </div>
                      <div className="font-mono text-muted-foreground">
                        partners@bentplanet.com
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full text-xs font-semibold mt-4">
                    <Link href="mailto:support@bentplanet.com">
                      <MailIcon className="w-4 h-4 mr-2 text-indigo-500" />
                      Email Operations Desk
                    </Link>
                  </Button>
                </div>

                {/* Church Access Request */}
                <div className="p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-950/20 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                      <SparklesIcon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 text-[10px] mb-2 font-mono">
                      Invite Only
                    </Badge>
                    <h3 className="font-heading font-bold text-lg text-foreground">Apply for Workspace</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Ready to launch your ministry on OIKODARA? Submit your application directly to our verification team.
                    </p>
                  </div>
                  <Button asChild className="w-full btn-gradient text-xs font-bold shadow-md mt-4">
                    <Link href="/request-access">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Request Church Access
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Ministry Service Hours Guarantee */}
              <div className="p-6 sm:p-8 rounded-3xl bg-secondary/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-heading font-bold text-base text-foreground">Operating Schedule & Sunday Live Coverage</h4>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    Standard inquiries are answered Monday through Saturday, 08:00 – 19:00 UTC. On Sundays and during pre-registered church convocations, our emergency livestream standby crew is active 24/7.
                  </p>
                </div>
                <Badge variant="outline" className="px-4 py-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shrink-0">
                  ● Systems 100% Operational
                </Badge>
              </div>
            </div>
          )}

          {/* TAB 3: FREQUENTLY ASKED QUESTIONS */}
          {activeTab === "faq" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search questions (e.g. streaming, WhatsApp, access)..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="pl-10 text-xs h-10"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border">
                  {[
                    { id: "all", label: "All Questions" },
                    { id: "access", label: "Access & Workspace" },
                    { id: "features", label: "Livestream & AI" },
                    { id: "audience", label: "Audience CRM" },
                    { id: "media", label: "Media & Storage" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFaqCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        faqCategory === cat.id
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl border border-dashed border-border">
                    No matching questions found. Reach out to our team directly via the contact form or WhatsApp!
                  </div>
                ) : (
                  filteredFaqs.map((faq, index) => {
                    const isOpen = expandedFaq === index;
                    return (
                      <div
                        key={index}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? "bg-secondary/40 border-indigo-500/40 shadow-sm"
                            : "bg-card border-border hover:border-border/80"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isOpen ? null : index)}
                          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-foreground"
                        >
                          <span>{faq.question}</span>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-indigo-500" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-0 border-t border-border/50">
                            <p className="mt-3">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Help Banner */}
              <div className="text-center p-8 rounded-3xl bg-secondary/30 border border-border space-y-3">
                <h4 className="font-heading font-bold text-base text-foreground">Still have questions?</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Can&apos;t find what you are looking for? Send us a quick note and our ministry team will get back to you within hours.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("form")}
                    size="sm"
                    className="btn-gradient text-xs font-bold"
                  >
                    Open Contact Form
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold"
                  >
                    <Link href="/docs">
                      View Full Platform Docs
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
