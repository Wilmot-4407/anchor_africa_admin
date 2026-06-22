import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SearchIcon,
  ArchiveIcon,
  CheckCheckIcon,
  SendIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  PaperclipIcon,
} from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  topic: string;
  messages: { sender: string; text: string; time: string; isMe: boolean }[];
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Amara Nwosu",
    avatar: "AN",
    lastMessage: "Thank you for the assessment report. I have a few questions about the recommendations.",
    timestamp: "10:30 AM",
    unread: true,
    topic: "Assessment",
    messages: [
      { sender: "Amara Nwosu", text: "Good morning Dr. Adeyemi. I received the neuropsychological assessment report.", time: "10:15 AM", isMe: false },
      { sender: "Dr. Adeyemi", text: "Good morning Amara. I hope the report was clear. Please let me know if you have any questions.", time: "10:22 AM", isMe: true },
      { sender: "Amara Nwosu", text: "Thank you for the assessment report. I have a few questions about the recommendations.", time: "10:30 AM", isMe: false },
    ],
  },
  {
    id: "2",
    name: "Oluwaseun Bakare",
    avatar: "OB",
    lastMessage: "Can I reschedule my Thursday appointment to Friday?",
    timestamp: "9:45 AM",
    unread: true,
    topic: "Scheduling",
    messages: [
      { sender: "Oluwaseun Bakare", text: "Hello, I need to reschedule my appointment this week.", time: "9:30 AM", isMe: false },
      { sender: "Oluwaseun Bakare", text: "Can I reschedule my Thursday appointment to Friday?", time: "9:45 AM", isMe: false },
    ],
  },
  {
    id: "3",
    name: "Dr. Okafor",
    avatar: "NO",
    lastMessage: "The research paper draft is ready for your review.",
    timestamp: "Yesterday",
    unread: true,
    topic: "Research",
    messages: [
      { sender: "Dr. Okafor", text: "Hi Dr. Adeyemi, I've completed the draft for our joint research paper.", time: "Yesterday 4:30 PM", isMe: false },
      { sender: "Dr. Okafor", text: "The research paper draft is ready for your review.", time: "Yesterday 4:32 PM", isMe: false },
    ],
  },
  {
    id: "4",
    name: "Fatima Bello",
    avatar: "FB",
    lastMessage: "I've been sober for 60 days now. Thank you for your support.",
    timestamp: "Yesterday",
    unread: false,
    topic: "General",
    messages: [
      { sender: "Fatima Bello", text: "I wanted to share that I've been sober for 60 days now. Thank you for your support.", time: "Yesterday 2:15 PM", isMe: false },
      { sender: "Dr. Adeyemi", text: "That's wonderful news, Fatima! I'm so proud of your progress. Keep up the great work.", time: "Yesterday 3:00 PM", isMe: true },
    ],
  },
  {
    id: "5",
    name: "Prof. Yusuf",
    avatar: "AY",
    lastMessage: "The conference abstract has been accepted. Let's discuss the presentation.",
    timestamp: "Feb 12",
    unread: false,
    topic: "Research",
    messages: [
      { sender: "Prof. Yusuf", text: "Great news! Our abstract for the Pan-African Mental Health Conference has been accepted.", time: "Feb 12 11:00 AM", isMe: false },
      { sender: "Prof. Yusuf", text: "The conference abstract has been accepted. Let's discuss the presentation.", time: "Feb 12 11:02 AM", isMe: false },
      { sender: "Dr. Adeyemi", text: "Excellent! Let's schedule a meeting to prepare the presentation slides.", time: "Feb 12 11:30 AM", isMe: true },
    ],
  },
];

function AvatarCircle({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-xs";
  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ background: "linear-gradient(135deg, #058789, #5fc4eb)" }}
    >
      {initials}
    </div>
  );
}

export function MessagesView() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation>(conversations[0]);
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  const filtered = conversations.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = filterTab === "all" || (filterTab === "unread" && c.unread);
    return matchSearch && matchTab;
  });

  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-5 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-sm text-slate-400 mt-1">
          {unreadCount} unread conversation{unreadCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Chat layout */}
      <div className="flex gap-0 bg-[#1b2940] rounded-2xl border border-white/10 overflow-hidden flex-1 min-h-0">

        {/* ── Conversation List ─────────────────────────────────────── */}
        <div className="w-[320px] border-r border-white/10 flex flex-col flex-shrink-0">
          {/* Search + Filters */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="relative">
              <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/30 bg-[#0f1a2a] text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-1">
              {(["all", "unread", "archived"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                    filterTab === tab
                      ? "bg-white/10 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto scrollbar-brand">
            {filtered.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConvo(convo)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-white/[0.06] text-left transition-colors ${
                  selectedConvo.id === convo.id ? "bg-accent-blue/[0.08]" : "hover:bg-white/5"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <AvatarCircle initials={convo.avatar} />
                  {convo.unread && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-blue rounded-full border-2 border-[#1b2940]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm truncate ${convo.unread ? "font-semibold text-white" : "font-medium text-slate-300"}`}>
                      {convo.name}
                    </span>
                    <span className="text-[11px] text-slate-500 flex-shrink-0 ml-2">{convo.timestamp}</span>
                  </div>
                  <p className={`text-xs truncate ${convo.unread ? "text-slate-300" : "text-slate-500"}`}>
                    {convo.lastMessage}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/[0.06]">
                    {convo.topic}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Message Thread ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Thread header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <AvatarCircle initials={selectedConvo.avatar} size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">{selectedConvo.name}</p>
                <p className="text-[11px] text-slate-400">{selectedConvo.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[
                { icon: <UserPlusIcon size={15} />, title: "Assign" },
                { icon: <CheckCheckIcon size={15} />, title: "Mark read" },
                { icon: <ArchiveIcon size={15} />, title: "Archive" },
                { icon: <MoreHorizontalIcon size={15} />, title: "More" },
              ].map(({ icon, title }) => (
                <button
                  key={title}
                  title={title}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-brand">
            {selectedConvo.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div className="max-w-md">
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.isMe
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white/10 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[11px] text-slate-500 mt-1 ${msg.isMe ? "text-right" : ""}`}>
                    {msg.sender} · {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 text-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none pr-10 bg-[#0f1a2a] text-white placeholder:text-slate-500"
                />
                <button className="absolute right-3 bottom-3 text-slate-500 hover:text-slate-300 transition-colors">
                  <PaperclipIcon size={15} />
                </button>
              </div>
              <button className="p-3 bg-primary hover:bg-primary/80 text-white rounded-xl transition-colors flex-shrink-0 shadow-lg shadow-primary/20">
                <SendIcon size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
