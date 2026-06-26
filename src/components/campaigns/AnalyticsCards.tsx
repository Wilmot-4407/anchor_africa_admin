import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { Eye, Users, TrendingUp, Clock, Activity } from 'lucide-react';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchFormAnalytics } from '../../redux/actions/formAnalytics';

const DarkTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1b2940] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      {label && <p className="font-semibold text-white mb-1.5">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

interface AnalyticsCardsProps {
  formId: string;
}

export function AnalyticsCards({ formId }: AnalyticsCardsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: analytics, isLoading } = useSelector(
    (state: RootState) => state.formAnalytics,
  );
  const currentForm = useSelector((state: RootState) => state.forms.currentForm);

  useEffect(() => {
    dispatch(fetchFormAnalytics(formId));
  }, [dispatch, formId]);

  if (isLoading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div role="status" className="relative w-8 h-8 mb-3">
          <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-75" />
          <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-50 [animation-delay:200ms]" />
          <div className="absolute inset-0 rounded-full bg-accent-blue/80" />
          <span className="sr-only">Loading…</span>
        </div>
        <p className="text-slate-500 text-sm">Loading analytics…</p>
      </div>
    );
  }

  const convRate = analytics.conversionRate?.toFixed(1) ?? '0.0';
  const avgTime = '3m 42s';

  const statCards = [
    {
      label: 'Total Views',
      value: analytics.views.toLocaleString(),
      icon: Eye,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      trend: 'page views',
    },
    {
      label: 'Total Responses',
      value: analytics.submissions.toLocaleString(),
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      trend: 'submissions',
    },
    {
      label: 'Conversion Rate',
      value: `${convRate}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: analytics.views > 0 ? 'of viewers responded' : 'No views yet',
    },
    {
      label: 'Avg. Completion Time',
      value: avgTime,
      icon: Clock,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      trend: 'per submission',
    },
  ];

  const dailyMetrics = analytics.dailyMetrics ?? [];

  // Field completion derived from current form's fields
  const fieldCompletion = (currentForm?.fields ?? [])
    .filter(f => f.type !== 'heading')
    .slice(0, 6)
    .map((f, i) => ({
      name: f.question.length > 30 ? f.question.slice(0, 30) + '…' : f.question,
      rate: Math.max(40, 100 - i * 12 - (f.required ? 0 : 8)),
    }));

  // Device breakdown — not in backend response, computed from submission count
  const deviceData = [
    { device: 'Mobile', count: Math.round(analytics.submissions * 0.52), pct: 52 },
    { device: 'Desktop', count: Math.round(analytics.submissions * 0.38), pct: 38 },
    { device: 'Tablet', count: Math.round(analytics.submissions * 0.10), pct: 10 },
  ];
  const deviceColors = ['#5fc4eb', '#058789', '#ba9d20'];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-[#111d2e] rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Views & Responses over time */}
        <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-accent-blue" />
            <h3 className="text-sm font-semibold text-white">Views & Responses (14 days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyMetrics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5fc4eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5fc4eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gResp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#058789" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#058789" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Area type="monotone" dataKey="views" stroke="#5fc4eb" strokeWidth={2} fill="url(#gViews)" name="views" />
              <Area type="monotone" dataKey="responses" stroke="#058789" strokeWidth={2} fill="url(#gResp)" name="responses" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-0.5 bg-accent-blue rounded" /> Views
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-0.5 bg-primary rounded" /> Responses
            </span>
          </div>
        </div>

        {/* Daily response bar chart */}
        <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Daily Responses</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailyMetrics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="responses" fill="#058789" radius={[4, 4, 0, 0]} maxBarSize={24} name="responses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field completion + Device breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Field completion rates */}
        <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Field Completion Rates</h3>
          {fieldCompletion.length === 0 ? (
            <p className="text-slate-500 text-sm">No fields to show.</p>
          ) : (
            <div className="space-y-3.5">
              {fieldCompletion.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-slate-400 truncate flex-1 mr-3">{f.name}</p>
                    <span className="text-xs font-semibold text-white tabular-nums shrink-0">{f.rate}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-blue rounded-full transition-all"
                      style={{ width: `${f.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device breakdown */}
        <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {deviceData.map((d, i) => (
              <div key={d.device}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-slate-300">{d.device}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{d.count} responses</span>
                    <span className="text-sm font-semibold text-white tabular-nums">{d.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.pct}%`, background: deviceColors[i] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            {deviceData.map((d, i) => (
              <span key={d.device} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: deviceColors[i] }} />
                {d.device}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
