import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  XIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  AlertTriangleIcon,
  DownloadIcon,
  ClockIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  clinician: string;
  lastVisit: string;
  status: 'active' | 'inactive';
  riskFlag: 'none' | 'low' | 'moderate' | 'high';
  avatar: string;
  notes: {
    date: string;
    text: string;
    author: string;
  }[];
  appointments: {
    date: string;
    service: string;
    status: string;
  }[];
}
const clients: Client[] = [
{
  id: '1',
  name: 'Amara Nwosu',
  email: 'amara@email.com',
  phone: '+234 801 234 5678',
  clinician: 'Dr. Okafor',
  lastVisit: 'Feb 12, 2026',
  status: 'active',
  riskFlag: 'none',
  avatar: 'AN',
  notes: [
  {
    date: 'Feb 12',
    text: 'Completed initial neuropsych assessment. Results pending review.',
    author: 'Dr. Okafor'
  },
  {
    date: 'Feb 5',
    text: 'Intake session completed. Client reports memory and concentration difficulties.',
    author: 'Dr. Okafor'
  }],

  appointments: [
  {
    date: 'Feb 12, 2026',
    service: 'Neuropsych Assessment',
    status: 'Completed'
  },
  {
    date: 'Feb 5, 2026',
    service: 'Intake Session',
    status: 'Completed'
  }]

},
{
  id: '2',
  name: 'Chidinma Eze',
  email: 'chidinma@email.com',
  phone: '+234 802 345 6789',
  clinician: 'Dr. Adeyemi',
  lastVisit: 'Feb 11, 2026',
  status: 'active',
  riskFlag: 'low',
  avatar: 'CE',
  notes: [
  {
    date: 'Feb 11',
    text: 'Session 3 of CBT protocol. Good progress on thought records.',
    author: 'Dr. Adeyemi'
  }],

  appointments: [
  {
    date: 'Feb 11, 2026',
    service: 'CBT Session',
    status: 'Completed'
  },
  {
    date: 'Feb 4, 2026',
    service: 'CBT Session',
    status: 'Completed'
  }]

},
{
  id: '3',
  name: 'Oluwaseun Bakare',
  email: 'seun@email.com',
  phone: '+234 803 456 7890',
  clinician: 'Dr. Mensah',
  lastVisit: 'Feb 9, 2026',
  status: 'active',
  riskFlag: 'moderate',
  avatar: 'OB',
  notes: [
  {
    date: 'Feb 9',
    text: 'EMDR session 2. Client experiencing some distress but within manageable levels.',
    author: 'Dr. Mensah'
  }],

  appointments: [
  {
    date: 'Feb 9, 2026',
    service: 'Trauma Therapy',
    status: 'Completed'
  }]

},
{
  id: '4',
  name: 'Fatima Bello',
  email: 'fatima@email.com',
  phone: '+234 804 567 8901',
  clinician: 'Dr. Okafor',
  lastVisit: 'Feb 10, 2026',
  status: 'active',
  riskFlag: 'none',
  avatar: 'FB',
  notes: [],
  appointments: [
  {
    date: 'Feb 10, 2026',
    service: 'Addiction Counseling',
    status: 'Completed'
  }]

},
{
  id: '5',
  name: 'Emeka Obi',
  email: 'emeka@email.com',
  phone: '+234 805 678 9012',
  clinician: 'Dr. Adeyemi',
  lastVisit: 'Feb 7, 2026',
  status: 'active',
  riskFlag: 'high',
  avatar: 'EO',
  notes: [
  {
    date: 'Feb 7',
    text: 'Client expressing suicidal ideation. Safety plan updated. Emergency contact notified.',
    author: 'Dr. Adeyemi'
  }],

  appointments: [
  {
    date: 'Feb 7, 2026',
    service: 'Crisis Counseling',
    status: 'Completed'
  }]

},
{
  id: '6',
  name: 'Ngozi Adichie',
  email: 'ngozi@email.com',
  phone: '+234 806 789 0123',
  clinician: 'Dr. Mensah',
  lastVisit: 'Jan 28, 2026',
  status: 'inactive',
  riskFlag: 'none',
  avatar: 'NA',
  notes: [],
  appointments: [
  {
    date: 'Jan 28, 2026',
    service: 'Family Counseling',
    status: 'Completed'
  }]

}];

const riskColors: Record<
  string,
  {
    bg: string;
    text: string;
    label: string;
  }> =
{
  none: {
    bg: '',
    text: '',
    label: ''
  },
  low: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: 'Low Risk'
  },
  moderate: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    label: 'Moderate'
  },
  high: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    label: 'High Risk'
  }
};
export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'>(
    'all');
  const filtered = clients.filter((c) => {
    const matchSearch =
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3
      }}
      className="p-8 max-w-7xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Clients</h1>
          <p className="text-sm text-slate-500 mt-1">
            {clients.length} total ·{' '}
            {clients.filter((c) => c.status === 'active').length} active
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">
          <PlusIcon size={16} />
          Add Client
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white" />

        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'active', 'inactive'] as const).map((s) =>
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${statusFilter === s ? 'bg-navy-950 text-white' : 'bg-white text-slate-500 border border-border hover:bg-slate-50'}`}>

              {s}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Clinician
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) =>
              <tr
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`border-b border-border/50 last:border-0 cursor-pointer transition-colors ${selectedClient?.id === client.id ? 'bg-accent/5' : 'hover:bg-slate-50/50'}`}>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                        {client.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-950">
                          {client.name}
                        </p>
                        <p className="text-xs text-slate-400">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {client.clinician}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {client.lastVisit}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${client.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>

                      {client.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {client.riskFlag !== 'none' &&
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${riskColors[client.riskFlag].bg} ${riskColors[client.riskFlag].text}`}>

                        <AlertTriangleIcon size={10} />
                        {riskColors[client.riskFlag].label}
                      </span>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} of {clients.length} clients
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <ChevronLeftIcon size={16} />
              </button>
              <span className="px-2 py-1 text-xs font-medium text-white bg-navy-950 rounded">
                1
              </span>
              <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Drawer */}
        <AnimatePresence>
          {selectedClient &&
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: 20
            }}
            transition={{
              duration: 0.25
            }}
            className="w-96 bg-white rounded-xl border border-border p-5 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-220px)]">

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-navy-950">
                  Client Profile
                </h2>
                <button
                onClick={() => setSelectedClient(null)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors">

                  <XIcon size={16} />
                </button>
              </div>

              {/* Profile Header */}
              <div className="text-center mb-5 pb-5 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-navy-900 flex items-center justify-center text-white text-lg font-semibold mx-auto mb-3">
                  {selectedClient.avatar}
                </div>
                <h3 className="text-base font-semibold text-navy-950">
                  {selectedClient.name}
                </h3>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MailIcon size={12} />
                    {selectedClient.email}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-400">
                  <PhoneIcon size={12} />
                  {selectedClient.phone}
                </div>
                {selectedClient.riskFlag !== 'none' &&
              <span
                className={`inline-flex items-center gap-1 mt-3 text-[11px] font-medium px-2.5 py-1 rounded-full ${riskColors[selectedClient.riskFlag].bg} ${riskColors[selectedClient.riskFlag].text}`}>

                    <AlertTriangleIcon size={12} />
                    {riskColors[selectedClient.riskFlag].label}
                  </span>
              }
              </div>

              {/* Assigned Clinician */}
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Assigned Clinician
                </p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <UserIcon size={16} className="text-slate-400" />
                  <span className="text-sm text-navy-950 font-medium">
                    {selectedClient.clinician}
                  </span>
                </div>
              </div>

              {/* Appointment History */}
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Appointment History
                </p>
                <div className="space-y-2">
                  {selectedClient.appointments.map((apt, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">

                      <div>
                        <p className="text-xs font-medium text-navy-950">
                          {apt.service}
                        </p>
                        <p className="text-[11px] text-slate-400">{apt.date}</p>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {apt.status}
                      </span>
                    </div>
                )}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Clinical Notes
                </p>
                {selectedClient.notes.length === 0 ?
              <p className="text-xs text-slate-400 italic">No notes yet</p> :

              <div className="space-y-3">
                    {selectedClient.notes.map((note, i) =>
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-500">
                            {note.author}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {note.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {note.text}
                        </p>
                      </div>
                )}
                  </div>
              }
                <textarea
                rows={2}
                placeholder="Add a note..."
                className="w-full mt-3 px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />

              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-600 border border-border rounded-lg hover:bg-slate-50 transition-colors">
                <DownloadIcon size={14} />
                Download Report
              </button>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>);

}