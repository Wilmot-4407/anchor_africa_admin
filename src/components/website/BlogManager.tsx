import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  LayoutListIcon,
  KanbanIcon,
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  MoreHorizontalIcon,
  FileTextIcon,
  XIcon,
  ImageIcon,
  LinkIcon,
  CheckCircleIcon } from
'lucide-react';
interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'draft' | 'scheduled' | 'published';
  date: string;
  views: number;
  readTime: string;
}
const posts: BlogPost[] = [
{
  id: '1',
  title: 'Mental Health Awareness in Lagos: Breaking the Stigma',
  author: 'Dr. Adeyemi',
  category: 'Mental Health',
  status: 'published',
  date: 'Feb 12, 2026',
  views: 1243,
  readTime: '6 min'
},
{
  id: '2',
  title: 'Understanding Neuropsychological Assessment: A Guide',
  author: 'Dr. Okafor',
  category: 'Research',
  status: 'published',
  date: 'Feb 10, 2026',
  views: 892,
  readTime: '8 min'
},
{
  id: '3',
  title: 'Leadership and Mental Wellness in the Workplace',
  author: 'Dr. Mensah',
  category: 'Leadership',
  status: 'scheduled',
  date: 'Feb 18, 2026',
  views: 0,
  readTime: '5 min'
},
{
  id: '4',
  title: 'Trauma-Informed Care: Best Practices for Clinicians',
  author: 'Dr. Adeyemi',
  category: 'Mental Health',
  status: 'draft',
  date: 'Feb 14, 2026',
  views: 0,
  readTime: '10 min'
},
{
  id: '5',
  title: 'Community Mental Health Programs: Impact Report 2025',
  author: 'Dr. Okafor',
  category: 'Community',
  status: 'published',
  date: 'Feb 8, 2026',
  views: 567,
  readTime: '12 min'
},
{
  id: '6',
  title: 'Addiction Recovery: New Approaches in West Africa',
  author: 'Dr. Mensah',
  category: 'Research',
  status: 'draft',
  date: 'Feb 15, 2026',
  views: 0,
  readTime: '7 min'
}];

const categories = [
'All',
'Mental Health',
'Leadership',
'Research',
'Community'];

export function BlogManager() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.title.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  const statusStyles: Record<string, string> = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    draft: 'bg-slate-50 text-slate-600 border-slate-200'
  };
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Blog</h1>
          <p className="text-sm text-slate-500 mt-1">
            {posts.length} posts ·{' '}
            {posts.filter((p) => p.status === 'published').length} published
          </p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">

          <PlusIcon size={16} />
          New Post
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative max-w-xs flex-1">
            <SearchIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white" />

          </div>
          {/* Category pills */}
          <div className="flex items-center gap-1.5">
            {categories.map((cat) =>
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${activeCategory === cat ? 'bg-navy-950 text-white' : 'bg-white text-slate-500 border border-border hover:bg-slate-50'}`}>

                {cat}
              </button>
            )}
          </div>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setView('table')}
            className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm text-navy-950' : 'text-slate-400'}`}
            aria-label="Table view">

            <LayoutListIcon size={16} />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-1.5 rounded-md transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-navy-950' : 'text-slate-400'}`}
            aria-label="Kanban view">

            <KanbanIcon size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'table' ?
      <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) =>
            <tr
              key={post.id}
              className="border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors">

                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-navy-950">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <ClockIcon size={10} /> {post.readTime} read
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {post.author}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyles[post.status]}`}>

                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {post.date}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 text-right">
                    {post.views > 0 ? post.views.toLocaleString() : '—'}
                  </td>
                  <td className="px-3 py-3.5">
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors">
                      <MoreHorizontalIcon size={16} />
                    </button>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div> :

      <div className="grid grid-cols-3 gap-4">
          {(['draft', 'scheduled', 'published'] as const).map((status) =>
        <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span
              className={`w-2 h-2 rounded-full ${status === 'draft' ? 'bg-slate-400' : status === 'scheduled' ? 'bg-blue-500' : 'bg-emerald-500'}`} />

                <h3 className="text-sm font-semibold text-navy-950 capitalize">
                  {status}
                </h3>
                <span className="text-xs text-slate-400">
                  {filtered.filter((p) => p.status === status).length}
                </span>
              </div>
              {filtered.
          filter((p) => p.status === status).
          map((post) =>
          <motion.div
            key={post.id}
            whileHover={{
              y: -1
            }}
            className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:shadow-sm transition-shadow">

                    <h4 className="text-sm font-medium text-navy-950 mb-2 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {post.author}
                      </span>
                      <span className="text-xs text-slate-400">
                        {post.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <ClockIcon size={10} />
                        {post.readTime}
                      </span>
                    </div>
                  </motion.div>
          )}
            </div>
        )}
        </div>
      }

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {showEditor &&
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
          onClick={() => setShowEditor(false)}>

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
            className="relative bg-white rounded-xl shadow-2xl border border-border w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <FileTextIcon size={18} className="text-accent" />
                  <h2 className="text-lg font-semibold text-navy-950">
                    New Blog Post
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircleIcon size={12} className="text-emerald-500" />
                    Autosaved
                  </span>
                  <button
                  onClick={() => setShowEditor(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors">

                    <XIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <input
                  type="text"
                  placeholder="Post title..."
                  className="w-full text-xl font-semibold text-navy-950 placeholder:text-slate-300 border-0 outline-none" />

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <LinkIcon size={10} /> Slug:{' '}
                    <span className="text-slate-500">
                      mental-health-awareness-in-lagos
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Featured Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/40 transition-colors cursor-pointer">
                    <ImageIcon
                    size={24}
                    className="mx-auto text-slate-300 mb-1" />

                    <p className="text-xs text-slate-400">
                      Click to upload featured image
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Content
                  </label>
                  <textarea
                  rows={10}
                  placeholder="Start writing your post..."
                  className="w-full px-4 py-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none bg-slate-50" />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Category
                    </label>
                    <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                      <option>Mental Health</option>
                      <option>Leadership</option>
                      <option>Research</option>
                      <option>Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Schedule
                    </label>
                    <input
                    type="date"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Tags
                  </label>
                  <input
                  type="text"
                  placeholder="Add tags separated by commas..."
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>

                {/* SEO Section */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-navy-950 mb-3 flex items-center gap-2">
                    <SearchIcon size={14} /> SEO Preview
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-blue-700 text-sm font-medium">
                      Mental Health Awareness in Lagos — ANCHOR Blog
                    </p>
                    <p className="text-emerald-700 text-xs mt-0.5">
                      anchor.org/blog/mental-health-awareness-in-lagos
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      A comprehensive look at mental health awareness
                      initiatives in Lagos and how ANCHOR is leading the
                      charge...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ClockIcon size={12} />
                  Estimated reading time: 6 min
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-slate-50">
                <button className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                  Save as Draft
                </button>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-border rounded-lg hover:bg-white transition-colors">
                    <EyeIcon size={15} />
                    Preview
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors">
                    <CalendarIcon size={15} />
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}