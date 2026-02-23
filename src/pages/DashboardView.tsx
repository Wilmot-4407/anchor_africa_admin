import React, { Children } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  UsersIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  ArrowUpRightIcon,
  PlusIcon,
  FileTextIcon,
  BarChart3Icon,
  ImageIcon,
  ClockIcon,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
const stagger = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
export function DashboardView() {
  const { setActiveSection, setActiveSubsection } = useNavigation();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
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
      {/* Welcome */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-semibold text-heading">
          {greeting}, Dr. Adeyemi
        </h1>
        <p className="text-sm text-slate-500 mt-1">{today}</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          icon={<CalendarIcon size={20} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Today's Appointments"
          value="8"
          change="+12%"
          changeUp
        />

        <StatCard
          icon={<UsersIcon size={20} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Active Clients"
          value="247"
          change="+5%"
          changeUp
        />

        <StatCard
          icon={<MessageSquareIcon size={20} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Unread Messages"
          value="3"
        />

        <StatCard
          icon={<TrendingUpIcon size={20} />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Website Visits (Week)"
          value="1,842"
          change="+23%"
          changeUp
        />
      </motion.div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - wider */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-heading">
                Upcoming Appointments
              </h2>
              <button
                onClick={() => setActiveSection("appointments")}
                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors flex items-center gap-1"
              >
                View all <ArrowUpRightIcon size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <AppointmentRow
                time="9:00 AM"
                client="Amara Nwosu"
                service="Neuropsych Assessment"
                clinician="Dr. Okafor"
                status="confirmed"
              />

              <AppointmentRow
                time="10:30 AM"
                client="Chidinma Eze"
                service="CBT Session"
                clinician="Dr. Adeyemi"
                status="confirmed"
              />

              <AppointmentRow
                time="12:00 PM"
                client="Oluwaseun Bakare"
                service="Trauma-Focused Therapy"
                clinician="Dr. Mensah"
                status="pending"
              />

              <AppointmentRow
                time="2:00 PM"
                client="Fatima Bello"
                service="Addiction Counseling"
                clinician="Dr. Okafor"
                status="confirmed"
              />

              <AppointmentRow
                time="3:30 PM"
                client="Emeka Obi"
                service="Telehealth Session"
                clinician="Dr. Adeyemi"
                status="pending"
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          {/* <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <QuickAction
              icon={<PlusIcon size={18} />}
              label="New Appointment"
              onClick={() => setActiveSection("appointments")}
            />

            <QuickAction
              icon={<FileTextIcon size={18} />}
              label="New Blog Post"
              onClick={() => {
                setActiveSection("website");
                setActiveSubsection("blog");
              }}
            />

            <QuickAction
              icon={<BarChart3Icon size={18} />}
              label="View Analytics"
              onClick={() => setActiveSection("analytics")}
            />

            <QuickAction
              icon={<ImageIcon size={18} />}
              label="Upload Media"
              onClick={() => {
                setActiveSection("website");
                setActiveSubsection("media-library");
              }}
            />
          </motion.div> */}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-heading">
                Recent Activity
              </h2>
              <button
                onClick={() => setActiveSection("activity-log")}
                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              <ActivityItem
                avatar="NO"
                name="Dr. Okafor"
                action="completed session with Amara Nwosu"
                time="25 min ago"
              />

              <ActivityItem
                avatar="DA"
                name="Dr. Adeyemi"
                action='published blog post "Mental Health Awareness in Lagos"'
                time="1 hour ago"
              />

              <ActivityItem
                avatar="CE"
                name="Chidinma Eze"
                action="registered as a new client"
                time="2 hours ago"
              />

              <ActivityItem
                avatar="MM"
                name="Dr. Mensah"
                action="updated Trauma Counseling program page"
                time="3 hours ago"
              />

              <ActivityItem
                avatar="OB"
                name="Oluwaseun Bakare"
                action="rescheduled appointment to Thursday"
                time="4 hours ago"
              />
            </div>
          </motion.div>

          {/* Mini Calendar */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-heading mb-4">
              Today's Schedule
            </h2>
            <div className="space-y-2">
              <MiniCalSlot
                time="9:00"
                label="Neuropsych Assessment"
                color="bg-blue-500"
              />

              <MiniCalSlot
                time="10:30"
                label="CBT Session"
                color="bg-emerald-500"
              />

              <MiniCalSlot
                time="12:00"
                label="Trauma Therapy"
                color="bg-purple-500"
              />

              <MiniCalSlot
                time="2:00"
                label="Addiction Counseling"
                color="bg-orange-500"
              />

              <MiniCalSlot time="3:30" label="Telehealth" color="bg-teal-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
/* Sub-components */
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  change,
  changeUp,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  change?: string;
  changeUp?: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.15,
      }}
      className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${changeUp ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}
          >
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-heading">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}
function AppointmentRow({
  time,
  client,
  service,
  clinician,
  status,
}: {
  time: string;
  client: string;
  service: string;
  clinician: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}) {
  const statusStyles = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-slate-50 text-slate-600 border-slate-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
      <span className="text-sm font-medium text-heading w-20 flex-shrink-0">
        {time}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-heading truncate">{client}</p>
        <p className="text-xs text-slate-500 truncate">
          {service} · {clinician}
        </p>
      </div>
      <span
        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyles[status]}`}
      >
        {status}
      </span>
    </div>
  );
}
function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all text-center group"
    >
      <span className="text-slate-400 group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="text-xs font-medium text-slate-600 group-hover:text-heading transition-colors">
        {label}
      </span>
    </button>
  );
}
function ActivityItem({
  avatar,
  name,
  action,
  time,
}: {
  avatar: string;
  name: string;
  action: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-heading">
          <span className="font-medium">{name}</span>{" "}
          <span className="text-slate-500">{action}</span>
        </p>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          <ClockIcon size={10} /> {time}
        </p>
      </div>
    </div>
  );
}
function MiniCalSlot({
  time,
  label,
  color,
}: {
  time: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs font-medium text-slate-400 w-10">{time}</span>
      <div className={`w-1 h-6 rounded-full ${color}`} />
      <span className="text-sm text-heading">{label}</span>
    </div>
  );
}
