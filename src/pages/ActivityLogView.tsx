import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import {
  FilterIcon,
  FileTextIcon,
  CalendarIcon,
  UserPlusIcon,
  SettingsIcon,
  EditIcon,
  SendIcon,
  ImageIcon,
  ClockIcon } from
'lucide-react';
interface ActivityEntry {
  id: string;
  user: string;
  avatar: string;
  action: string;
  detail: string;
  type: 'content' | 'appointment' | 'blog' | 'client' | 'settings' | 'media';
  timestamp: string;
}
const activities: ActivityEntry[] = [
{
  id: '1',
  user: 'Dr. Adeyemi',
  avatar: 'DA',
  action: 'Published blog post',
  detail: '"Mental Health Awareness in Lagos: Breaking the Stigma"',
  type: 'blog',
  timestamp: '25 minutes ago'
},
{
  id: '2',
  user: 'Dr. Okafor',
  avatar: 'NO',
  action: 'Completed appointment',
  detail: 'Neuropsych Assessment with Amara Nwosu',
  type: 'appointment',
  timestamp: '1 hour ago'
},
{
  id: '3',
  user: 'Chidinma Eze',
  avatar: 'CE',
  action: 'Registered as new client',
  detail: 'Referred by Dr. Yusuf for CBT',
  type: 'client',
  timestamp: '2 hours ago'
},
{
  id: '4',
  user: 'Dr. Mensah',
  avatar: 'KM',
  action: 'Updated content',
  detail: 'Trauma Counseling program page — updated service descriptions',
  type: 'content',
  timestamp: '3 hours ago'
},
{
  id: '5',
  user: 'Dr. Adeyemi',
  avatar: 'DA',
  action: 'Uploaded media',
  detail: '3 new images to Programs folder',
  type: 'media',
  timestamp: '4 hours ago'
},
{
  id: '6',
  user: 'Dr. Okafor',
  avatar: 'NO',
  action: 'Created appointment',
  detail: 'Neuropsych Follow-up with Ibrahim Musa — Thursday 1:00 PM',
  type: 'appointment',
  timestamp: '5 hours ago'
},
{
  id: '7',
  user: 'Dr. Adeyemi',
  avatar: 'DA',
  action: 'Updated settings',
  detail: 'Changed default session duration to 60 minutes',
  type: 'settings',
  timestamp: '6 hours ago'
},
{
  id: '8',
  user: 'Dr. Mensah',
  avatar: 'KM',
  action: 'Published blog post',
  detail: '"Community Mental Health Programs: Impact Report 2025"',
  type: 'blog',
  timestamp: 'Yesterday 4:30 PM'
},
{
  id: '9',
  user: 'Dr. Okafor',
  avatar: 'NO',
  action: 'Added team member',
  detail: 'Dr. Olumide Bakare — Training Coordinator',
  type: 'content',
  timestamp: 'Yesterday 2:15 PM'
},
{
  id: '10',
  user: 'Dr. Adeyemi',
  avatar: 'DA',
  action: 'Rescheduled appointment',
  detail: 'Oluwaseun Bakare — moved from Wednesday to Thursday',
  type: 'appointment',
  timestamp: 'Yesterday 11:00 AM'
},
{
  id: '11',
  user: 'Dr. Mensah',
  avatar: 'KM',
  action: 'Updated content',
  detail: 'Courses page — added new Executive Diploma program',
  type: 'content',
  timestamp: '2 days ago'
},
{
  id: '12',
  user: 'Dr. Adeyemi',
  avatar: 'DA',
  action: 'Added new client',
  detail: 'Aisha Abdullahi — referred by Dr. Yusuf',
  type: 'client',
  timestamp: '2 days ago'
}];

const typeIcons: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
  }> =
{
  content: {
    icon: <EditIcon size={14} />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  appointment: {
    icon: <CalendarIcon size={14} />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  blog: {
    icon: <FileTextIcon size={14} />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  client: {
    icon: <UserPlusIcon size={14} />,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  settings: {
    icon: <SettingsIcon size={14} />,
    color: 'text-slate-600',
    bg: 'bg-slate-100'
  },
  media: {
    icon: <ImageIcon size={14} />,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
};
const stagger = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 8
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25
    }
  }
};
export function ActivityLogView() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const filtered = activities.filter((a) => {
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    const matchUser = userFilter === 'all' || a.user === userFilter;
    return matchType && matchUser;
  });
  const users = [...new Set(activities.map((a) => a.user))];
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
      className="p-8 max-w-4xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy-950">Activity Log</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track all changes and actions across the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Type:</span>
          {[
          'all',
          'content',
          'appointment',
          'blog',
          'client',
          'settings',
          'media'].
          map((type) =>
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize transition-colors ${typeFilter === type ? 'bg-navy-950 text-white' : 'bg-white text-slate-500 border border-border hover:bg-slate-50'}`}>

              {type}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">User:</span>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">

            <option value="all">All Users</option>
            {users.map((u) =>
            <option key={u} value={u}>
                {u}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative">

        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {filtered.map((entry) => {
            const typeConfig = typeIcons[entry.type];
            return (
              <motion.div
                key={entry.id}
                variants={fadeUp}
                className="flex items-start gap-4 py-3 pl-0 relative">

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center ${typeConfig.color} flex-shrink-0 z-10 border-4 border-stone-50`}>

                  {typeConfig.icon}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl border border-border p-4 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-navy-950">
                        <span className="font-semibold">{entry.user}</span>{' '}
                        <span className="text-slate-500">{entry.action}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {entry.detail}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                      <ClockIcon size={10} /> {entry.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>);

          })}
        </div>

        {/* Load more */}
        <div className="text-center mt-6">
          <button className="px-4 py-2 text-sm text-slate-500 border border-border rounded-lg hover:bg-white transition-colors">
            Load more activity
          </button>
        </div>
      </motion.div>
    </motion.div>);

}