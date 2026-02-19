import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  DownloadIcon,
  TrendingUpIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area } from
'recharts';
const appointmentData = [
{
  week: 'Week 1',
  appointments: 32
},
{
  week: 'Week 2',
  appointments: 28
},
{
  week: 'Week 3',
  appointments: 41
},
{
  week: 'Week 4',
  appointments: 35
},
{
  week: 'Week 5',
  appointments: 38
},
{
  week: 'Week 6',
  appointments: 45
},
{
  week: 'Week 7',
  appointments: 42
},
{
  week: 'Week 8',
  appointments: 48
}];

const serviceData = [
{
  service: 'Neuropsych Assessment',
  count: 45
},
{
  service: 'CBT Sessions',
  count: 38
},
{
  service: 'Trauma Therapy',
  count: 32
},
{
  service: 'Addiction Counseling',
  count: 28
},
{
  service: 'Telehealth',
  count: 24
},
{
  service: 'Family Counseling',
  count: 18
}];

const trafficData = [
{
  day: 'Mon',
  visits: 245
},
{
  day: 'Tue',
  visits: 312
},
{
  day: 'Wed',
  visits: 287
},
{
  day: 'Thu',
  visits: 356
},
{
  day: 'Fri',
  visits: 298
},
{
  day: 'Sat',
  visits: 189
},
{
  day: 'Sun',
  visits: 155
}];

const topPosts = [
{
  title: 'Mental Health Awareness in Lagos',
  views: 1243,
  trend: '+15%'
},
{
  title: 'Understanding Neuropsych Assessment',
  views: 892,
  trend: '+8%'
},
{
  title: 'Community Mental Health Impact Report',
  views: 567,
  trend: '+22%'
},
{
  title: 'Trauma-Informed Care Best Practices',
  views: 445,
  trend: '+5%'
},
{
  title: 'Addiction Recovery in West Africa',
  views: 312,
  trend: '+12%'
}];

const stagger = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35
    }
  }
};
export function AnalyticsView() {
  const [dateRange, setDateRange] = useState('30d');
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto">

      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {[
            {
              value: '7d',
              label: '7 days'
            },
            {
              value: '30d',
              label: '30 days'
            },
            {
              value: '90d',
              label: '90 days'
            }].
            map((range) =>
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${dateRange === range.value ? 'bg-white shadow-sm text-navy-950' : 'text-slate-400 hover:text-slate-600'}`}>

                {range.label}
              </button>
            )}
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 border border-border rounded-lg hover:bg-slate-50 transition-colors">
            <DownloadIcon size={15} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <CalendarIcon size={18} />
            </div>
            <span className="text-xs text-slate-500">Total Appointments</span>
          </div>
          <p className="text-2xl font-semibold text-navy-950">309</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            +18% from last period
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircleIcon size={18} />
            </div>
            <span className="text-xs text-slate-500">Completion Rate</span>
          </div>
          <p className="text-2xl font-semibold text-navy-950">94.2%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            +2.1% from last period
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ClockIcon size={18} />
            </div>
            <span className="text-xs text-slate-500">Avg Session Duration</span>
          </div>
          <p className="text-2xl font-semibold text-navy-950">58 min</p>
          <p className="text-xs text-slate-400 font-medium mt-1">No change</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <UsersIcon size={18} />
            </div>
            <span className="text-xs text-slate-500">New Clients</span>
          </div>
          <p className="text-2xl font-semibold text-navy-950">34</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            +12% from last period
          </p>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Appointments per week */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-border p-6">

          <h2 className="text-sm font-semibold text-navy-950 mb-4">
            Appointments per Week
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={appointmentData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e7e5e3"
                vertical={false} />

              <XAxis
                dataKey="week"
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8'
                }}
                axisLine={false}
                tickLine={false} />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8'
                }}
                axisLine={false}
                tickLine={false} />

              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e7e5e3',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }} />

              <Bar
                dataKey="appointments"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]} />

            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Website Traffic */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-border p-6">

          <h2 className="text-sm font-semibold text-navy-950 mb-4">
            Website Traffic
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e7e5e3"
                vertical={false} />

              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8'
                }}
                axisLine={false}
                tickLine={false} />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8'
                }}
                axisLine={false}
                tickLine={false} />

              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e7e5e3',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }} />

              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2} />

            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Requested Services */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-border p-6">

          <h2 className="text-sm font-semibold text-navy-950 mb-4">
            Most Requested Services
          </h2>
          <div className="space-y-3">
            {serviceData.map((item) =>
            <div key={item.service} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-40 truncate flex-shrink-0">
                  {item.service}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{
                    width: `${item.count / 45 * 100}%`
                  }} />

                </div>
                <span className="text-xs font-medium text-navy-950 w-8 text-right">
                  {item.count}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Blog Posts */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-border p-6">

          <h2 className="text-sm font-semibold text-navy-950 mb-4">
            Top Blog Posts
          </h2>
          <div className="space-y-3">
            {topPosts.map((post, i) =>
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">

                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 w-5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-navy-950 truncate">{post.title}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-500">
                    {post.views.toLocaleString()} views
                  </span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <TrendingUpIcon size={10} /> {post.trend}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>);

}