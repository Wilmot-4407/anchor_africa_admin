import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Layers,
  Users,
  BookOpen,
  MessageCircleQuestion,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  ArrowUpRight,
  Clock,
  Star,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { fetchBlogPosts } from "../redux/actions/blog";
import { fetchTeamMembers } from "../redux/actions/team";
import { fetchServices } from "../redux/actions/services";
import { fetchFaq } from "../redux/actions/faqs";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigation } from "../context/NavigationContext";

// ── Animation variants ────────────────────────────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// ── Brand colours ─────────────────────────────────────────────────────────────
const CHART_COLORS = {
  primary: "#058789",
  secondary: "#f59e0b",
  accent: "#8b5cf6",
  emerald: "#10b981",
  rose: "#f43f5e",
  slate: "#94a3b8",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr?: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p
            key={i}
            style={{ color: entry.color }}
            className="flex items-center gap-1.5"
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: entry.color }}
            />
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>
          {payload[0].name}
        </p>
        <p className="text-slate-600">
          Count: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  subLabel,
  isLoading,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
  subLabel?: string;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3"
    >
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}
      >
        {icon}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-7 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <div>
          <p className="text-2xl font-bold text-slate-800 leading-none">
            {value}
          </p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
          {subLabel && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subLabel}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
  subtitle,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-sm text-primary hover:text-primary-dark font-semibold transition-colors flex items-center gap-1"
        >
          {action} <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="w-full bg-slate-50 rounded-xl animate-pulse"
      style={{ height }}
    />
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DashboardView() {
  const dispatch = useDispatch<AppDispatch>();
  const { setActiveSection } = useNavigation();

  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, isLoading: blogLoading } = useSelector(
    (state: RootState) => state.blog,
  );
  const { members, isLoading: teamLoading } = useSelector(
    (state: RootState) => state.team,
  );
  const { services, isLoading: servicesLoading } = useSelector(
    (state: RootState) => state.services,
  );
  const { content: faqs, isLoading: faqsLoading } = useSelector(
    (state: RootState) => state.faqs,
  );

  const isLoading =
    blogLoading || teamLoading || servicesLoading || faqsLoading;

  useEffect(() => {
    dispatch(fetchBlogPosts());
    dispatch(fetchTeamMembers());
    dispatch(fetchServices());
    dispatch(fetchFaq());
  }, [dispatch]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length;
  const featuredPosts = posts.filter((p) => p.isFeatured).length;

  const activeMembers = members.filter((m) => m.isActive !== false).length;
  const inactiveMembers = members.filter((m) => m.isActive === false).length;

  const publishedServices = services.filter((s) => s.isPublished).length;
  const draftServices = services.filter((s) => !s.isPublished).length;

  const totalFaqs = faqs?.reasons?.length ?? 0;

  // ── Chart data ─────────────────────────────────────────────────────────────

  // Content overview bar chart
  const contentOverviewData = [
    {
      name: "Blog",
      Published: publishedPosts,
      Draft: draftPosts,
      Scheduled: scheduledPosts,
    },
    {
      name: "Services",
      Published: publishedServices,
      Draft: draftServices,
      Scheduled: 0,
    },
    {
      name: "Team",
      Published: activeMembers,
      Draft: inactiveMembers,
      Scheduled: 0,
    },
  ];

  // Services by type - pie chart
  const servicesByType = (["clinic", "institute", "research"] as const)
    .map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: services.filter((s) => s.type === type).length,
      fill:
        type === "clinic"
          ? CHART_COLORS.primary
          : type === "institute"
            ? CHART_COLORS.secondary
            : CHART_COLORS.accent,
    }))
    .filter((d) => d.value > 0);

  // FAQ by type - pie chart
  const faqsByType = (
    [
      "General",
      "Services",
      "Treatment",
      "Pricing",
      "Insurance",
      "Other",
    ] as const
  )
    .map((type, i) => ({
      name: type,
      value: faqs?.reasons?.filter((r) => r.type === type).length ?? 0,
      fill: [
        CHART_COLORS.primary,
        CHART_COLORS.emerald,
        CHART_COLORS.secondary,
        CHART_COLORS.accent,
        CHART_COLORS.rose,
        CHART_COLORS.slate,
      ][i],
    }))
    .filter((d) => d.value > 0);

  // Blog posts by category
  const categoryMap: Record<string, number> = {};
  posts.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const blogByCategoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  // Monthly blog activity (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString("en-US", { month: "short" });
    const count = posts.filter((p) => {
      const pd = new Date(p.createdAt);
      return (
        pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear()
      );
    }).length;
    return { month: label, posts: count };
  });

  // ── Recent items ───────────────────────────────────────────────────────────
  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const recentMembers = [...members]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = user ? `${user.firstName || user.userName}` : "Admin";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto"
    >
      {/* ── Welcome header ── */}
      <motion.div
        variants={fadeUp}
        className="mb-8 flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {greeting}, {displayName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">{today}</p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <RefreshCw size={12} className="animate-spin" />
            Loading data…
          </div>
        )}
      </motion.div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
        <StatCard
          icon={<BookOpen size={18} />}
          iconBg="bg-primary/8"
          iconColor="text-primary"
          label="Total Blog Posts"
          value={posts.length}
          subLabel={`${publishedPosts} published · ${draftPosts} drafts`}
          isLoading={blogLoading}
        />
        <StatCard
          icon={<CheckCircle2 size={18} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Published Posts"
          value={publishedPosts}
          subLabel={`${featuredPosts} featured`}
          isLoading={blogLoading}
        />
        <StatCard
          icon={<Users size={18} />}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
          label="Team Members"
          value={members.length}
          subLabel={`${activeMembers} active`}
          isLoading={teamLoading}
        />
        <StatCard
          icon={<Briefcase size={18} />}
          iconBg="bg-accent/10"
          iconColor="text-accent"
          label="Services"
          value={services.length}
          subLabel={`${publishedServices} published · ${draftServices} drafts`}
          isLoading={servicesLoading}
        />
        <StatCard
          icon={<MessageCircleQuestion size={18} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="FAQs"
          value={totalFaqs}
          isLoading={faqsLoading}
        />
        <StatCard
          icon={<Layers size={18} />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Total Content"
          value={posts.length + members.length + services.length + totalFaqs}
          subLabel="across all sections"
          isLoading={isLoading}
        />
      </div>

      {/* ── Charts Row 1: Content Overview + Monthly Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Content Status Overview */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6"
        >
          <SectionHeader
            title="Content Status Overview"
            subtitle="Published vs Draft across all sections"
          />
          {isLoading ? (
            <ChartSkeleton height={220} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={contentOverviewData}
                barGap={4}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
                <Bar
                  dataKey="Published"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="Draft" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="Scheduled"
                  fill={CHART_COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Services by Type Donut */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <SectionHeader
            title="Services by Type"
            action="Manage"
            onAction={() => setActiveSection("website")}
          />
          {servicesLoading ? (
            <ChartSkeleton height={220} />
          ) : servicesByType.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-slate-300 text-sm">
              No services yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={servicesByType}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {servicesByType.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* ── Charts Row 2: Monthly Blog + FAQs by Type ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Blog Activity */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6"
        >
          <SectionHeader
            title="Blog Publishing Activity"
            subtitle="Posts created in the last 6 months"
            action="Manage"
            onAction={() => setActiveSection("website")}
          />
          {blogLoading ? (
            <ChartSkeleton height={200} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="blogGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ stroke: "#e2e8f0" }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  name="Posts"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2.5}
                  fill="url(#blogGradient)"
                  dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* FAQs by Type */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <SectionHeader
            title="FAQs by Topic"
            action="Manage"
            onAction={() => setActiveSection("website")}
          />
          {faqsLoading ? (
            <ChartSkeleton height={200} />
          ) : faqsByType.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-slate-300 text-sm">
              No FAQs yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={faqsByType}
                  cx="50%"
                  cy="42%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {faqsByType.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* ── Blog by Category Bar ── */}
      {blogByCategoryData.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
        >
          <SectionHeader
            title="Blog Posts by Category"
            subtitle="Distribution across content categories"
            action="Manage"
            onAction={() => setActiveSection("website")}
          />
          {blogLoading ? (
            <ChartSkeleton height={180} />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={blogByCategoryData}
                layout="vertical"
                barCategoryGap="25%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar
                  dataKey="count"
                  name="Posts"
                  fill={CHART_COLORS.primary}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      )}

      {/* ── Two-column layout: Recent Posts + Team/FAQs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Recent Blog Posts */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <SectionHeader
              title="Recent Blog Posts"
              action="Manage"
              onAction={() => setActiveSection("website")}
            />
            {blogLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 py-3 border-b border-slate-100 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <EmptyPlaceholder
                icon={<BookOpen size={24} className="text-slate-300" />}
                message="No blog posts yet"
                action="Add your first post"
                onAction={() => setActiveSection("website")}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={14} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {post.category && (
                          <span className="text-[11px] text-slate-400">
                            {post.category}
                          </span>
                        )}
                        <StatusDot status={post.status} />
                        {post.isFeatured && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-600">
                            <Star size={9} fill="currentColor" /> Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 flex-shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Content Health */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Content Health
            </h2>
            <div className="space-y-3">
              <HealthRow
                label="Posts published"
                count={publishedPosts}
                total={posts.length}
                color="bg-primary"
              />
              <HealthRow
                label="Services live"
                count={publishedServices}
                total={services.length}
                color="bg-emerald-500"
              />
              <HealthRow
                label="Active members"
                count={activeMembers}
                total={members.length}
                color="bg-secondary"
              />
              <HealthRow
                label="Featured posts"
                count={featuredPosts}
                total={posts.length}
                color="bg-amber-400"
              />
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Team + FAQs Summary */}
        <div className="space-y-6">
          {/* Team Members */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <SectionHeader
              title="Team Members"
              action="Manage"
              onAction={() => setActiveSection("website")}
            />
            {teamLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                      <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentMembers.length === 0 ? (
              <EmptyPlaceholder
                icon={<Users size={20} className="text-slate-300" />}
                message="No team members yet"
                action="Add a member"
                onAction={() => setActiveSection("website")}
              />
            ) : (
              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      {member.image && member.image !== "default.png" ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-[11px] font-bold">
                          {initials(member.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {member.title}
                      </p>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        member.isActive !== false
                          ? "bg-emerald-400"
                          : "bg-slate-300"
                      }`}
                      title={member.isActive !== false ? "Active" : "Inactive"}
                    />
                  </div>
                ))}
                {members.length > 5 && (
                  <p className="text-xs text-slate-400 pt-1 text-center">
                    +{members.length - 5} more members
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* FAQ Summary */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <SectionHeader
              title="FAQ Summary"
              action="Manage"
              onAction={() => setActiveSection("website")}
            />
            {faqsLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-slate-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : totalFaqs === 0 ? (
              <EmptyPlaceholder
                icon={
                  <MessageCircleQuestion size={20} className="text-slate-300" />
                }
                message="No FAQs yet"
                action="Add FAQs"
                onAction={() => setActiveSection("website")}
              />
            ) : (
              <div className="space-y-2">
                {(
                  [
                    "General",
                    "Services",
                    "Treatment",
                    "Pricing",
                    "Insurance",
                    "Other",
                  ] as const
                ).map((type) => {
                  const count =
                    faqs?.reasons?.filter((r) => r.type === type).length ?? 0;
                  if (count === 0) return null;
                  const typeStyles: Record<string, string> = {
                    General: "bg-slate-50 text-slate-600",
                    Services: "bg-primary/8 text-primary",
                    Treatment: "bg-emerald-50 text-emerald-700",
                    Pricing: "bg-secondary/10 text-secondary",
                    Insurance: "bg-amber-50 text-amber-700",
                    Other: "bg-rose-50 text-rose-700",
                  };
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50"
                    >
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeStyles[type]}`}
                      >
                        {type}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {count}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 mt-1">
                  <span className="text-xs font-bold text-primary">
                    Total FAQs
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {totalFaqs}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Minor sub-components ──────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-400",
    draft: "bg-slate-300",
    scheduled: "bg-amber-400",
  };
  return (
    <span className="flex items-center gap-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${map[status] || "bg-slate-300"}`}
      />
      <span className="text-[11px] text-slate-400 capitalize">{status}</span>
    </span>
  );
}

function EmptyPlaceholder({
  icon,
  message,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      {icon}
      <p className="text-sm text-slate-400">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors mt-1"
        >
          {action} →
        </button>
      )}
    </div>
  );
}

function HealthRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-semibold text-slate-700">
          {count}/{total}
          <span className="text-slate-400 font-normal ml-1">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
