import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  SearchIcon,
  LinkedinIcon,
  TwitterIcon,
  GripVerticalIcon,
  XIcon } from
'lucide-react';
interface TeamMember {
  id: string;
  name: string;
  credentials: string;
  role: string;
  department: string;
  bio: string;
  avatar: string;
  linkedin: string;
  twitter: string;
  order: number;
}
const teamMembers: TeamMember[] = [
{
  id: '1',
  name: 'Dr. Adebayo Adeyemi',
  credentials: 'PhD, Clinical Neuropsychology',
  role: 'Founder & Director',
  department: 'Clinical Team',
  bio: 'Dr. Adeyemi is a leading clinical neuropsychologist with over 20 years of experience in mental health research and practice across West Africa.',
  avatar: 'DA',
  linkedin: '#',
  twitter: '#',
  order: 1
},
{
  id: '2',
  name: 'Dr. Nkechi Okafor',
  credentials: 'PsyD, Clinical Psychology',
  role: 'Head of Clinical Services',
  department: 'Clinical Team',
  bio: 'Dr. Okafor specializes in trauma-focused therapy and neuropsychological assessment, with particular expertise in culturally-adapted interventions.',
  avatar: 'NO',
  linkedin: '#',
  twitter: '#',
  order: 2
},
{
  id: '3',
  name: 'Dr. Kwame Mensah',
  credentials: 'PhD, Counseling Psychology',
  role: 'Lead Counselor',
  department: 'Clinical Team',
  bio: 'Dr. Mensah brings extensive experience in addiction counseling and community mental health programs across Ghana and Nigeria.',
  avatar: 'KM',
  linkedin: '#',
  twitter: '#',
  order: 3
},
{
  id: '4',
  name: 'Prof. Amina Yusuf',
  credentials: 'MD, Psychiatry',
  role: 'Research Director',
  department: 'Research Team',
  bio: "Prof. Yusuf leads ANCHOR's research initiatives, focusing on the intersection of neuroscience and traditional healing practices.",
  avatar: 'AY',
  linkedin: '#',
  twitter: '#',
  order: 4
},
{
  id: '5',
  name: 'Dr. Olumide Bakare',
  credentials: 'PhD, Educational Psychology',
  role: 'Training Coordinator',
  department: 'Training Team',
  bio: 'Dr. Bakare oversees all training programs, including certificate and diploma courses in mental health and behavioral sciences.',
  avatar: 'OB',
  linkedin: '#',
  twitter: '#',
  order: 5
},
{
  id: '6',
  name: 'Chief Emeka Obi',
  credentials: 'MBA, Healthcare Administration',
  role: 'Board Chair',
  department: 'Board of Directors',
  bio: 'Chief Obi brings decades of healthcare leadership experience and is a passionate advocate for mental health awareness in Africa.',
  avatar: 'EO',
  linkedin: '#',
  twitter: '#',
  order: 6
}];

const departments = [
'All',
'Clinical Team',
'Research Team',
'Training Team',
'Board of Directors'];

export function TeamManager() {
  const [activeDept, setActiveDept] = useState('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = teamMembers.filter((m) => {
    const matchDept = activeDept === 'All' || m.department === activeDept;
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
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
          <h1 className="text-2xl font-semibold text-navy-950">Team</h1>
          <p className="text-sm text-slate-500 mt-1">
            {teamMembers.length} team members
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">
          <PlusIcon size={16} />
          Add Member
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative max-w-xs">
          <SearchIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white" />

        </div>
        <div className="flex items-center gap-1.5">
          {departments.map((dept) =>
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${activeDept === dept ? 'bg-navy-950 text-white' : 'bg-white text-slate-500 border border-border hover:bg-slate-50'}`}>

              {dept}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Grid */}
        <div
          className={`grid gap-4 flex-1 ${selectedMember ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>

          {filtered.map((member) =>
          <motion.div
            key={member.id}
            whileHover={{
              y: -2
            }}
            transition={{
              duration: 0.15
            }}
            onClick={() => setSelectedMember(member)}
            className={`bg-white rounded-xl border p-5 cursor-pointer transition-all ${selectedMember?.id === member.id ? 'border-accent shadow-md' : 'border-border hover:shadow-sm hover:border-slate-300'}`}>

              <div className="flex items-start gap-4">
                <div className="flex items-center gap-1 text-slate-300 cursor-grab flex-shrink-0 mt-1">
                  <GripVerticalIcon size={14} />
                </div>
                <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-navy-950 truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs text-accent font-medium">
                    {member.credentials}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
                  <span className="inline-block mt-2 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {member.department}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Edit Panel */}
        {selectedMember &&
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.25
          }}
          className="w-96 bg-white rounded-xl border border-border p-6 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-220px)]">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-navy-950">
                Edit Member
              </h2>
              <button
              onClick={() => setSelectedMember(null)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors">

                <XIcon size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Identity */}
              <fieldset className="space-y-3">
                <legend className="text-[11px] font-semibold text-navy-950 uppercase tracking-wider mb-0.5">
                  Identity
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Name
                  </label>
                  <input
                  type="text"
                  defaultValue={selectedMember.name}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Credentials
                  </label>
                  <input
                  type="text"
                  defaultValue={selectedMember.credentials}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Profile Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent/40 transition-colors cursor-pointer">
                    <p className="text-xs text-slate-400">Click to upload</p>
                  </div>
                </div>
              </fieldset>

              <hr className="border-border" />

              {/* Role & Department */}
              <fieldset className="space-y-3">
                <legend className="text-[11px] font-semibold text-navy-950 uppercase tracking-wider mb-0.5">
                  Role & Department
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Role
                  </label>
                  <input
                  type="text"
                  defaultValue={selectedMember.role}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                  defaultValue={selectedMember.department}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">

                    <option>Clinical Team</option>
                    <option>Research Team</option>
                    <option>Training Team</option>
                    <option>Board of Directors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Display Order
                  </label>
                  <input
                  type="number"
                  defaultValue={selectedMember.order}
                  className="w-20 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                  <p className="text-[11px] text-slate-400 mt-1">
                    Lower numbers appear first
                  </p>
                </div>
              </fieldset>

              <hr className="border-border" />

              {/* Bio */}
              <fieldset className="space-y-3">
                <legend className="text-[11px] font-semibold text-navy-950 uppercase tracking-wider mb-0.5">
                  Biography
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Bio
                  </label>
                  <textarea
                  rows={4}
                  defaultValue={selectedMember.bio}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />

                  <p className="text-[11px] text-slate-400 mt-1">
                    {selectedMember.bio.length} characters
                  </p>
                </div>
              </fieldset>

              <hr className="border-border" />

              {/* Social Links */}
              <fieldset className="space-y-3">
                <legend className="text-[11px] font-semibold text-navy-950 uppercase tracking-wider mb-0.5">
                  Social Links
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                      <LinkedinIcon size={12} /> LinkedIn
                    </label>
                    <input
                    type="text"
                    defaultValue={selectedMember.linkedin}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                      <TwitterIcon size={12} /> Twitter
                    </label>
                    <input
                    type="text"
                    defaultValue={selectedMember.twitter}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                  </div>
                </div>
              </fieldset>

              <button className="w-full py-2.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors mt-2">
                Save Changes
              </button>
            </div>
          </motion.div>
        }
      </div>
    </motion.div>);

}