import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingIcon,
  PaletteIcon,
  SearchIcon,
  ShieldIcon,
  BellIcon,
  CalendarIcon,
  UsersIcon,
  UploadIcon,
  CheckIcon } from
'lucide-react';
type SettingsTab =
'general' |
'branding' |
'seo' |
'roles' |
'security' |
'notifications' |
'booking';
const tabs: {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
}[] = [
{
  id: 'general',
  label: 'General',
  icon: <BuildingIcon size={16} />
},
{
  id: 'branding',
  label: 'Branding',
  icon: <PaletteIcon size={16} />
},
{
  id: 'seo',
  label: 'SEO Defaults',
  icon: <SearchIcon size={16} />
},
{
  id: 'roles',
  label: 'User Roles',
  icon: <UsersIcon size={16} />
},
{
  id: 'security',
  label: 'Security',
  icon: <ShieldIcon size={16} />
},
{
  id: 'notifications',
  label: 'Notifications',
  icon: <BellIcon size={16} />
},
{
  id: 'booking',
  label: 'Booking Settings',
  icon: <CalendarIcon size={16} />
}];

const users = [
{
  name: 'Dr. Adebayo Adeyemi',
  email: 'adeyemi@anchor.org',
  role: 'Admin',
  status: 'Active'
},
{
  name: 'Dr. Nkechi Okafor',
  email: 'okafor@anchor.org',
  role: 'Clinician',
  status: 'Active'
},
{
  name: 'Dr. Kwame Mensah',
  email: 'mensah@anchor.org',
  role: 'Clinician',
  status: 'Active'
},
{
  name: 'Prof. Amina Yusuf',
  email: 'yusuf@anchor.org',
  role: 'Staff',
  status: 'Active'
},
{
  name: 'Blessing Adekunle',
  email: 'adekunle@anchor.org',
  role: 'Editor',
  status: 'Active'
}];

const loginLogs = [
{
  user: 'Dr. Adeyemi',
  ip: '102.89.xx.xx',
  time: 'Feb 15, 2026 8:30 AM',
  location: 'Lagos, Nigeria'
},
{
  user: 'Dr. Okafor',
  ip: '102.89.xx.xx',
  time: 'Feb 15, 2026 8:15 AM',
  location: 'Lagos, Nigeria'
},
{
  user: 'Dr. Mensah',
  ip: '154.160.xx.xx',
  time: 'Feb 15, 2026 7:45 AM',
  location: 'Accra, Ghana'
},
{
  user: 'Prof. Yusuf',
  ip: '102.89.xx.xx',
  time: 'Feb 14, 2026 4:30 PM',
  location: 'Abuja, Nigeria'
}];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
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
      className="p-8 max-w-5xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy-950">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your organization and platform settings
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tab Navigation */}
        <nav className="w-52 flex-shrink-0">
          <ul className="space-y-0.5">
            {tabs.map((tab) =>
            <li key={tab.id}>
                <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-white text-navy-950 shadow-sm border border-border' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>

                  <span
                  className={
                  activeTab === tab.id ? 'text-accent' : 'text-slate-400'
                  }>

                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-border p-6">
          {activeTab === 'general' &&
          <div className="space-y-5">
              <h2 className="text-lg font-semibold text-navy-950">
                General Settings
              </h2>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Organization Name
                </label>
                <input
                type="text"
                defaultValue="Africa Neuropsych Center for Healing, Outreach, and Research"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Address
                </label>
                <input
                type="text"
                defaultValue="12 Medical Drive, Victoria Island, Lagos, Nigeria"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Phone
                  </label>
                  <input
                  type="text"
                  defaultValue="+234 1 234 5678"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Email
                  </label>
                  <input
                  type="email"
                  defaultValue="info@anchor.org"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Timezone
                </label>
                <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                  <option>Africa/Lagos (WAT, UTC+1)</option>
                  <option>Africa/Accra (GMT, UTC+0)</option>
                  <option>Africa/Nairobi (EAT, UTC+3)</option>
                </select>
              </div>
              <button className="px-4 py-2.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          }

          {activeTab === 'branding' &&
          <div className="space-y-5">
              <h2 className="text-lg font-semibold text-navy-950">Branding</h2>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Logo
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/40 transition-colors cursor-pointer">
                  <UploadIcon
                  size={24}
                  className="mx-auto text-slate-300 mb-2" />

                  <p className="text-sm text-slate-500">
                    Upload logo (SVG, PNG)
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent border border-border" />
                  <input
                  type="text"
                  defaultValue="#f59e0b"
                  className="w-32 px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 font-mono" />

                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Favicon
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent/40 transition-colors cursor-pointer">
                  <p className="text-xs text-slate-400">
                    Upload favicon (32×32 ICO or PNG)
                  </p>
                </div>
              </div>
              <button className="px-4 py-2.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          }

          {activeTab === 'seo' &&
          <div className="space-y-5">
              <h2 className="text-lg font-semibold text-navy-950">
                SEO Defaults
              </h2>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Default Meta Title Template
                </label>
                <input
                type="text"
                defaultValue="%page_title% — ANCHOR | Africa Neuropsych Center"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Default Meta Description
                </label>
                <textarea
                rows={3}
                defaultValue="ANCHOR provides world-class neuropsychological assessment, counseling, and research services across Africa."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />

              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Default Social Image
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/40 transition-colors cursor-pointer">
                  <UploadIcon
                  size={24}
                  className="mx-auto text-slate-300 mb-2" />

                  <p className="text-xs text-slate-400">1200×630 recommended</p>
                </div>
              </div>
              <button className="px-4 py-2.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          }

          {activeTab === 'roles' &&
          <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-navy-950">
                  User Roles & Permissions
                </h2>
                <button className="px-3 py-1.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                  Invite User
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) =>
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0">

                      <td className="py-3">
                        <p className="text-sm font-medium text-navy-950">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>
                      <td className="py-3">
                        <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : user.role === 'Clinician' ? 'bg-blue-50 text-blue-700 border-blue-200' : user.role === 'Editor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>

                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] font-medium text-emerald-600">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          }

          {activeTab === 'security' &&
          <div className="space-y-5">
              <h2 className="text-lg font-semibold text-navy-950">Security</h2>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-navy-950">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <button
                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${twoFAEnabled ? 'bg-accent' : 'bg-slate-300'}`}>

                  <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFAEnabled ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`}
                  style={{
                    transform: twoFAEnabled ?
                    'translateX(22px)' :
                    'translateX(0)'
                  }} />

                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-950 mb-3">
                  Recent Login Activity
                </h3>
                <div className="space-y-2">
                  {loginLogs.map((log, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">

                      <div>
                        <p className="text-sm text-navy-950 font-medium">
                          {log.user}
                        </p>
                        <p className="text-xs text-slate-400">
                          {log.ip} · {log.location}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">{log.time}</span>
                    </div>
                )}
                </div>
              </div>
            </div>
          }

          {activeTab === 'notifications' &&
          <div className="space-y-5">
              <h2 className="text-lg font-semibold text-navy-950">
                Notification Preferences
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Push
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                {
                  event: 'New appointment booked',
                  email: true,
                  push: true
                },
                {
                  event: 'Appointment cancelled',
                  email: true,
                  push: true
                },
                {
                  event: 'New client registered',
                  email: true,
                  push: false
                },
                {
                  event: 'New message received',
                  email: false,
                  push: true
                },
                {
                  event: 'Blog post published',
                  email: true,
                  push: false
                },
                {
                  event: 'Content updated',
                  email: false,
                  push: false
                },
                {
                  event: 'Weekly analytics report',
                  email: true,
                  push: false
                }].
                map((item, i) =>
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0">

                      <td className="py-3 text-sm text-navy-950">
                        {item.event}
                      </td>
                      <td className="py-3 text-center">
                        <input
                      type="checkbox"
                      defaultChecked={item.email}
                      className="rounded border-border text-accent focus:ring-accent" />

                      </td>
                      <td className="py-3 text-center">
                        <input
                      type="checkbox"
                      defaultChecked={item.push}
                      className="rounded border-border text-accent focus:ring-accent" />

                      </td>
                    </tr>
                )}
                </tbody>
              </table>
              <button className="px-4 py-2.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                Save Preferences
              </button>
            </div>
          }

          {activeTab === 'booking' &&
          <div className="space-y-5">
              <h2 className="text-lg font-semibold text-navy-950">
                Booking Settings
              </h2>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Default Session Duration
                </label>
                <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                  <option>30 minutes</option>
                  <option selected>60 minutes</option>
                  <option>90 minutes</option>
                  <option>120 minutes</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Working Hours Start
                  </label>
                  <input
                  type="time"
                  defaultValue="08:00"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Working Hours End
                  </label>
                  <input
                  type="time"
                  defaultValue="18:00"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Buffer Time Between Sessions
                </label>
                <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                  <option>No buffer</option>
                  <option>5 minutes</option>
                  <option>10 minutes</option>
                  <option selected>15 minutes</option>
                  <option>30 minutes</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-navy-950">
                    Auto-confirm Appointments
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically confirm new bookings
                  </p>
                </div>
                <button
                onClick={() => setAutoConfirm(!autoConfirm)}
                className={`relative w-11 h-6 rounded-full transition-colors ${autoConfirm ? 'bg-accent' : 'bg-slate-300'}`}>

                  <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{
                    transform: autoConfirm ?
                    'translateX(22px)' :
                    'translateX(0)',
                    left: '2px'
                  }} />

                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Cancellation Policy
                </label>
                <textarea
                rows={3}
                defaultValue="Appointments must be cancelled at least 24 hours in advance. Late cancellations may be subject to a fee."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />

              </div>
              <button className="px-4 py-2.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          }
        </div>
      </div>
    </motion.div>);

}