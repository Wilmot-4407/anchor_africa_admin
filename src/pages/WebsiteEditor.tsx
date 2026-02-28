import React from "react";
import { motion } from "framer-motion";
import {
  HeartIcon,
  FileTextIcon,
  Briefcase,
  UsersRoundIcon,
  CheckCircleIcon,
  ChevronRight,
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
  color: string;
  bg: string;
}

const sectionCards: SectionCard[] = [
  {
    id: "about",
    label: "About",
    description: "Mission, story, and core values",
    icon: <HeartIcon size={22} />,
    color: "text-primary",
    bg: "bg-primary/8 group-hover:bg-primary group-hover:text-white",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Articles, news, and research posts",
    icon: <FileTextIcon size={22} />,
    color: "text-secondary",
    bg: "bg-secondary/10 group-hover:bg-secondary group-hover:text-white",
  },
  {
    id: "services",
    label: "Services",
    description: "Healthcare and clinical offerings",
    icon: <Briefcase size={22} />,
    color: "text-primary",
    bg: "bg-primary/8 group-hover:bg-primary group-hover:text-white",
  },
  {
    id: "team",
    label: "Team",
    description: "Meet the ANCHOR professionals",
    icon: <UsersRoundIcon size={22} />,
    color: "text-secondary",
    bg: "bg-secondary/10 group-hover:bg-secondary group-hover:text-white",
  },
  {
    id: "why-choose-us",
    label: "Why Choose Us",
    description: "Key reasons to trust ANCHOR",
    icon: <CheckCircleIcon size={22} />,
    color: "text-primary",
    bg: "bg-primary/8 group-hover:bg-primary group-hover:text-white",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
};

export function WebsiteEditor() {
  const { activeSubsection, setActiveSubsection } = useNavigation();

  if (activeSubsection === "about") return <AboutEditor />;
  if (activeSubsection === "blog") return <BlogEditor />;
  if (activeSubsection === "services") return <ServicesEditor />;
  if (activeSubsection === "team") return <TeamEditor />;
  if (activeSubsection === "why-choose-us") return <FaqEditor />;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-8 max-w-5xl mx-auto"
    >
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Website</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage all sections of the ANCHOR public website
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
            whileHover={{ y: -4 }}
            transition={{ duration: 0.15 }}
            onClick={() => setActiveSubsection(card.id)}
            className="bg-white rounded-xl border border-slate-200 p-6 text-left hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${card.color} ${card.bg}`}
              >
                {card.icon}
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Published
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">
              {card.label}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{card.description}</p>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Manage section <ChevronRight size={13} />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
