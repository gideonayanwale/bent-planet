"use client";

import { useState } from "react";
import {
  LayoutTemplateIcon,
  XIcon,
  CheckIcon,
  SparklesIcon,
  RadioIcon,
  BellRingIcon,
  MailIcon,
  FlameIcon,
  UsersIcon,
  BookOpenIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  RICH_EMAIL_TEMPLATES,
  EMAIL_THEME_PRESETS,
  type EmailTemplateDefinition,
  type EmailThemeStyle,
} from "@/lib/email-templates";

export interface EmailTemplatesGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  churchName: string;
  onSelectTemplate: (template: EmailTemplateDefinition) => void;
}

export function EmailTemplatesGalleryModal({
  isOpen,
  onClose,
  churchName,
  onSelectTemplate,
}: EmailTemplatesGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const categories = ["All", "Events", "Live Alerts", "Reminders", "Follow-up", "Weekly", "Special"];

  const filtered = RICH_EMAIL_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === "All" || tmpl.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.badgeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Events":
        return FlameIcon;
      case "Live Alerts":
        return RadioIcon;
      case "Reminders":
        return BellRingIcon;
      case "Follow-up":
        return BookOpenIcon;
      case "Weekly":
        return SparklesIcon;
      case "Special":
        return UsersIcon;
      default:
        return MailIcon;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-card border border-border text-card-foreground shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 sm:px-8 bg-secondary/30">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <LayoutTemplateIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Ministry Email Template Gallery
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select a professionally drafted, responsive ministry email layout to load into the visual composer.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-6 sm:px-8 border-b border-border bg-card/60 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs scale-102"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8 bg-background"
            />
          </div>
        </div>

        {/* Templates Grid Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-background/50">
          {filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <MailIcon className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <h4 className="text-sm font-bold text-foreground">No templates found</h4>
              <p className="text-xs text-muted-foreground">Try selecting a different category or clear your search term.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tmpl) => {
                const Icon = getCategoryIcon(tmpl.category);
                const theme = EMAIL_THEME_PRESETS[tmpl.themeStyle] || EMAIL_THEME_PRESETS.modern_indigo;

                return (
                  <div
                    key={tmpl.id}
                    className="group relative rounded-2xl border border-border hover:border-primary/60 bg-card hover:bg-secondary/20 transition-all shadow-xs hover:shadow-lg flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Color Banner */}
                    <div
                      className="h-16 p-3 flex items-center justify-between text-white"
                      style={{ background: theme.headerBg }}
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs border border-white/20">
                        {tmpl.badgeLabel}
                      </span>
                      <div className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {tmpl.name}
                          </h4>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {tmpl.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {tmpl.description}
                        </p>
                      </div>

                      {/* Snippet card */}
                      <div className="p-3 rounded-xl bg-secondary/60 border border-border text-[11px] font-sans text-muted-foreground space-y-1.5">
                        <p className="font-semibold text-foreground line-clamp-1">
                          <span className="text-primary font-bold">Subject:</span> {tmpl.subject(churchName)}
                        </p>
                        <p className="text-muted-foreground line-clamp-2 italic">
                          &ldquo;{tmpl.preheader}&rdquo;
                        </p>
                      </div>

                      {/* Footer bar */}
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[130px]">
                          CTA: &quot;{tmpl.ctaText}&quot;
                        </span>
                        <Button
                          size="sm"
                          className="h-8 text-xs font-bold gap-1.5 shadow-xs"
                          onClick={() => {
                            onSelectTemplate(tmpl);
                            onClose();
                          }}
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
