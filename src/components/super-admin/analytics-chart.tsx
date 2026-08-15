"use client";

import { useEffect, useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DataPoint = {
  date: string;
  subscribers: number;
  conferences: number;
};

export function AnalyticsChart({ 
  initialSubscribers, 
  initialConferences 
}: { 
  initialSubscribers: { subscribed_at: string }[], 
  initialConferences: { created_at: string }[] 
}) {
  const [subs, setSubs] = useState(initialSubscribers);
  const [confs, setConfs] = useState(initialConferences);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    // Listen for new subscribers
    const subChannel = supabase
      .channel('public:subscribers')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscribers' }, payload => {
        setSubs(current => [...current, { subscribed_at: payload.new.subscribed_at }]);
      })
      .subscribe();

    // Listen for new conferences
    const confChannel = supabase
      .channel('public:conferences')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conferences' }, payload => {
        setConfs(current => [...current, { created_at: payload.new.created_at }]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subChannel);
      supabase.removeChannel(confChannel);
    };
  }, [supabase]);

  // Transform raw dates into daily cumulative totals for Recharts
  const chartData = useMemo(() => {
    const dataMap = new Map<string, { subs: number, confs: number }>();
    
    // Group subs by date
    subs.forEach(s => {
      if (!s.subscribed_at) return;
      const date = new Date(s.subscribed_at).toISOString().split('T')[0];
      const existing = dataMap.get(date) || { subs: 0, confs: 0 };
      dataMap.set(date, { ...existing, subs: existing.subs + 1 });
    });

    // Group confs by date
    confs.forEach(c => {
      if (!c.created_at) return;
      const date = new Date(c.created_at).toISOString().split('T')[0];
      const existing = dataMap.get(date) || { subs: 0, confs: 0 };
      dataMap.set(date, { ...existing, confs: existing.confs + 1 });
    });

    // Sort dates
    const sortedDates = Array.from(dataMap.keys()).sort();
    
    let cumulativeSubs = 0;
    let cumulativeConfs = 0;
    
    const finalData: DataPoint[] = sortedDates.map(date => {
      const dayData = dataMap.get(date)!;
      cumulativeSubs += dayData.subs;
      cumulativeConfs += dayData.confs;
      return {
        date,
        subscribers: cumulativeSubs,
        conferences: cumulativeConfs,
      };
    });

    return finalData;
  }, [subs, confs]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl">
        <p className="text-slate-500">Not enough data to generate chart.</p>
      </div>
    );
  }

  return (
    <Card className="border-slate-200/70 bg-white/90 shadow-sm mt-8">
      <CardHeader>
        <CardTitle>Platform Growth (Live)</CardTitle>
        <CardDescription>
          Real-time view of cumulative subscriber growth and conference creation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConfs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="subscribers" 
                name="Total Subscribers"
                stroke="#4f46e5" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSubs)" 
              />
              <Area 
                type="monotone" 
                dataKey="conferences" 
                name="Total Conferences"
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorConfs)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
