import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Download,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  DollarSign,
  BarChart,
  Globe,
  FileText,
  Activity,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

// ─── Data ─────────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "Jul", appointments: 280, clients: 42, revenue: 28000 },
  { month: "Aug", appointments: 310, clients: 45, revenue: 31000 },
  { month: "Sep", appointments: 295, clients: 48, revenue: 29500 },
  { month: "Oct", appointments: 330, clients: 52, revenue: 33000 },
  { month: "Nov", appointments: 315, clients: 49, revenue: 31500 },
  { month: "Dec", appointments: 290, clients: 55, revenue: 29000 },
  { month: "Jan", appointments: 302, clients: 58, revenue: 30200 },
  { month: "Feb", appointments: 345, clients: 62, revenue: 34500 },
  { month: "Mar", appointments: 328, clients: 65, revenue: 32800 },
  { month: "Apr", appointments: 360, clients: 70, revenue: 36000 },
  { month: "May", appointments: 341, clients: 74, revenue: 34100 },
  { month: "Jun", appointments: 375, clients: 80, revenue: 37500 },
];

const weeklyAppointments = [
  { week: "W1", appointments: 32 }, { week: "W2", appointments: 28 },
  { week: "W3", appointments: 41 }, { week: "W4", appointments: 35 },
  { week: "W5", appointments: 38 }, { week: "W6", appointments: 45 },
  { week: "W7", appointments: 42 }, { week: "W8", appointments: 48 },
];

const serviceDistribution = [
  { name: "Neuropsych",  value: 45, color: "#5fc4eb" },
  { name: "CBT",         value: 38, color: "#058789" },
  { name: "Trauma",      value: 32, color: "#8b5cf6" },
  { name: "Addiction",   value: 28, color: "#f97316" },
  { name: "Telehealth",  value: 24, color: "#22d3ee" },
  { name: "Family",      value: 18, color: "#ba9d20" },
];

const trafficData = [
  { day: "Mon", visits: 245 }, { day: "Tue", visits: 312 },
  { day: "Wed", visits: 287 }, { day: "Thu", visits: 356 },
  { day: "Fri", visits: 298 }, { day: "Sat", visits: 189 },
  { day: "Sun", visits: 155 },
];

const clinicianData = [
  { name: "Dr. Adeyemi", caseload: 48, completed: 42 },
  { name: "Dr. Okafor",  caseload: 42, completed: 38 },
  { name: "Dr. Mensah",  caseload: 35, completed: 30 },
  { name: "Dr. Yusuf",   caseload: 28, completed: 25 },
];

const riskDistribution = [
  { name: "None",     value: 62, color: "#10b981" },
  { name: "Low",      value: 18, color: "#5fc4eb" },
  { name: "Moderate", value: 12, color: "#f97316" },
  { name: "High",     value: 8,  color: "#f43f5e" },
];

const completionTrend = [
  { week: "W1", rate: 92.1 }, { week: "W2", rate: 93.5 },
  { week: "W3", rate: 91.8 }, { week: "W4", rate: 94.2 },
  { week: "W5", rate: 95.0 }, { week: "W6", rate: 93.7 },
  { week: "W7", rate: 94.8 }, { week: "W8", rate: 96.1 },
];

const topPosts = [
  { title: "Mental Health Awareness in Lagos",          views: 1243, trend: "+15%" },
  { title: "Understanding Neuropsych Assessment",       views: 892,  trend: "+8%"  },
  { title: "Community Mental Health Impact Report",     views: 567,  trend: "+22%" },
  { title: "Trauma-Informed Care Best Practices",       views: 445,  trend: "+5%"  },
  { title: "Addiction Recovery in West Africa",         views: 312,  trend: "+12%" },
];

const blogData = [
  { month: "Jan", views: 4200, sessions: 3100 },
  { month: "Feb", views: 5100, sessions: 3800 },
  { month: "Mar", views: 4800, sessions: 3500 },
  { month: "Apr", views: 6200, sessions: 4600 },
  { month: "May", views: 5900, sessions: 4200 },
  { month: "Jun", views: 7100, sessions: 5300 },
];

const clinicianPerformance = [
  { metric: "On-time",    "Dr. Adeyemi": 95, "Dr. Okafor": 88, "Dr. Mensah": 92, "Dr. Yusuf": 90 },
  { metric: "Satisfaction", "Dr. Adeyemi": 92, "Dr. Okafor": 85, "Dr. Mensah": 89, "Dr. Yusuf": 94 },
  { metric: "Completion",  "Dr. Adeyemi": 98, "Dr. Okafor": 94, "Dr. Mensah": 91, "Dr. Yusuf": 96 },
  { metric: "Retention",  "Dr. Adeyemi": 87, "Dr. Okafor": 83, "Dr. Mensah": 88, "Dr. Yusuf": 91 },
  { metric: "Referrals",  "Dr. Adeyemi": 78, "Dr. Okafor": 72, "Dr. Mensah": 80, "Dr. Yusuf": 85 },
];

// ─── Chart defaults ────────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#1b2940",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#fff",
  },
  labelStyle: { color: "#94a3b8" },
};

const AXIS_PROPS = { fontSize: 11, fill: "#64748b" };
const GRID_COLOR = "rgba(255,255,255,0.06)";

type Tab = "overview" | "clinical" | "content" | "performance";

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
  color: string;
}) {
  return (
    <div className="bg-[#1b2940] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p
        className={`text-xs font-medium mt-1.5 ${
          trendUp === null
            ? "text-slate-500"
            : trendUp
              ? "text-emerald-400"
              : "text-red-400"
        }`}
      >
        {trend}
      </p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1b2940] rounded-2xl border border-white/10 p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function AnalyticsView() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [exporting, setExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: "#0f1a2a",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`anchor-africa-analytics-${dateRange}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview",    label: "Overview",    icon: <BarChart2 size={14} /> },
    { id: "clinical",    label: "Clinical",    icon: <Activity size={14} /> },
    { id: "content",     label: "Content",     icon: <FileText size={14} /> },
    { id: "performance", label: "Performance", icon: <TrendingUp size={14} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BarChart2 size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-slate-400 mt-0.5">Performance & engagement metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Date range */}
          <div className="flex items-center gap-0.5 bg-[#0f1a2a] rounded-xl p-0.5 border border-white/10">
            {[
              { value: "7d",  label: "7 days"  },
              { value: "30d", label: "30 days" },
              { value: "90d", label: "90 days" },
              { value: "1y",  label: "1 year"  },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setDateRange(r.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  dateRange === r.value
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Export PDF */}
          <button
            onClick={exportPDF}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0f1a2a] bg-accent-blue hover:bg-[#4ab0d6] rounded-xl transition-colors shadow-lg shadow-accent-blue/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
                <span className="absolute inset-0 rounded-full bg-current" />
              </span>
            ) : <Download size={15} />}
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* ── Section Tabs ── */}
      <div className="flex items-center gap-1 mb-6 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-accent-blue border-accent-blue"
                : "text-slate-400 border-transparent hover:text-white hover:border-white/20"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PDF-captured content ── */}
      <div ref={printRef} className="space-y-6">

        {/* ════════════ OVERVIEW ════════════ */}
        {activeTab === "overview" && (
          <>
            {/* KPI cards — row 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Calendar size={17} className="text-blue-400" />}      label="Total Appointments" value="309"   trend="+18% from last period"  trendUp={true}  color="bg-blue-500/10" />
              <StatCard icon={<CheckCircle2 size={17} className="text-emerald-400" />} label="Completion Rate"    value="94.2%" trend="+2.1% from last period"  trendUp={true}  color="bg-emerald-500/10" />
              <StatCard icon={<Clock size={17} className="text-purple-400" />}         label="Avg Session"        value="58 min" trend="No change from last period" trendUp={null}  color="bg-purple-500/10" />
              <StatCard icon={<Users size={17} className="text-amber-400" />}           label="New Clients"        value="34"    trend="+12% from last period"  trendUp={true}  color="bg-amber-500/10" />
            </div>

            {/* KPI cards — row 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<DollarSign size={17} className="text-primary" />}        label="Revenue (Month)"    value="₦34.5M" trend="+9% from last period"  trendUp={true}  color="bg-primary/10" />
              <StatCard icon={<Activity size={17} className="text-rose-400" />}          label="Client Retention"   value="87.3%"  trend="+1.4% from last period" trendUp={true}  color="bg-rose-500/10" />
              <StatCard icon={<Globe size={17} className="text-cyan-400" />}             label="Blog Views"         value="7,102"  trend="+31% from last period"  trendUp={true}  color="bg-cyan-500/10" />
              <StatCard icon={<BarChart size={17} className="text-indigo-400" />}        label="Avg Wait Time"      value="2.4 days" trend="-0.3 days improvement"  trendUp={true}  color="bg-indigo-500/10" />
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
              <ChartCard title="Monthly Appointments & Revenue" subtitle="12-month trend">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="aptGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#5fc4eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#5fc4eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                    <XAxis dataKey="month" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="appointments" stroke="#5fc4eb" fill="url(#aptGrad)" strokeWidth={2} name="Appointments" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Service Distribution" subtitle="By session type">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {serviceDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ChartCard title="Client Growth" subtitle="New clients per month">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyData}>
                    <defs>
                      <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#058789" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#058789" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                    <XAxis dataKey="month" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="clients" stroke="#058789" strokeWidth={2.5} dot={{ fill: "#058789", r: 3 }} name="New Clients" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Website Traffic" subtitle="Daily visitor count this week">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}  />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                    <XAxis dataKey="day" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="visits" stroke="#8b5cf6" fill="url(#trafficGrad)" strokeWidth={2} name="Visits" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Most Requested Services */}
              <ChartCard title="Most Requested Services" subtitle="Session count by type">
                <div className="space-y-3">
                  {serviceDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-28 truncate flex-shrink-0">{item.name}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(item.value / 45) * 100}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-white w-7 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Top Blog Posts */}
              <ChartCard title="Top Blog Posts" subtitle="By total views this period">
                <div className="space-y-3">
                  {topPosts.map((post, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold text-slate-600 w-5">{i + 1}</span>
                        <p className="text-xs text-slate-300 truncate">{post.title}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-slate-500">{post.views.toLocaleString()}</span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp size={10} /> {post.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </>
        )}

        {/* ════════════ CLINICAL ════════════ */}
        {activeTab === "clinical" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users size={17} className="text-blue-400" />}         label="Active Clients"      value="153"   trend="+8 this month"     trendUp={true}  color="bg-blue-500/10" />
              <StatCard icon={<CheckCircle2 size={17} className="text-emerald-400" />} label="Sessions This Month" value="127"   trend="vs 110 last month"  trendUp={true}  color="bg-emerald-500/10" />
              <StatCard icon={<Activity size={17} className="text-rose-400" />}        label="High Risk Clients"   value="8"     trend="-2 from last month"  trendUp={true}  color="bg-rose-500/10" />
              <StatCard icon={<Clock size={17} className="text-purple-400" />}         label="Avg Sessions / Client" value="4.2" trend="+0.3 improvement"   trendUp={true}  color="bg-purple-500/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Clinician Caseload */}
              <ChartCard title="Clinician Caseload" subtitle="Total vs completed sessions">
                <ResponsiveContainer width="100%" height={240}>
                  <ReBarChart data={clinicianData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
                    <XAxis type="number" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ ...AXIS_PROPS, width: 90 }} axisLine={false} tickLine={false} width={95} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="caseload"  fill="rgba(95,196,235,0.2)"  radius={[0, 4, 4, 0]} name="Total" />
                    <Bar dataKey="completed" fill="#5fc4eb"               radius={[0, 4, 4, 0]} name="Completed" />
                  </ReBarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Patient Risk Distribution */}
              <ChartCard title="Patient Risk Distribution" subtitle="Current caseload risk profile">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {riskDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Weekly appointments bar */}
            <ChartCard title="Appointments per Week" subtitle="8-week rolling view">
              <ResponsiveContainer width="100%" height={220}>
                <ReBarChart data={weeklyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                  <XAxis dataKey="week" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="appointments" fill="#058789" radius={[4, 4, 0, 0]} name="Appointments" />
                </ReBarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {/* ════════════ CONTENT ════════════ */}
        {activeTab === "content" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<FileText size={17} className="text-purple-400" />}  label="Blog Posts Published" value="24"      trend="+3 this month"   trendUp={true}  color="bg-purple-500/10" />
              <StatCard icon={<Globe size={17} className="text-cyan-400" />}        label="Total Page Views"     value="42,180"  trend="+31% this month" trendUp={true}  color="bg-cyan-500/10" />
              <StatCard icon={<Users size={17} className="text-blue-400" />}        label="Unique Visitors"      value="18,540"  trend="+22% this month" trendUp={true}  color="bg-blue-500/10" />
              <StatCard icon={<Clock size={17} className="text-amber-400" />}       label="Avg Read Time"        value="4.2 min" trend="+0.6 min longer"  trendUp={true}  color="bg-amber-500/10" />
            </div>

            <ChartCard title="Blog Views & Sessions" subtitle="Monthly performance">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={blogData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#5fc4eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5fc4eb" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                  <XAxis dataKey="month" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{v}</span>} />
                  <Area type="monotone" dataKey="views"    stroke="#8b5cf6" fill="url(#viewsGrad)"    strokeWidth={2} name="Page Views" />
                  <Area type="monotone" dataKey="sessions" stroke="#5fc4eb" fill="url(#sessionsGrad)" strokeWidth={2} name="Sessions" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Blog Posts" subtitle="By total views">
              <div className="space-y-3">
                {topPosts.map((post, i) => (
                  <div key={i} className="flex items-center gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: `hsl(${200 + i * 25}, 70%, 50%)` }}
                    >
                      {i + 1}
                    </div>
                    <p className="flex-1 text-sm text-slate-300 truncate min-w-0">{post.title}</p>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(post.views / 1243) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-16 text-right">{post.views.toLocaleString()} views</span>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 w-14">
                        <TrendingUp size={10} /> {post.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </>
        )}

        {/* ════════════ PERFORMANCE ════════════ */}
        {activeTab === "performance" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<CheckCircle2 size={17} className="text-emerald-400" />} label="Completion Rate"       value="94.2%"  trend="+2.1% improvement"  trendUp={true}  color="bg-emerald-500/10" />
              <StatCard icon={<Clock size={17} className="text-blue-400" />}            label="Avg Response Time"     value="1.8 hrs" trend="-0.4h faster"       trendUp={true}  color="bg-blue-500/10" />
              <StatCard icon={<TrendingUp size={17} className="text-primary" />}        label="Client Satisfaction"   value="4.7 / 5" trend="+0.2 from last qtr"  trendUp={true}  color="bg-primary/10" />
              <StatCard icon={<Activity size={17} className="text-amber-400" />}        label="Cancellation Rate"     value="5.8%"   trend="-0.5% improvement"   trendUp={true}  color="bg-amber-500/10" />
            </div>

            {/* Completion rate trend */}
            <ChartCard title="Completion Rate Trend" subtitle="8-week rolling average (%)">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                  <XAxis dataKey="week" tick={AXIS_PROPS} axisLine={false} tickLine={false} />
                  <YAxis domain={[88, 100]} tick={AXIS_PROPS} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Completion Rate"]} />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3 }} name="Completion Rate" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Clinician performance radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ChartCard title="Clinician Performance Radar" subtitle="Multi-metric comparison">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={clinicianPerformance}>
                    <PolarGrid stroke={GRID_COLOR} />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Radar name="Dr. Adeyemi" dataKey="Dr. Adeyemi" stroke="#5fc4eb" fill="#5fc4eb" fillOpacity={0.15} />
                    <Radar name="Dr. Okafor"  dataKey="Dr. Okafor"  stroke="#058789" fill="#058789" fillOpacity={0.15} />
                    <Radar name="Dr. Mensah"  dataKey="Dr. Mensah"  stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                    <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{v}</span>} />
                    <Tooltip {...TOOLTIP_STYLE} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Clinician stats table */}
              <ChartCard title="Clinician Stats Summary" subtitle="Current period">
                <div className="space-y-0">
                  <div className="grid grid-cols-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-2 border-b border-white/[0.06]">
                    <span>Clinician</span>
                    <span className="text-center">Caseload</span>
                    <span className="text-center">Done</span>
                    <span className="text-center">Rate</span>
                  </div>
                  {clinicianData.map((c) => (
                    <div key={c.name} className="grid grid-cols-4 py-3 border-b border-white/[0.05] last:border-0 items-center">
                      <span className="text-sm text-white font-medium">{c.name}</span>
                      <span className="text-xs text-slate-400 text-center">{c.caseload}</span>
                      <span className="text-xs text-slate-400 text-center">{c.completed}</span>
                      <span className="text-xs font-semibold text-emerald-400 text-center">
                        {Math.round((c.completed / c.caseload) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
