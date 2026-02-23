import React from "react";
import { motion } from "framer-motion";
import {
  HeartIcon,
  FileTextIcon,
  Briefcase,
  UsersRoundIcon,
  CheckCircleIcon,
} from "lucide-react";
import {
  useNavigation,
  type WebsiteSubsection,
} from "../context/NavigationContext";
import { AboutEditor } from "../pages/AboutEditor";
import { BlogEditor } from "../pages/BlogEditor";
import { ServicesEditor } from "../pages/ServicesEditor";
import { TeamEditor } from "../pages/TeamEditor";
import { FaqEditor } from "./FaqEditor";

interface SectionCard {
  id: WebsiteSubsection;
  label: string;
  description: string;
  icon: React.ReactNode;
  lastEdited: string;
  status: "published" | "draft";
}

const sectionCards: SectionCard[] = [
  {
    id: "about",
    label: "About",
    description: "Mission, story, and core values",
    icon: <HeartIcon size={20} />,
    lastEdited: "1 day ago",
    status: "published",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Articles, news, and research posts",
    icon: <FileTextIcon size={20} />,
    lastEdited: "30 min ago",
    status: "published",
  },
  {
    id: "services",
    label: "Services",
    description: "Healthcare and clinical offerings",
    icon: <Briefcase size={20} />,
    lastEdited: "2 days ago",
    status: "published",
  },
  {
    id: "team",
    label: "Team",
    description: "Meet the ANCHOR professionals",
    icon: <UsersRoundIcon size={20} />,
    lastEdited: "1 day ago",
    status: "published",
  },
  {
    id: "why-choose-us",
    label: "Why Choose Us",
    description: "Key reasons to trust ANCHOR",
    icon: <CheckCircleIcon size={20} />,
    lastEdited: "3 days ago",
    status: "published",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
};

export function WebsiteEditor() {
  const { activeSubsection, setActiveSubsection } = useNavigation();

  // Render the correct sub-editor based on navigation context
  if (activeSubsection === "about") return <AboutEditor />;
  if (activeSubsection === "blog") return <BlogEditor />;
  if (activeSubsection === "services") return <ServicesEditor />;
  if (activeSubsection === "team") return <TeamEditor />;
  if (activeSubsection === "why-choose-us") return <FaqEditor />;

  // Overview grid
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-8 max-w-5xl mx-auto"
    >
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-semibold text-heading">Website</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage sections of the ANCHOR website
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {sectionCards.map((card) => (
          <motion.button
            key={card.id}
            variants={fadeUp}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.15 }}
            onClick={() => setActiveSubsection(card.id)}
            className="bg-white rounded-xl border border-border p-6 text-left hover:shadow-lg hover:border-slate-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                {card.icon}
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  card.status === "published"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {card.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <h3 className="text-base font-semibold text-heading mb-1">
              {card.label}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{card.description}</p>
            <p className="text-xs text-slate-400">
              Last edited {card.lastEdited}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}