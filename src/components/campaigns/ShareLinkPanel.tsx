import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Copy, Check, QrCode, Code2, ExternalLink,
  Globe, Lock, Share2,
} from 'lucide-react';
import type { CampaignFormRecord } from '../../redux/types';

interface ShareLinkPanelProps {
  form: CampaignFormRecord;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for sandboxed environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
        copied
          ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
          : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20'
      }`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Copied!
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function ShareLinkPanel({ form }: ShareLinkPanelProps) {
  const isActive = form.status === 'active';
  const shareUrl = `https://forms.anchorafrica.org/f/${form.slug}`;

  const embedCode = `<iframe
  src="${shareUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 12px;"
  title="${form.title}"
></iframe>`;

  const socialLinks = [
    { label: 'WhatsApp', color: 'hover:text-green-400', href: '#' },
    { label: 'Twitter / X', color: 'hover:text-sky-400', href: '#' },
    { label: 'LinkedIn', color: 'hover:text-blue-400', href: '#' },
    { label: 'Email', color: 'hover:text-amber-400', href: '#' },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Status indicator */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        isActive
          ? 'bg-emerald-400/5 border-emerald-400/15'
          : 'bg-amber-400/5 border-amber-400/15'
      }`}>
        {isActive ? (
          <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isActive ? 'Form is publicly accessible' : 'Form is in draft mode'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isActive
              ? 'Respondents can fill out and submit this form via the link below.'
              : 'Publish this form to allow respondents to submit responses.'}
          </p>
        </div>
        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${
          isActive
            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
            : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
        }`}>
          {form.status}
        </span>
      </div>

      {/* Share URL */}
      <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-white">Share Link</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 min-w-0">
            <Link2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-sm text-slate-300 truncate font-mono">{shareUrl}</span>
          </div>
          <CopyButton text={shareUrl} label="Copy Link" />
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Open form"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-slate-500 mt-2.5">
          Anyone with this link can view and submit the form.
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-white">QR Code</h3>
        </div>
        <div className="flex items-start gap-6">
          {/* QR placeholder */}
          <div className="w-32 h-32 rounded-xl bg-white p-2 shrink-0 flex items-center justify-center">
            <div className="w-full h-full grid grid-cols-7 gap-px">
              {Array.from({ length: 49 }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    [0,1,2,3,4,5,6,7,13,14,20,21,27,28,42,43,48].includes(i) ||
                    [8,12,36,40].includes(i) ||
                    (i > 14 && i < 20 && i % 2 === 0) ||
                    (i > 28 && i < 34 && i % 3 !== 0) ||
                    (i > 34 && i < 42 && i % 2 === 1)
                      ? 'bg-[#0f1a2a]'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-2 leading-relaxed">
              Scan this QR code to open the form directly on a mobile device.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Perfect for printing on flyers, posters, or waiting room materials.
            </p>
            <button className="flex items-center gap-2 text-xs font-semibold text-accent-blue hover:text-[#4ab0d6] transition-colors border border-accent-blue/20 hover:border-accent-blue/40 px-3 py-2 rounded-xl bg-accent-blue/5 hover:bg-accent-blue/10">
              <QrCode className="w-3.5 h-3.5" /> Download QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-accent-blue" />
            <h3 className="text-sm font-semibold text-white">Embed in Your Website</h3>
          </div>
          <CopyButton text={embedCode} label="Copy Code" />
        </div>
        <pre className="bg-[#0f1a2a] border border-white/[0.06] rounded-xl p-4 text-xs text-slate-400 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
          {embedCode}
        </pre>
        <p className="text-xs text-slate-500 mt-2.5">
          Paste this snippet into your HTML to embed the form directly on any webpage.
        </p>
      </div>

      {/* Social sharing */}
      <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-white">Share via</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => e.preventDefault()}
              className={`px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-400 ${link.color} hover:bg-white/5 hover:border-white/20 transition-all`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
