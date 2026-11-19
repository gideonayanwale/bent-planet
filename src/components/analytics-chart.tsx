"use client";

import { useState } from "react";
import { TrendingUpIcon, CalendarIcon, UsersIcon } from "lucide-react";

interface DataPoint {
  label: string;
  subscribers: number;
  conferences: number;
}

const mockMonthlyData: DataPoint[] = [
  { label: "Jan", subscribers: 45, conferences: 2 },
  { label: "Feb", subscribers: 120, conferences: 3 },
  { label: "Mar", subscribers: 210, conferences: 4 },
  { label: "Apr", subscribers: 380, conferences: 6 },
  { label: "May", subscribers: 590, conferences: 8 },
  { label: "Jun", subscribers: 840, conferences: 11 },
  { label: "Jul", subscribers: 1150, conferences: 14 },
];

const mockWeeklyData: DataPoint[] = [
  { label: "Mon", subscribers: 14, conferences: 1 },
  { label: "Tue", subscribers: 28, conferences: 0 },
  { label: "Wed", subscribers: 42, conferences: 2 },
  { label: "Thu", subscribers: 65, conferences: 1 },
  { label: "Fri", subscribers: 90, conferences: 3 },
  { label: "Sat", subscribers: 130, conferences: 4 },
  { label: "Sun", subscribers: 175, conferences: 3 },
];

export function AnalyticsChart() {
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly">("monthly");
  const [activeMetric, setActiveMetric] = useState<"subscribers" | "conferences">("subscribers");

  const data = timeframe === "monthly" ? mockMonthlyData : mockWeeklyData;
  const maxValue = Math.max(...data.map((d) => d[activeMetric]), 10);

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (d[activeMetric] / maxValue) * 80;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold text-slate-900">Audience Growth & Engagement</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              <TrendingUpIcon className="h-3 w-3" />
              +28% this period
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Live growth metrics across subscribers and conference registrations.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-medium">
            <button
              onClick={() => setActiveMetric("subscribers")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeMetric === "subscribers"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UsersIcon className="h-3.5 w-3.5" />
              Subscribers
            </button>
            <button
              onClick={() => setActiveMetric("conferences")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeMetric === "conferences"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Conferences
            </button>
          </div>

          <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-medium">
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                timeframe === "monthly"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                timeframe === "weekly"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative pt-4">
        <div className="h-48 w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.7" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.7" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f5f9" strokeWidth="0.7" />

            {/* Filled area */}
            <polygon points={areaPoints} fill="url(#chartGradient)" />

            {/* Stroke line */}
            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data Points */}
            {data.map((d, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (d[activeMetric] / maxValue) * 80;
              return (
                <g key={d.label} className="group cursor-pointer">
                  <circle
                    cx={x}
                    cy={y}
                    r="2.5"
                    className="fill-indigo-600 stroke-white stroke-2 transition-transform group-hover:scale-150"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between pt-3 border-t border-slate-100 text-xs font-medium text-slate-400">
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
