import React, { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  VideoIcon,
  CalendarIcon,
} from "lucide-react";

type ViewMode = "day" | "week" | "month";
type AppointmentType = "neuropsych" | "counseling" | "addiction" | "trauma" | "telehealth";
type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Appointment {
  id: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  type: AppointmentType;
  typeLabel: string;
  clinician: string;
  day: number;
  startHour: number;
  duration: number;
  status: AppointmentStatus;
  notes: string;
  paymentStatus: string;
  sessionLink?: string;
}

const typeColors: Record<AppointmentType, { bg: string; border: string; text: string; dot: string }> = {
  neuropsych: { bg: "bg-blue-500/15",    border: "border-blue-500/30",    text: "text-blue-300",    dot: "bg-blue-500" },
  counseling: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-500" },
  addiction:  { bg: "bg-orange-500/15",  border: "border-orange-500/30",  text: "text-orange-300",  dot: "bg-orange-500" },
  trauma:     { bg: "bg-purple-500/15",  border: "border-purple-500/30",  text: "text-purple-300",  dot: "bg-purple-500" },
  telehealth: { bg: "bg-teal-500/15",    border: "border-teal-500/30",    text: "text-teal-300",    dot: "bg-teal-500" },
};

const statusStyles: Record<AppointmentStatus, string> = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-white/5 text-slate-400 border-white/10",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const appointments: Appointment[] = [
  { id: "1", client: "Amara Nwosu",      clientEmail: "amara@email.com",   clientPhone: "+234 801 234 5678", type: "neuropsych", typeLabel: "Neuropsych Assessment",     clinician: "Dr. Okafor",  day: 0, startHour: 9,  duration: 2,   status: "confirmed", notes: "Initial comprehensive assessment. Client reports memory concerns.", paymentStatus: "Paid" },
  { id: "2", client: "Chidinma Eze",     clientEmail: "chidinma@email.com", clientPhone: "+234 802 345 6789", type: "counseling", typeLabel: "CBT Session",               clinician: "Dr. Adeyemi", day: 0, startHour: 10, duration: 1,   status: "confirmed", notes: "Session 4 of 12. Focus on cognitive restructuring.", paymentStatus: "Paid" },
  { id: "3", client: "Oluwaseun Bakare", clientEmail: "seun@email.com",     clientPhone: "+234 803 456 7890", type: "trauma",     typeLabel: "Trauma-Focused Therapy",    clinician: "Dr. Mensah",  day: 1, startHour: 11, duration: 1.5, status: "pending",   notes: "Follow-up session. EMDR protocol.", paymentStatus: "Pending" },
  { id: "4", client: "Fatima Bello",     clientEmail: "fatima@email.com",   clientPhone: "+234 804 567 8901", type: "addiction",  typeLabel: "Addiction Counseling",      clinician: "Dr. Okafor",  day: 1, startHour: 14, duration: 1,   status: "confirmed", notes: "Week 8 check-in. Discuss relapse prevention strategies.", paymentStatus: "Paid" },
  { id: "5", client: "Emeka Obi",        clientEmail: "emeka@email.com",    clientPhone: "+234 805 678 9012", type: "telehealth", typeLabel: "Telehealth Session",        clinician: "Dr. Adeyemi", day: 2, startHour: 15, duration: 1,   status: "pending",   notes: "Remote follow-up. Client is traveling.", paymentStatus: "Paid", sessionLink: "https://meet.anchor.org/session-5" },
  { id: "6", client: "Ngozi Adichie",    clientEmail: "ngozi@email.com",    clientPhone: "+234 806 789 0123", type: "counseling", typeLabel: "Family Counseling",         clinician: "Dr. Mensah",  day: 3, startHour: 9,  duration: 1.5, status: "confirmed", notes: "Joint session with spouse.", paymentStatus: "Pending" },
  { id: "7", client: "Ibrahim Musa",     clientEmail: "ibrahim@email.com",  clientPhone: "+234 807 890 1234", type: "neuropsych", typeLabel: "Neuropsych Follow-up",      clinician: "Dr. Okafor",  day: 3, startHour: 13, duration: 1,   status: "confirmed", notes: "Review assessment results.", paymentStatus: "Paid" },
  { id: "8", client: "Aisha Abdullahi", clientEmail: "aisha@email.com",    clientPhone: "+234 808 901 2345", type: "trauma",     typeLabel: "Trauma Assessment",         clinician: "Dr. Adeyemi", day: 4, startHour: 10, duration: 2,   status: "pending",   notes: "Initial trauma assessment. Referred by Dr. Yusuf.", paymentStatus: "Pending" },
];

const hours = Array.from({ length: 11 }, (_, i) => i + 8);
const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5";
const inputCls = "w-full px-3 py-2.5 text-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/30 bg-[#0f1a2a] text-white placeholder:text-slate-500";
const selectCls = `${inputCls}`;

export function AppointmentsView() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const currentDate = new Date();
  const todayDay = (currentDate.getDay() + 6) % 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-sm text-slate-400 mt-1">February 2026</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-[#0f1a2a] rounded-xl p-0.5 border border-white/10">
            {(["day", "week", "month"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  viewMode === mode
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <ChevronLeftIcon size={17} />
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Today
            </button>
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <ChevronRightIcon size={17} />
            </button>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0f1a2a] bg-accent-blue hover:bg-[#4ab0d6] rounded-xl transition-colors shadow-lg shadow-accent-blue/20"
          >
            <PlusIcon size={16} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Type Legend */}
      <div className="flex items-center gap-5 mb-4 flex-shrink-0 flex-wrap">
        {Object.entries(typeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <span className="text-xs text-slate-500 capitalize">
              {type === "neuropsych" ? "Neuropsych" : type}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* ── Calendar Grid ── */}
        <div className="flex-1 bg-[#1b2940] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          {/* Day Headers */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-white/10 flex-shrink-0">
            <div className="p-2" />
            {shortDays.map((day, i) => (
              <div
                key={day}
                className={`p-3 text-center border-l border-white/[0.06] ${i === todayDay ? "bg-accent-blue/[0.06]" : ""}`}
              >
                <p className="text-xs text-slate-500 font-medium">{day}</p>
                <p className={`text-lg font-bold mt-0.5 ${i === todayDay ? "text-accent-blue" : "text-white"}`}>
                  {10 + i}
                </p>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="flex-1 overflow-y-auto scrollbar-brand">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
              {/* Now indicator */}
              <div
                className="absolute left-[60px] right-0 h-0.5 bg-red-500 z-10 pointer-events-none"
                style={{ top: `${(currentDate.getHours() - 8 + currentDate.getMinutes() / 60) * 64}px` }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 -mt-[3px] -ml-1" />
              </div>

              {hours.map((hour) => (
                <Fragment key={hour}>
                  <div className="h-16 flex items-start justify-end pr-2 border-b border-white/[0.04]">
                    <span className="text-[11px] text-slate-600 -mt-2">
                      {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </span>
                  </div>
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const dayApts = appointments.filter((a) => a.day === dayIdx && a.startHour === hour);
                    return (
                      <div
                        key={dayIdx}
                        className={`h-16 border-l border-b border-white/[0.04] relative ${
                          dayIdx === todayDay ? "bg-accent-blue/[0.02]" : ""
                        }`}
                      >
                        {dayApts.map((apt) => {
                          const colors = typeColors[apt.type];
                          return (
                            <button
                              key={apt.id}
                              onClick={() => setSelectedAppointment(apt)}
                              className={`absolute left-0.5 right-0.5 top-0.5 rounded-lg ${colors.bg} border ${colors.border} px-2 py-1 text-left overflow-hidden z-10 hover:brightness-110 transition-all`}
                              style={{ height: `${apt.duration * 64 - 4}px` }}
                            >
                              <p className={`text-[11px] font-semibold ${colors.text} truncate`}>{apt.client}</p>
                              <p className={`text-[10px] ${colors.text} opacity-70 truncate`}>{apt.typeLabel}</p>
                              {apt.status === "pending" && (
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detail Panel ── */}
        <AnimatePresence>
          {selectedAppointment && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="w-80 bg-[#1b2940] rounded-2xl border border-white/10 p-5 flex-shrink-0 overflow-y-auto scrollbar-brand"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XIcon size={15} />
                </button>
              </div>

              {/* Client */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg, #058789, #5fc4eb)" }}
                >
                  {selectedAppointment.client.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedAppointment.client}</p>
                  <p className="text-xs text-slate-400">{selectedAppointment.clientEmail}</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: "Service",   value: <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeColors[selectedAppointment.type].bg} ${typeColors[selectedAppointment.type].text} ${typeColors[selectedAppointment.type].border}`}>{selectedAppointment.typeLabel}</span> },
                  { label: "Clinician", value: <span className="text-xs font-medium text-white">{selectedAppointment.clinician}</span> },
                  { label: "Status",    value: <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyles[selectedAppointment.status]}`}>{selectedAppointment.status}</span> },
                  { label: "Duration",  value: <span className="text-xs text-white">{selectedAppointment.duration * 60} min</span> },
                  { label: "Payment",   value: <span className={`text-xs font-medium ${selectedAppointment.paymentStatus === "Paid" ? "text-emerald-400" : "text-amber-400"}`}>{selectedAppointment.paymentStatus}</span> },
                  { label: "Phone",     value: <span className="text-xs text-white">{selectedAppointment.clientPhone}</span> },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    {value}
                  </div>
                ))}

                {selectedAppointment.sessionLink && (
                  <div className="bg-teal-500/10 rounded-xl p-3 border border-teal-500/20">
                    <p className="text-xs font-semibold text-teal-300 flex items-center gap-1.5 mb-1">
                      <VideoIcon size={13} /> Telehealth Session
                    </p>
                    <p className="text-[11px] text-teal-400 truncate">{selectedAppointment.sessionLink}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Notes</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedAppointment.notes}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex gap-2">
                  <button className="flex-1 py-2 text-xs font-medium text-slate-300 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                    Reschedule
                  </button>
                  <button className="flex-1 py-2 text-xs font-medium text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/5 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── New Appointment Modal ── */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewModal(false)}
          >
            <div className="absolute inset-0 bg-[#0f1a2a]/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#1b2940] rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CalendarIcon size={17} className="text-accent-blue" />
                  New Appointment
                </h2>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XIcon size={17} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Client</label>
                  <input type="text" placeholder="Search client..." className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Service Type</label>
                    <select className={selectCls}>
                      <option>Neuropsych Assessment</option>
                      <option>Counseling</option>
                      <option>Addiction Counseling</option>
                      <option>Trauma Counseling</option>
                      <option>Telehealth Session</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Clinician</label>
                    <select className={selectCls}>
                      <option>Dr. Adeyemi</option>
                      <option>Dr. Okafor</option>
                      <option>Dr. Mensah</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Date</label>
                    <input type="date" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Time</label>
                    <input type="time" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Duration</label>
                  <select className={selectCls}>
                    <option>30 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                    <option>120 minutes</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add appointment notes..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="telehealth"
                    className="rounded border-white/10 text-accent-blue focus:ring-accent-blue"
                  />
                  <label htmlFor="telehealth" className="text-sm text-slate-400">
                    This is a telehealth session
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#0f1a2a]/50">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-5 py-2 text-sm font-semibold text-[#0f1a2a] bg-accent-blue hover:bg-[#4ab0d6] rounded-xl transition-colors">
                  Create Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
