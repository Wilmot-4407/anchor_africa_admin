import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  UploadIcon,
  GridIcon,
  XIcon,
  CopyIcon,
  TrashIcon,
  ImageIcon,
  FileIcon,
  CheckIcon,
  TagIcon,
  LinkIcon,
  InfoIcon } from
'lucide-react';
interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'document';
  folder: string;
  tags: string[];
  size: string;
  dimensions?: string;
  uploadedDate: string;
  usedIn: string[];
  alt: string;
  caption: string;
  url: string;
  color: string;
}
const mediaItems: MediaItem[] = [
{
  id: '1',
  name: 'hero-banner.jpg',
  type: 'image',
  folder: 'Programs',
  tags: ['hero', 'banner'],
  size: '2.4 MB',
  dimensions: '1920×1080',
  uploadedDate: 'Feb 12, 2026',
  usedIn: ['Hero Section'],
  alt: 'ANCHOR clinic exterior',
  caption: 'ANCHOR main facility',
  url: 'https://anchor.org/media/hero-banner.jpg',
  color: 'bg-blue-100'
},
{
  id: '2',
  name: 'team-photo-2026.jpg',
  type: 'image',
  folder: 'Team',
  tags: ['team', 'group'],
  size: '3.1 MB',
  dimensions: '2400×1600',
  uploadedDate: 'Feb 10, 2026',
  usedIn: ['Team Page', 'About ANCHOR'],
  alt: 'ANCHOR team group photo',
  caption: 'The ANCHOR team at our 2026 retreat',
  url: 'https://anchor.org/media/team-photo.jpg',
  color: 'bg-emerald-100'
},
{
  id: '3',
  name: 'conference-keynote.jpg',
  type: 'image',
  folder: 'Events',
  tags: ['conference', 'keynote'],
  size: '1.8 MB',
  dimensions: '1600×900',
  uploadedDate: 'Feb 8, 2026',
  usedIn: ['Conferences & Events'],
  alt: 'Dr. Adeyemi keynote speech',
  caption: 'Keynote at the 2026 Mental Health Summit',
  url: 'https://anchor.org/media/conference.jpg',
  color: 'bg-purple-100'
},
{
  id: '4',
  name: 'counseling-session.jpg',
  type: 'image',
  folder: 'Programs',
  tags: ['counseling', 'therapy'],
  size: '1.2 MB',
  dimensions: '1200×800',
  uploadedDate: 'Feb 5, 2026',
  usedIn: ['Counseling & Psychotherapy'],
  alt: 'Counseling session in progress',
  caption: '',
  url: 'https://anchor.org/media/counseling.jpg',
  color: 'bg-amber-100'
},
{
  id: '5',
  name: 'blog-mental-health.jpg',
  type: 'image',
  folder: 'Blog',
  tags: ['blog', 'mental-health'],
  size: '890 KB',
  dimensions: '1200×630',
  uploadedDate: 'Feb 12, 2026',
  usedIn: ['Blog: Mental Health Awareness'],
  alt: 'Mental health awareness illustration',
  caption: '',
  url: 'https://anchor.org/media/blog-mh.jpg',
  color: 'bg-rose-100'
},
{
  id: '6',
  name: 'clinic-interior.jpg',
  type: 'image',
  folder: 'Programs',
  tags: ['clinic', 'interior'],
  size: '2.1 MB',
  dimensions: '1920×1280',
  uploadedDate: 'Jan 28, 2026',
  usedIn: ['Clinical Services', 'About ANCHOR'],
  alt: 'ANCHOR clinic interior',
  caption: 'Our modern clinical facilities',
  url: 'https://anchor.org/media/clinic.jpg',
  color: 'bg-teal-100'
},
{
  id: '7',
  name: 'research-lab.jpg',
  type: 'image',
  folder: 'Programs',
  tags: ['research', 'lab'],
  size: '1.5 MB',
  dimensions: '1600×1067',
  uploadedDate: 'Jan 25, 2026',
  usedIn: ['Research & Innovation'],
  alt: 'ANCHOR research laboratory',
  caption: '',
  url: 'https://anchor.org/media/lab.jpg',
  color: 'bg-indigo-100'
},
{
  id: '8',
  name: 'annual-report-2025.pdf',
  type: 'document',
  folder: 'Events',
  tags: ['report', 'annual'],
  size: '4.5 MB',
  uploadedDate: 'Jan 15, 2026',
  usedIn: [],
  alt: '',
  caption: 'ANCHOR Annual Report 2025',
  url: 'https://anchor.org/media/report.pdf',
  color: 'bg-slate-100'
}];

const folders = ['All', 'Programs', 'Events', 'Team', 'Blog'];
export function MediaLibrary() {
  const [activeFolder, setActiveFolder] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const filtered = mediaItems.filter((item) => {
    const matchFolder = activeFolder === 'All' || item.folder === activeFolder;
    const matchSearch =
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some((t) => t.includes(searchQuery.toLowerCase()));
    return matchFolder && matchSearch;
  });
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };
  const copyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">
            Media Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {mediaItems.length} files ·{' '}
            {mediaItems.filter((m) => m.type === 'image').length} images
          </p>
        </div>
        <div className="flex items-center gap-3">
          {bulkMode && selectedIds.size > 0 &&
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 border border-rose-200 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors">
              <TrashIcon size={15} />
              Delete ({selectedIds.size})
            </button>
          }
          <button
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedIds(new Set());
            }}
            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${bulkMode ? 'border-accent text-accent bg-amber-50' : 'border-border text-slate-500 hover:bg-slate-50'}`}>

            {bulkMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 mb-6 text-center hover:border-accent/40 transition-colors cursor-pointer bg-white">
        <UploadIcon size={28} className="mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative max-w-xs flex-1">
          <SearchIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files or tags..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white" />

        </div>
        <div className="flex items-center gap-1.5">
          {folders.map((folder) =>
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${activeFolder === folder ? 'bg-navy-950 text-white' : 'bg-white text-slate-500 border border-border hover:bg-slate-50'}`}>

              {folder}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Grid */}
        <div
          className={`grid gap-3 flex-1 ${selectedItem ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>

          {filtered.map((item) =>
          <motion.div
            key={item.id}
            whileHover={{
              y: -1
            }}
            transition={{
              duration: 0.1
            }}
            onClick={() =>
            bulkMode ? toggleSelect(item.id) : setSelectedItem(item)
            }
            className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition-all group ${selectedItem?.id === item.id ? 'border-accent shadow-md' : selectedIds.has(item.id) ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:shadow-sm'}`}>

              <div
              className={`h-28 ${item.color} flex items-center justify-center relative`}>

                {item.type === 'image' ?
              <ImageIcon size={28} className="text-slate-400/50" /> :

              <FileIcon size={28} className="text-slate-400/50" />
              }
                {bulkMode &&
              <div
                className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.has(item.id) ? 'bg-accent border-accent' : 'bg-white border-slate-300'}`}>

                    {selectedIds.has(item.id) &&
                <CheckIcon size={12} className="text-white" />
                }
                  </div>
              }
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-navy-950 truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.size}
                  {item.dimensions ? ` · ${item.dimensions}` : ''}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Preview Drawer */}
        <AnimatePresence>
          {selectedItem && !bulkMode &&
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
            className="w-80 bg-white rounded-xl border border-border p-5 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-300px)]">

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-navy-950">
                  File Details
                </h3>
                <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors">

                  <XIcon size={16} />
                </button>
              </div>

              {/* Preview */}
              <div
              className={`h-40 ${selectedItem.color} rounded-lg flex items-center justify-center mb-4`}>

                {selectedItem.type === 'image' ?
              <ImageIcon size={36} className="text-slate-400/50" /> :

              <FileIcon size={36} className="text-slate-400/50" />
              }
              </div>

              {/* Metadata */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">File name</span>
                  <span className="text-navy-950 font-medium">
                    {selectedItem.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Size</span>
                  <span className="text-navy-950">{selectedItem.size}</span>
                </div>
                {selectedItem.dimensions &&
              <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Dimensions</span>
                    <span className="text-navy-950">
                      {selectedItem.dimensions}
                    </span>
                  </div>
              }
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Uploaded</span>
                  <span className="text-navy-950">
                    {selectedItem.uploadedDate}
                  </span>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3 border-t border-border pt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Alt Text
                  </label>
                  <input
                  type="text"
                  defaultValue={selectedItem.alt}
                  placeholder="Describe this image..."
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Caption
                  </label>
                  <input
                  type="text"
                  defaultValue={selectedItem.caption}
                  placeholder="Add a caption..."
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.tags.map((tag) =>
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-slate-100 text-slate-600 rounded-full">

                        <TagIcon size={10} /> {tag}
                      </span>
                  )}
                  </div>
                </div>
              </div>

              {/* Copy URL */}
              <button
              onClick={() => copyUrl(selectedItem.url)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 border border-border rounded-lg hover:bg-slate-50 transition-colors">

                {copied ?
              <CheckIcon size={14} className="text-emerald-500" /> :

              <CopyIcon size={14} />
              }
                {copied ? 'Copied!' : 'Copy URL'}
              </button>

              {/* Where used */}
              {selectedItem.usedIn.length > 0 &&
            <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
                    <LinkIcon size={12} /> Used in
                  </p>
                  <div className="space-y-1">
                    {selectedItem.usedIn.map((page) =>
                <p
                  key={page}
                  className="text-xs text-slate-500 flex items-center gap-1.5">

                        <InfoIcon size={10} className="text-slate-300" /> {page}
                      </p>
                )}
                  </div>
                </div>
            }
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>);

}