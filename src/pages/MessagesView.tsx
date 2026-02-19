import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  ArchiveIcon,
  CheckCheckIcon,
  SendIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  PaperclipIcon } from
'lucide-react';
interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  topic: string;
  messages: {
    sender: string;
    text: string;
    time: string;
    isMe: boolean;
  }[];
}
const conversations: Conversation[] = [
{
  id: '1',
  name: 'Amara Nwosu',
  avatar: 'AN',
  lastMessage:
  'Thank you for the assessment report. I have a few questions about the recommendations.',
  timestamp: '10:30 AM',
  unread: true,
  topic: 'Assessment',
  messages: [
  {
    sender: 'Amara Nwosu',
    text: 'Good morning Dr. Adeyemi. I received the neuropsychological assessment report.',
    time: '10:15 AM',
    isMe: false
  },
  {
    sender: 'Dr. Adeyemi',
    text: 'Good morning Amara. I hope the report was clear. Please let me know if you have any questions.',
    time: '10:22 AM',
    isMe: true
  },
  {
    sender: 'Amara Nwosu',
    text: 'Thank you for the assessment report. I have a few questions about the recommendations.',
    time: '10:30 AM',
    isMe: false
  }]

},
{
  id: '2',
  name: 'Oluwaseun Bakare',
  avatar: 'OB',
  lastMessage: 'Can I reschedule my Thursday appointment to Friday?',
  timestamp: '9:45 AM',
  unread: true,
  topic: 'Scheduling',
  messages: [
  {
    sender: 'Oluwaseun Bakare',
    text: 'Hello, I need to reschedule my appointment this week.',
    time: '9:30 AM',
    isMe: false
  },
  {
    sender: 'Oluwaseun Bakare',
    text: 'Can I reschedule my Thursday appointment to Friday?',
    time: '9:45 AM',
    isMe: false
  }]

},
{
  id: '3',
  name: 'Dr. Okafor',
  avatar: 'NO',
  lastMessage: 'The research paper draft is ready for your review.',
  timestamp: 'Yesterday',
  unread: true,
  topic: 'Research',
  messages: [
  {
    sender: 'Dr. Okafor',
    text: "Hi Dr. Adeyemi, I've completed the draft for our joint research paper on neuropsych assessment outcomes.",
    time: 'Yesterday 4:30 PM',
    isMe: false
  },
  {
    sender: 'Dr. Okafor',
    text: 'The research paper draft is ready for your review.',
    time: 'Yesterday 4:32 PM',
    isMe: false
  }]

},
{
  id: '4',
  name: 'Fatima Bello',
  avatar: 'FB',
  lastMessage:
  "I wanted to share that I've been sober for 60 days now. Thank you for your support.",
  timestamp: 'Yesterday',
  unread: false,
  topic: 'General',
  messages: [
  {
    sender: 'Fatima Bello',
    text: "I wanted to share that I've been sober for 60 days now. Thank you for your support.",
    time: 'Yesterday 2:15 PM',
    isMe: false
  },
  {
    sender: 'Dr. Adeyemi',
    text: "That's wonderful news, Fatima! I'm so proud of your progress. Keep up the great work.",
    time: 'Yesterday 3:00 PM',
    isMe: true
  }]

},
{
  id: '5',
  name: 'Prof. Yusuf',
  avatar: 'AY',
  lastMessage:
  "The conference abstract has been accepted. Let's discuss the presentation.",
  timestamp: 'Feb 12',
  unread: false,
  topic: 'Research',
  messages: [
  {
    sender: 'Prof. Yusuf',
    text: 'Great news! Our abstract for the Pan-African Mental Health Conference has been accepted.',
    time: 'Feb 12 11:00 AM',
    isMe: false
  },
  {
    sender: 'Prof. Yusuf',
    text: "The conference abstract has been accepted. Let's discuss the presentation.",
    time: 'Feb 12 11:02 AM',
    isMe: false
  },
  {
    sender: 'Dr. Adeyemi',
    text: "Excellent! Let's schedule a meeting to prepare the presentation slides.",
    time: 'Feb 12 11:30 AM',
    isMe: true
  }]

}];

export function MessagesView() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation>(
    conversations[0]
  );
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'archived'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = conversations.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = filterTab === 'all' || filterTab === 'unread' && c.unread;
    return matchSearch && matchTab;
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
      className="p-8 h-full">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy-950">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">
          {conversations.filter((c) => c.unread).length} unread conversations
        </p>
      </div>

      <div className="flex gap-0 bg-white rounded-xl border border-border overflow-hidden h-[calc(100vh-220px)]">
        {/* Conversation List */}
        <div className="w-[340px] border-r border-border flex flex-col flex-shrink-0">
          {/* Search + Filters */}
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <SearchIcon
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-slate-50" />

            </div>
            <div className="flex items-center gap-1">
              {(['all', 'unread', 'archived'] as const).map((tab) =>
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${filterTab === tab ? 'bg-slate-100 text-navy-950' : 'text-slate-400 hover:text-slate-600'}`}>

                  {tab}
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((convo) =>
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-border/50 text-left transition-colors ${selectedConvo.id === convo.id ? 'bg-accent/5' : 'hover:bg-slate-50'}`}>

                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold">
                    {convo.avatar}
                  </div>
                  {convo.unread &&
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-white" />
                }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                    className={`text-sm truncate ${convo.unread ? 'font-semibold text-navy-950' : 'font-medium text-slate-700'}`}>

                      {convo.name}
                    </span>
                    <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
                      {convo.timestamp}
                    </span>
                  </div>
                  <p
                  className={`text-xs truncate ${convo.unread ? 'text-slate-600' : 'text-slate-400'}`}>

                    {convo.lastMessage}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {convo.topic}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold">
                {selectedConvo.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-950">
                  {selectedConvo.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {selectedConvo.topic}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Assign to staff">

                <UserPlusIcon size={16} />
              </button>
              <button
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Mark as read">

                <CheckCheckIcon size={16} />
              </button>
              <button
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Archive">

                <ArchiveIcon size={16} />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreHorizontalIcon size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {selectedConvo.messages.map((msg, i) =>
            <div
              key={i}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>

                <div className={`max-w-md ${msg.isMe ? 'order-1' : ''}`}>
                  <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${msg.isMe ? 'bg-navy-950 text-white rounded-br-md' : 'bg-slate-100 text-navy-950 rounded-bl-md'}`}>

                    {msg.text}
                  </div>
                  <p
                  className={`text-[11px] text-slate-400 mt-1 ${msg.isMe ? 'text-right' : ''}`}>

                    {msg.sender} · {msg.time}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reply */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none pr-10" />

                <button className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 transition-colors">
                  <PaperclipIcon size={16} />
                </button>
              </div>
              <button className="p-3 bg-accent hover:bg-accent-hover text-navy-950 rounded-xl transition-colors flex-shrink-0">
                <SendIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}