import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchIcon,
  PlusIcon,
  XIcon,
  PhoneIcon,
  MailIcon,
  AlertTriangleIcon,
  DownloadIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Users,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  clinician: string;
  lastVisit: string;
  status: "active" | "inactive";
  riskFlag: "none" | "low" | "moderate" | "high";
  avatar: string;
  notes: { date: string; text: string; author: string }[];
  appointments: { date: string; service: string; status: string }[];
}

const clients: Client[] = [
  {
    id: "1", name: "Amara Nwosu", email: "amara@email.com", phone: "+234 801 234 5678",
    clinician: "Dr. Okafor", lastVisit: "Feb 12, 2026", status: "active", riskFlag: "none", avatar: "AN",
    notes: [
      { date: "Feb 12", text: "Completed initial neuropsych assessment. Results pending review.", author: "Dr. Okafor" },
      { date: "Feb 5", text: "Intake session completed. Client reports memory and concentration difficulties.", author: "Dr. Okafor" },
    ],
    appointments: [
      { date: "Feb 12, 2026", service: "Neuropsych Assessment", status: "Completed" },
      { date: "Feb 5, 2026", service: "Intake Session", status: "Completed" },
    ],
  },
  {
    id: "2", name: "Chidinma Eze", email: "chidinma@email.com", phone: "+234 802 345 6789",
    clinician: "Dr. Adeyemi", lastVisit: "Feb 11, 2026", status: "active", riskFlag: "low", avatar: "CE",
    notes: [{ date: "Feb 11", text: "Session 3 of CBT protocol. Good progress on thought records.", author: "Dr. Adeyemi" }],
    appointments: [
      { date: "Feb 11, 2026", service: "CBT Session", status: "Completed" },
      { date: "Feb 4, 2026", service: "CBT Session", status: "Completed" },
    ],
  },
  {
    id: "3", name: "Oluwaseun Bakare", email: "seun@email.com", phone: "+234 803 456 7890",
    clinician: "Dr. Mensah", lastVisit: "Feb 9, 2026", status: "active", riskFlag: "moderate", avatar: "OB",
    notes: [{ date: "Feb 9", text: "EMDR session 2. Client experiencing some distress but within manageable levels.", author: "Dr. Mensah" }],
    appointments: [{ date: "Feb 9, 2026", service: "Trauma Therapy", status: "Completed" }],
  },
  {
    id: "4", name: "Fatima Bello", email: "fatima@email.com", phone: "+234 804 567 8901",
    clinician: "Dr. Okafor", lastVisit: "Feb 10, 2026", status: "active", riskFlag: "none", avatar: "FB",
    notes: [],
    appointments: [{ date: "Feb 10, 2026", service: "Addiction Counseling", status: "Completed" }],
  },
  {
    id: "5", name: "Emeka Obi", email: "emeka@email.com", phone: "+234 805 678 9012",
    clinician: "Dr. Adeyemi", lastVisit: "Feb 7, 2026", status: "active", riskFlag: "high", avatar: "EO",
    notes: [{ date: "Feb 7", text: "Client expressing suicidal ideation. Safety plan updated. Emergency contact notified.", author: "Dr. Adeyemi" }],
    appointments: [{ date: "Feb 7, 2026", service: "Crisis Counseling", status: "Completed" }],
  },
  {
    id: "6", name: "Ngozi Adichie", email: "ngozi@email.com", phone: "+234 806 789 0123",
    clinician: "Dr. Mensah", lastVisit: "Jan 28, 2026", status: "inactive", riskFlag: "none", avatar: "NA",
    notes: [],
    appointments: [{ date: "Jan 28, 2026", service: "Family Counseling", status: "Completed" }],
  },
];

const riskBadge: Record<string, { classes: string; label: string }> = {
  none:     { classes: "", label: "" },
  low:      { classes: "bg-blue-500/10 text-blue-400 border border-blue-500/20",     label: "Low Risk" },
  moderate: { classes: "bg-amber-500/10 text-amber-400 border border-amber-500/20",  label: "Moderate" },
  high:     { classes: "bg-rose-500/10 text-rose-400 border border-rose-500/20",     label: "High Risk" },
};

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "w-14 h-14 text-lg" : size === "sm" ? "w-8 h-8 text-[10px]" : "w-8 h-8 text-[10px]";
  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ background: "linear-gradient(135deg, #058789, #5fc4eb)" }}
    >
      {initials}
    </div>
  );
}

export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [noteText, setNoteText] = useState("");

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users size={17} className="text-primary" />
            </div>
            Clients
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {clients.length} total · {clients.filter((c) => c.status === "active").length} active
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0f1a2a] bg-accent-blue hover:bg-[#4ab0d6] rounded-xl transition-colors shadow-lg shadow-accent-blue/20">
          <PlusIcon size={16} />
          Add Client
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/30 bg-[#0f1a2a] text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors border ${
                statusFilter === s
                  ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                  : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* ── Table ── */}
        <div className="flex-1 bg-[#1b2940] rounded-2xl border border-white/10 overflow-hidden min-w-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Client", "Clinician", "Last Visit", "Status", "Risk"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}
                  className={`border-b border-white/[0.05] last:border-0 cursor-pointer transition-colors ${
                    selectedClient?.id === client.id ? "bg-accent-blue/[0.06]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={client.avatar} />
                      <div>
                        <p className="text-sm font-medium text-white">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-400">{client.clinician}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-400">{client.lastVisit}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${
                        client.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/5 text-slate-400 border-white/10"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {client.riskFlag !== "none" && (
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${riskBadge[client.riskFlag].classes}`}
                      >
                        <AlertTriangleIcon size={10} />
                        {riskBadge[client.riskFlag].label}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
            <p className="text-xs text-slate-500">
              Showing {filtered.length} of {clients.length} clients
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-white rounded transition-colors">
                <ChevronLeftIcon size={16} />
              </button>
              <span className="px-2.5 py-1 text-xs font-medium text-white bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
                1
              </span>
              <button className="p-1 text-slate-400 hover:text-white rounded transition-colors">
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile Drawer ── */}
        <AnimatePresence>
          {selectedClient && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="w-88 bg-[#1b2940] rounded-2xl border border-white/10 p-5 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-240px)] scrollbar-brand"
              style={{ width: "352px" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Client Profile</h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <XIcon size={15} />
                </button>
              </div>

              {/* Profile Header */}
              <div className="text-center mb-5 pb-5 border-b border-white/[0.06]">
                <div className="mb-3 flex justify-center">
                  <Avatar initials={selectedClient.avatar} size="lg" />
                </div>
                <h3 className="text-base font-bold text-white">{selectedClient.name}</h3>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MailIcon size={11} /> {selectedClient.email}</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-400">
                  <PhoneIcon size={11} /> {selectedClient.phone}
                </div>
                {selectedClient.riskFlag !== "none" && (
                  <span
                    className={`inline-flex items-center gap-1 mt-3 text-[11px] font-medium px-2.5 py-1 rounded-full ${riskBadge[selectedClient.riskFlag].classes}`}
                  >
                    <AlertTriangleIcon size={11} />
                    {riskBadge[selectedClient.riskFlag].label}
                  </span>
                )}
              </div>

              {/* Assigned Clinician */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 mb-2">Assigned Clinician</p>
                <div className="flex items-center gap-2 bg-[#0f1a2a] rounded-xl p-3 border border-white/[0.06]">
                  <UserIcon size={15} className="text-slate-500" />
                  <span className="text-sm text-white font-medium">{selectedClient.clinician}</span>
                </div>
              </div>

              {/* Appointment History */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 mb-2">Appointment History</p>
                <div className="space-y-2">
                  {selectedClient.appointments.map((apt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                    >
                      <div>
                        <p className="text-xs font-medium text-white">{apt.service}</p>
                        <p className="text-[11px] text-slate-500">{apt.date}</p>
                      </div>
                      <span className="text-[11px] text-slate-500">{apt.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 mb-2">Clinical Notes</p>
                {selectedClient.notes.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">No notes yet</p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {selectedClient.notes.map((note, i) => (
                      <div key={i} className="bg-[#0f1a2a] rounded-xl p-3 border border-white/[0.06]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-slate-400">{note.author}</span>
                          <span className="text-[11px] text-slate-500">{note.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none bg-[#0f1a2a] text-white placeholder:text-slate-500"
                />
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                <DownloadIcon size={13} />
                Download Report
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
