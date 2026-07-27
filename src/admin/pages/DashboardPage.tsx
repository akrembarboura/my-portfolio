import { useEffect, useState } from 'react';
import {
  Briefcase,
  FolderKanban,
  Images,
  Star,
  Mail,
  Eye,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { Card } from '../components/ui';
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS, timeAgo } from '../utils/helpers';
import { Link } from 'react-router-dom';
import type { Lead, LeadStatus } from '../types';

interface Stats {
  services: number;
  projects: number;
  portfolio: number;
  testimonials: number;
  leads: number;
  pendingLeads: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [dailyCounts, setDailyCounts] = useState<number[]>([]);
  const [projectTypes, setProjectTypes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [svc, prj, port, tst, lds] = await Promise.all([
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('portfolio_images').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(500),
        ]);

        const leadsData = lds.data ?? [];
        setStats({
          services: svc.count ?? 0,
          projects: prj.count ?? 0,
          portfolio: port.count ?? 0,
          testimonials: tst.count ?? 0,
          leads: leadsData.length,
          pendingLeads: leadsData.filter(
            (l) => (l.status ?? 'new') === 'new' || (l.status ?? 'new') === 'in_progress'
          ).length,
        });

        setRecentLeads(
          leadsData.slice(0, 5).map((r) => ({
            ...r,
            status: (r.status ?? 'new') as LeadStatus,
          }))
        );

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const last30Days = Array(30).fill(0);
        const typesMap: Record<string, number> = {};

        leadsData.forEach(lead => {
          const created = new Date(lead.created_at || lead.createdAt || new Date().toISOString());
          if (created >= thirtyDaysAgo) {
            const dayDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 3600 * 24));
            if (dayDiff >= 0 && dayDiff < 30) {
              // index 0 is oldest, index 29 is today
              last30Days[29 - dayDiff]++;
            }
          }

          const pType: string = lead.project_type ?? lead.projectType ?? 'Demande générale';
          typesMap[pType] = (typesMap[pType] || 0) + 1;
        });

        setDailyCounts(last30Days);
        setProjectTypes(typesMap);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: 'Projects', value: stats?.projects, icon: FolderKanban, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { label: 'Contact Messages', value: stats?.leads, icon: Mail, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Pending Replies', value: stats?.pendingLeads, icon: Clock, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Trend', value: '+12%', icon: TrendingUp, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400' },
  ];

  const maxCount = Math.max(...dailyCounts, 1);
  const totalLeads = Object.values(projectTypes).reduce((a, b) => a + b, 0) || 1;
  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#eab308'];
  let currentPct = 0;
  const conicStops = Object.entries(projectTypes).map(([type, count], index) => {
    const pct = (count / totalLeads) * 100;
    const start = currentPct;
    const end = currentPct + pct;
    currentPct = end;
    const color = PIE_COLORS[index % PIE_COLORS.length];
    return `${color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your portfolio — Akrem Barboura.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {loading ? '—' : card.value}
            </p>
            <p className="text-sm text-slate-500 mt-1">{card.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Contact Messages (last 30 days)
          </h3>
          <div className="flex items-end justify-between h-48 gap-1 sm:gap-2 pb-2">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center"><span className="text-slate-400 text-sm animate-pulse">Loading...</span></div>
            ) : (
              dailyCounts.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-indigo-500/80 rounded-t hover:bg-indigo-500 transition-all duration-300 relative group"
                  style={{ height: `${(h / maxCount) * 100}%`, minHeight: h > 0 ? '4px' : '0' }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity hidden sm:block">
                    {h} message{h !== 1 ? 's' : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Messages by Subject Type
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-48">
            {loading ? (
              <div className="flex items-center justify-center w-full"><span className="text-slate-400 text-sm animate-pulse">Loading...</span></div>
            ) : Object.keys(projectTypes).length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <Users size={32} className="text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">No data yet</p>
              </div>
            ) : (
              <>
                <div
                  className="relative w-32 h-32 shrink-0 rounded-full shadow-inner"
                  style={{ background: `conic-gradient(${conicStops.length > 0 ? conicStops : '#e2e8f0 0% 100%'})` }}
                >
                  <div className="absolute inset-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow">
                    <Users size={24} className="text-slate-400" />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 w-full max-w-[220px] max-h-32 overflow-y-auto pr-1 overflow-x-hidden">
                  {Object.entries(projectTypes).sort((a, b) => b[1] - a[1]).map(([type, count], index) => {
                    const pct = Math.round((count / totalLeads) * 100);
                    const color = PIE_COLORS[index % PIE_COLORS.length];
                    return (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                          <span className="text-slate-600 dark:text-slate-300 truncate font-medium" title={type}>{type}</span>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 shrink-0">{pct}% ({count})</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Recent leads */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Recent Messages
          </h3>
          <Link
            to="/admin/leads"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse bg-slate-100 dark:bg-slate-700/50 rounded" />
            ))}
          </div>
        ) : recentLeads.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No messages yet.</p>
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {lead.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lead.project_type ?? lead.projectType ?? 'General inquiry'} · {timeAgo(lead.created_at || lead.createdAt || new Date().toISOString())}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${LEAD_STATUS_COLORS[lead.status]
                    }`}
                >
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
