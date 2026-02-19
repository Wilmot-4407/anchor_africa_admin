import React, { useState, Fragment, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  ClockIcon,
  UserIcon,
  VideoIcon,
  PhoneIcon,
  CalendarIcon,
  AlertCircleIcon } from
'lucide-react';
type ViewMode = 'day' | 'week' | 'month';
type AppointmentType =
'neuropsych' |
'counseling' |
'addiction' |
'trauma' |
'telehealth';
type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
interface Appointment {
  id: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  type: AppointmentType;
  typeLabel: string;
  clinician: string;
  day: number; // 0-6 for week view
  startHour: number;
  duration: number; // in hours
  status: AppointmentStatus;
  notes: string;
  paymentStatus: string;
  sessionLink?: string;
}
const typeColors: Record<
  AppointmentType,
  {
    bg: string;
    border: string;
    text: string;
    dot: string;
  }> =
{
  neuropsych: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500'
  },
  counseling: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500'
  },
  addiction: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500'
  },
  trauma: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    dot: 'bg-purple-500'
  },
  telehealth: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    dot: 'bg-teal-500'
  }
};
const statusStyles: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-slate-50 text-slate-600 border-slate-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
};
const appointments: Appointment[] = [
{
  id: '1',
  client: 'Amara Nwosu',
  clientEmail: 'amara@email.com',
  clientPhone: '+234 801 234 5678',
  type: 'neuropsych',
  typeLabel: 'Neuropsych Assessment',
  clinician: 'Dr. Okafor',
  day: 0,
  startHour: 9,
  duration: 2,
  status: 'confirmed',
  notes: 'Initial comprehensive assessment. Client reports memory concerns.',
  paymentStatus: 'Paid'
},
{
  id: '2',
  client: 'Chidinma Eze',
  clientEmail: 'chidinma@email.com',
  clientPhone: '+234 802 345 6789',
  type: 'counseling',
  typeLabel: 'CBT Session',
  clinician: 'Dr. Adeyemi',
  day: 0,
  startHour: 10,
  duration: 1,
  status: 'confirmed',
  notes: 'Session 4 of 12. Focus on cognitive restructuring.',
  paymentStatus: 'Paid'
},
{
  id: '3',
  client: 'Oluwaseun Bakare',
  clientEmail: 'seun@email.com',
  clientPhone: '+234 803 456 7890',
  type: 'trauma',
  typeLabel: 'Trauma-Focused Therapy',
  clinician: 'Dr. Mensah',
  day: 1,
  startHour: 11,
  duration: 1.5,
  status: 'pending',
  notes: 'Follow-up session. EMDR protocol.',
  paymentStatus: 'Pending'
},
{
  id: '4',
  client: 'Fatima Bello',
  clientEmail: 'fatima@email.com',
  clientPhone: '+234 804 567 8901',
  type: 'addiction',
  typeLabel: 'Addiction Counseling',
  clinician: 'Dr. Okafor',
  day: 1,
  startHour: 14,
  duration: 1,
  status: 'confirmed',
  notes: 'Week 8 check-in. Discuss relapse prevention strategies.',
  paymentStatus: 'Paid'
},
{
  id: '5',
  client: 'Emeka Obi',
  clientEmail: 'emeka@email.com',
  clientPhone: '+234 805 678 9012',
  type: 'telehealth',
  typeLabel: 'Telehealth Session',
  clinician: 'Dr. Adeyemi',
  day: 2,
  startHour: 15,
  duration: 1,
  status: 'pending',
  notes: 'Remote follow-up. Client is traveling.',
  paymentStatus: 'Paid',
  sessionLink: 'https://meet.anchor.org/session-5'
},
{
  id: '6',
  client: 'Ngozi Adichie',
  clientEmail: 'ngozi@email.com',
  clientPhone: '+234 806 789 0123',
  type: 'counseling',
  typeLabel: 'Family Counseling',
  clinician: 'Dr. Mensah',
  day: 3,
  startHour: 9,
  duration: 1.5,
  status: 'confirmed',
  notes: 'Joint session with spouse.',
  paymentStatus: 'Pending'
},
{
  id: '7',
  client: 'Ibrahim Musa',
  clientEmail: 'ibrahim@email.com',
  clientPhone: '+234 807 890 1234',
  type: 'neuropsych',
  typeLabel: 'Neuropsych Follow-up',
  clinician: 'Dr. Okafor',
  day: 3,
  startHour: 13,
  duration: 1,
  status: 'confirmed',
  notes: 'Review assessment results.',
  paymentStatus: 'Paid'
},
{
  id: '8',
  client: 'Aisha Abdullahi',
  clientEmail: 'aisha@email.com',
  clientPhone: '+234 808 901 2345',
  type: 'trauma',
  typeLabel: 'Trauma Assessment',
  clinician: 'Dr. Adeyemi',
  day: 4,
  startHour: 10,
  duration: 2,
  status: 'pending',
  notes: 'Initial trauma assessment. Referred by Dr. Yusuf.',
  paymentStatus: 'Pending'
}];

const hours = Array.from(
  {
    length: 11
  },
  (_, i) => i + 8
); // 8am to 6pm
const days = [
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday',
'Sunday'];

const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export function AppointmentsView() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedAppointment, setSelectedAppointment] =
  useState<Appointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const currentDate = new Date();
  const todayDay = (currentDate.getDay() + 6) % 7; // Monday = 0
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
      className="p-8 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">February 2026</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) =>
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${viewMode === mode ? 'bg-white shadow-sm text-navy-950' : 'text-slate-400 hover:text-slate-600'}`}>

                {mode}
              </button>
            )}
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeftIcon size={18} />
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Today
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRightIcon size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">

            <PlusIcon size={16} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Type Legend */}
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        {Object.entries(typeColors).map(([type, colors]) =>
        <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
            <span className="text-xs text-slate-500 capitalize">
              {type === 'neuropsych' ? 'Neuropsych' : type}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-xl border border-border overflow-hidden flex flex-col">
          {/* Day Headers */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border flex-shrink-0">
            <div className="p-2" />
            {shortDays.map((day, i) =>
            <div
              key={day}
              className={`p-3 text-center border-l border-border ${i === todayDay ? 'bg-accent/5' : ''}`}>

                <p className="text-xs text-slate-400 font-medium">{day}</p>
                <p
                className={`text-lg font-semibold mt-0.5 ${i === todayDay ? 'text-accent' : 'text-navy-950'}`}>

                  {10 + i}
                </p>
              </div>
            )}
          </div>

          {/* Time Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
              {/* Now indicator */}
              <div
                className="absolute left-[60px] right-0 h-0.5 bg-error z-10 pointer-events-none"
                style={{
                  top: `${(currentDate.getHours() - 8 + currentDate.getMinutes() / 60) * 64}px`
                }}>

                <div className="w-2 h-2 rounded-full bg-error -mt-[3px] -ml-1" />
              </div>

              {hours.map((hour) =>
              <Fragment key={hour}>
                  <div className="h-16 flex items-start justify-end pr-2 pt-0 border-b border-border/50">
                    <span className="text-[11px] text-slate-400 -mt-2">
                      {hour === 12 ?
                    '12 PM' :
                    hour > 12 ?
                    `${hour - 12} PM` :
                    `${hour} AM`}
                    </span>
                  </div>
                  {Array.from(
                  {
                    length: 7
                  },
                  (_, dayIdx) => {
                    const dayAppointments = appointments.filter(
                      (a) => a.day === dayIdx && a.startHour === hour
                    );
                    return (
                      <div
                        key={dayIdx}
                        className={`h-16 border-l border-b border-border/50 relative ${dayIdx === todayDay ? 'bg-accent/[0.02]' : ''}`}>

                          {dayAppointments.map((apt) => {
                          const colors = typeColors[apt.type];
                          const heightPx = apt.duration * 64;
                          return (
                            <button
                              key={apt.id}
                              onClick={() => setSelectedAppointment(apt)}
                              className={`absolute left-0.5 right-0.5 top-0.5 rounded-md ${colors.bg} border ${colors.border} px-2 py-1 text-left overflow-hidden z-10 hover:shadow-sm transition-shadow`}
                              style={{
                                height: `${heightPx - 4}px`
                              }}>

                                <p
                                className={`text-[11px] font-semibold ${colors.text} truncate`}>

                                  {apt.client}
                                </p>
                                <p
                                className={`text-[10px] ${colors.text} opacity-70 truncate`}>

                                  {apt.typeLabel}
                                </p>
                                {apt.status === 'pending' &&
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                              }
                              </button>);

                        })}
                        </div>);

                  }
                )}
                </Fragment>
              )}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedAppointment &&
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
            className="w-80 bg-white rounded-xl border border-border p-5 flex-shrink-0 overflow-y-auto">

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-navy-950">
                  Appointment Details
                </h2>
                <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors">

                  <XIcon size={16} />
                </button>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold">
                  {selectedAppointment.client.
                split(' ').
                map((n) => n[0]).
                join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-950">
                    {selectedAppointment.client}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedAppointment.clientEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Service</span>
                  <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeColors[selectedAppointment.type].bg} ${typeColors[selectedAppointment.type].text} ${typeColors[selectedAppointment.type].border}`}>

                    {selectedAppointment.typeLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Clinician</span>
                  <span className="text-xs font-medium text-navy-950">
                    {selectedAppointment.clinician}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Status</span>
                  <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyles[selectedAppointment.status]}`}>

                    {selectedAppointment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Duration</span>
                  <span className="text-xs text-navy-950">
                    {selectedAppointment.duration * 60} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Payment</span>
                  <span
                  className={`text-xs font-medium ${selectedAppointment.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>

                    {selectedAppointment.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Phone</span>
                  <span className="text-xs text-navy-950">
                    {selectedAppointment.clientPhone}
                  </span>
                </div>

                {selectedAppointment.sessionLink &&
              <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                    <p className="text-xs font-medium text-teal-700 flex items-center gap-1.5 mb-1">
                      <VideoIcon size={14} /> Telehealth Session
                    </p>
                    <p className="text-[11px] text-teal-600 truncate">
                      {selectedAppointment.sessionLink}
                    </p>
                  </div>
              }

                {/* Notes */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium text-slate-600 mb-2">
                    Notes
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {selectedAppointment.notes}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border flex gap-2">
                  <button className="flex-1 py-2 text-xs font-medium text-slate-600 border border-border rounded-lg hover:bg-slate-50 transition-colors">
                    Reschedule
                  </button>
                  <button className="flex-1 py-2 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showNewModal &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowNewModal(false)}>

            <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" />
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10
            }}
            transition={{
              duration: 0.2
            }}
            className="relative bg-white rounded-xl shadow-2xl border border-border w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-navy-950 flex items-center gap-2">
                  <CalendarIcon size={18} className="text-accent" />
                  New Appointment
                </h2>
                <button
                onClick={() => setShowNewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors">

                  <XIcon size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Client
                  </label>
                  <input
                  type="text"
                  placeholder="Search client..."
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Service Type
                    </label>
                    <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                      <option>Neuropsych Assessment</option>
                      <option>Counseling</option>
                      <option>Addiction Counseling</option>
                      <option>Trauma Counseling</option>
                      <option>Telehealth Session</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Clinician
                    </label>
                    <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                      <option>Dr. Adeyemi</option>
                      <option>Dr. Okafor</option>
                      <option>Dr. Mensah</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Date
                    </label>
                    <input
                    type="date"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Time
                    </label>
                    <input
                    type="time"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Duration
                  </label>
                  <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                    <option>30 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                    <option>120 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Notes
                  </label>
                  <textarea
                  rows={3}
                  placeholder="Add appointment notes..."
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />

                </div>
                <div className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  id="telehealth"
                  className="rounded border-border text-accent focus:ring-accent" />

                  <label
                  htmlFor="telehealth"
                  className="text-sm text-slate-600">

                    This is a telehealth session
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-slate-50">
                <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">

                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                  Create Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}