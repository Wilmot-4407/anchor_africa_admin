import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  RefreshCw,
  MoreHorizontal,
  CalendarIcon,
  ChevronDown,
  TrendingUp,
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
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { fetchBlogPosts } from "../redux/actions/blog";
import { fetchTeamMembers } from "../redux/actions/team";
import { fetchServices } from "../redux/actions/services";
import { fetchFaq } from "../redux/actions/faqs";
import { AppDispatch, RootState } from "../redux/store";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

const COLORS = { primary: "#058789", secondary: "#ba9d20", accent: "#5fc4eb", emerald: "#10b981", rose: "#f43f5e", slate: "#94a3b8" };

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#243450] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      {label && <p className="font-semibold text-white mb-1.5">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
          {entry.name}: <strong className="text-white">{entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

export function DashboardView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, isLoading: blogLoading } = useSelector((state: RootState) => state.blog);
  const { members, isLoading: teamLoading } = useSelector((state: RootState) => state.team);
  const { services, isLoading: servicesLoading } = useSelector((state: RootState) => state.services);
  const { content: faqs, isLoading: faqsLoading } = useSelector((state: RootState) => state.faqs);

  const isLoading = blogLoading || teamLoading || servicesLoading || faqsLoading;

  useEffect(() => {
    dispatch(fetchBlogPosts());
    dispatch(fetchTeamMembers());
    dispatch(fetchServices());
    dispatch(fetchFaq());
  }, [dispatch]);

  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const activeMembers = members.filter((m) => m.isActive !== false).length;
  const publishedServices = services.filter((s) => s.isPublished).length;
  const draftServices = services.filter((s) => !s.isPublished).length;
  const totalFaqs = faqs?.reasons?.length ?? 0;

  const contentOverviewData = [
    { name: "Blog", Published: publishedPosts, Draft: draftPosts },
    { name: "Services", Published: publishedServices, Draft: draftServices },
    { name: "Team", Published: activeMembers, Draft: members.length - activeMembers },
  ];

  const servicesByType = (["clinic", "institute", "research"] as const)
    .map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: services.filter((s) => s.type === type).length,
      color: type === "clinic" ? COLORS.primary : type === "institute" ? COLORS.secondary : COLORS.accent,
    }))
    .filter((d) => d.value > 0);

  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      posts: posts.filter((p) => {
        const pd = new Date(p.createdAt);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      }).length,
    };
  });

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = user ? user.firstName || user.userName : "Admin";

  const statCards = [
    {
      label: "Total Blog Posts",
      value: posts.length,
      sub: `${publishedPosts} published · ${draftPosts} drafts`,
      trend: `+${publishedPosts}`,
      trendLabel: "published posts",
      loading: blogLoading,
    },
    {
      label: "Team Members",
      value: members.length,
      sub: `${activeMembers} active members`,
      trend: `+${activeMembers}`,
      trendLabel: "active this month",
      loading: teamLoading,
    },
    {
      label: "Active Services",
      value: publishedServices,
      sub: `${draftServices} drafts · ${services.length} total`,
      trend: `+${services.length}`,
      trendLabel: "services listed",
      loading: servicesLoading,
    },
    {
      label: "Total Content",
      value: posts.length + members.length + services.length + totalFaqs,
      sub: "across all sections",
      trend: `+${totalFaqs}`,
      trendLabel: "FAQs included",
      loading: isLoading,
    },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-slate-400 text-sm">
            {greeting}, {displayName} — here is today's content overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <span className="relative inline-flex w-3 h-3 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
                <span className="absolute inset-0 rounded-full bg-current" />
              </span>
              Syncing…
            </div>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1b2940] border border-white/10 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
            {new Date(new Date().setDate(new Date().getDate() + 29)).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1b2940] border border-white/10 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors">
            Monthly <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1b2940] border border-white/10 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors">
            All Sections <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </motion.div>

      {/* Stat cards — 4 per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="bg-[#1b2940] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex justify-between items-start mb-5">
              <p className="text-slate-400 text-sm font-medium leading-snug">{card.label}</p>
              <button className="text-slate-500 hover:text-white transition-colors p-0.5">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            {card.loading ? (
              <div className="space-y-3">
                <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-36 bg-white/5 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold text-white mb-3 tabular-nums">
                  {card.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {card.trend}
                  </span>
                  <span className="text-slate-500 text-sm">{card.trendLabel}</span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-[#1b2940] rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Content Status Overview</h3>
            <button
              onClick={() => navigate("/website")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm text-slate-200 hover:bg-white/10 transition-colors"
            >
              Manage <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          {isLoading ? (
            <div className="h-56 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={contentOverviewData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: "#ffffff08" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "12px", color: "#94a3b8" }} />
                <Bar dataKey="Published" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Draft" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="bg-[#1b2940] rounded-2xl p-6 border border-white/10 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Services by Type</h3>
          </div>
          {servicesLoading ? (
            <div className="flex-1 bg-white/5 rounded-xl animate-pulse" />
          ) : servicesByType.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">No services yet</div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={servicesByType} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {servicesByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white">{services.length}</span>
                  <span className="text-xs text-slate-400">Total</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {servicesByType.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Charts row 2: Monthly blog activity */}
      <motion.div variants={fadeUp} className="bg-[#1b2940] rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Blog Publishing Activity</h3>
            <p className="text-slate-400 text-sm mt-0.5">Posts created in the last 6 months</p>
          </div>
          <button
            onClick={() => navigate("/website")}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm text-slate-200 hover:bg-white/10 transition-colors"
          >
            Manage <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        {blogLoading ? (
          <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="blogGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<DarkTooltip />} cursor={{ stroke: "#ffffff18" }} />
              <Area type="monotone" dataKey="posts" name="Posts" stroke={COLORS.accent} strokeWidth={2.5} fill="url(#blogGrad)" dot={{ fill: COLORS.accent, strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Bottom row: recent posts + team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent blog posts */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-[#1b2940] rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Blog Posts</h3>
            <button
              onClick={() => navigate("/website")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm text-slate-200 hover:bg-white/10 transition-colors"
            >
              All posts <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          {blogLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-white/5 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">No blog posts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-white/10">
                    <th className="pb-4 font-medium">Title</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentPosts.map((post) => (
                    <tr key={post._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0 overflow-hidden">
                            {post.image ? (
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-slate-500 m-2" />
                            )}
                          </div>
                          <span className="font-medium text-white truncate max-w-[200px]">{post.title}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${post.status === "published" ? "bg-primary-light" : post.status === "scheduled" ? "bg-secondary" : "bg-slate-500"}`} />
                          <span className="text-slate-300 capitalize">{post.status}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-400">{post.category || "—"}</td>
                      <td className="py-4 text-right">
                        <span className="text-xs text-slate-500">{timeAgo(post.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Team members */}
        <motion.div variants={fadeUp} className="bg-[#1b2940] rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Team Members</h3>
            <button
              onClick={() => navigate("/website")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm text-slate-200 hover:bg-white/10 transition-colors"
            >
              Manage <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          {teamLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-white/5 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">No team members yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.slice(0, 6).map((member) => (
                <div key={member._id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center">
                    {member.image && member.image !== "default.png" ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-[11px] font-bold">
                        {member.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{member.title}</p>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${member.isActive !== false ? "bg-primary-light" : "bg-slate-600"}`}
                    title={member.isActive !== false ? "Active" : "Inactive"}
                  />
                </div>
              ))}
              {members.length > 6 && (
                <p className="text-xs text-slate-500 text-center pt-1">+{members.length - 6} more members</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
