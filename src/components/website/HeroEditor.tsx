import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ImageIcon,
  HistoryIcon,
  SearchIcon,
  TypeIcon,
  MousePointerClickIcon,
  PaletteIcon,
  GlobeIcon } from
'lucide-react';
export function HeroEditor() {
  const [headline, setHeadline] = useState(
    'Transforming Mental Healthcare Across Africa'
  );
  const [subheadline, setSubheadline] = useState(
    'ANCHOR provides world-class neuropsychological assessment, counseling, and research services to communities across the continent.'
  );
  const [ctaText, setCtaText] = useState('Book a Consultation');
  const [ctaLink, setCtaLink] = useState('/appointments');
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
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
      className="p-8 max-w-3xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Hero Section</h1>
          <p className="text-sm text-slate-500 mt-1">
            Customize the main hero banner of your website
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 border border-border rounded-lg hover:bg-slate-50 transition-colors">
          <HistoryIcon size={15} />
          Version History
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-5 py-3.5 text-sm font-medium transition-colors relative ${activeTab === 'content' ? 'text-navy-950' : 'text-slate-400 hover:text-slate-600'}`}>

            Content
            {activeTab === 'content' &&
            <motion.div
              layoutId="hero-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />

            }
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-5 py-3.5 text-sm font-medium transition-colors relative ${activeTab === 'seo' ? 'text-navy-950' : 'text-slate-400 hover:text-slate-600'}`}>

            SEO
            {activeTab === 'seo' &&
            <motion.div
              layoutId="hero-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />

            }
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'content' ?
          <div className="space-y-8">
              {/* Heading & Copy */}
              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  <TypeIcon size={14} className="text-accent" />
                  Heading & Copy
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Headline
                  </label>
                  <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                  <p className="text-xs text-slate-400 mt-1">
                    {headline.length} characters
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Subheadline
                  </label>
                  <textarea
                  rows={3}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />

                  <p className="text-xs text-slate-400 mt-1">
                    {subheadline.length} characters · Recommended: under 160
                  </p>
                </div>
              </fieldset>

              <hr className="border-border" />

              {/* Call to Action */}
              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  <MousePointerClickIcon size={14} className="text-accent" />
                  Call to Action
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Button Text
                    </label>
                    <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Button Link
                    </label>
                    <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="/page-slug or https://..."
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                  </div>
                </div>
              </fieldset>

              <hr className="border-border" />

              {/* Background & Styling */}
              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  <PaletteIcon size={14} className="text-accent" />
                  Background & Styling
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Background Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/40 transition-colors cursor-pointer">
                    <ImageIcon
                    size={28}
                    className="mx-auto text-slate-300 mb-2" />

                    <p className="text-sm text-slate-500 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG up to 5MB · Recommended: 1920×1080
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-600">
                      Overlay Opacity
                    </label>
                    <span className="text-xs font-medium text-navy-950 tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                      {overlayOpacity}%
                    </span>
                  </div>
                  <input
                  type="range"
                  min={0}
                  max={100}
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-accent" />

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Transparent</span>
                    <span>Fully opaque</span>
                  </div>
                </div>
              </fieldset>
            </div> :

          <div className="space-y-8">
              {/* Meta Tags */}
              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  <SearchIcon size={14} className="text-accent" />
                  Meta Tags
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Meta Title
                  </label>
                  <input
                  type="text"
                  defaultValue="ANCHOR — Transforming Mental Healthcare Across Africa"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

                  <p className="text-xs text-slate-400 mt-1">
                    56 / 60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                  rows={3}
                  defaultValue="ANCHOR provides world-class neuropsychological assessment, counseling, and research services across Africa."
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />

                  <p className="text-xs text-slate-400 mt-1">
                    108 / 160 characters
                  </p>
                </div>
              </fieldset>

              <hr className="border-border" />

              {/* Social Sharing */}
              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  <GlobeIcon size={14} className="text-accent" />
                  Social Sharing
                </legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Social Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/40 transition-colors cursor-pointer">
                    <ImageIcon
                    size={24}
                    className="mx-auto text-slate-300 mb-1" />

                    <p className="text-xs text-slate-400">
                      1200×630 recommended
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Search Preview
                  </label>
                  <div className="bg-slate-50 rounded-lg p-4 border border-border">
                    <p className="text-xs text-slate-400">anchor.org</p>
                    <p className="text-sm font-medium text-blue-700 mt-0.5">
                      ANCHOR — Transforming Mental Healthcare
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      World-class neuropsychological services across Africa...
                    </p>
                  </div>
                </div>
              </fieldset>
            </div>
          }
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-slate-50/50">
          <button className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            Discard Changes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>);

}