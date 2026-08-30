"use client";

import { ALL_TEMPLATES, type TemplateId } from "@/lib/theme-config";
import { CheckCircle2Icon } from "lucide-react";

interface TemplatePickerProps {
  value: string;
  onChange: (templateId: string) => void;
  label?: string;
  description?: string;
}

export function TemplatePicker({
  value,
  onChange,
  label = "Conference Landing Page Template & Ambience",
  description = "Select a visual style and color ambience for this conference's public landing and live player page.",
}: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</label>
        {description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_TEMPLATES.map((tmpl) => {
          const isSelected = value === tmpl.id;
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onChange(tmpl.id)}
              className={`group relative text-left rounded-2xl p-4 transition-all border ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white shadow-xs">
                  <CheckCircle2Icon className="h-3.5 w-3.5" />
                </div>
              )}

              {/* Color Swatch Preview */}
              <div className="flex items-center gap-1.5 mb-3">
                {tmpl.previewColors.map((color, i) => (
                  <span
                    key={i}
                    className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="space-y-1 pr-6">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {tmpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
