import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  StarIcon,
  GripVerticalIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon } from
'lucide-react';
interface Testimonial {
  id: string;
  name: string;
  position: string;
  program: string;
  quote: string;
  rating: number;
  featured: boolean;
  visible: boolean;
  avatar: string;
}
const testimonials: Testimonial[] = [
{
  id: '1',
  name: 'Amara Nwosu',
  position: 'Business Executive',
  program: 'Executive Wellness Program',
  quote:
  'ANCHOR transformed my understanding of mental health. The neuropsychological assessment was thorough and the follow-up care exceptional. I now have tools to manage workplace stress effectively.',
  rating: 5,
  featured: true,
  visible: true,
  avatar: 'AN'
},
{
  id: '2',
  name: 'Oluwaseun Bakare',
  position: 'University Lecturer',
  program: 'Counseling & Psychotherapy',
  quote:
  "The counseling sessions at ANCHOR helped me navigate a very difficult period. Dr. Mensah's culturally-sensitive approach made all the difference in my recovery journey.",
  rating: 5,
  featured: true,
  visible: true,
  avatar: 'OB'
},
{
  id: '3',
  name: 'Fatima Bello',
  position: 'Healthcare Worker',
  program: 'Trauma-Focused Therapy',
  quote:
  "After years of working in emergency care, I was experiencing burnout and secondary trauma. ANCHOR's specialized treatment program gave me my life back.",
  rating: 4,
  featured: false,
  visible: true,
  avatar: 'FB'
},
{
  id: '4',
  name: 'Chukwuemeka Eze',
  position: 'Graduate Student',
  program: 'Institute of Mental Health',
  quote:
  "The diploma program at ANCHOR's Institute is world-class. The faculty are brilliant and the curriculum is perfectly tailored to the African mental health landscape.",
  rating: 5,
  featured: false,
  visible: true,
  avatar: 'CE'
},
{
  id: '5',
  name: 'Ngozi Adichie',
  position: 'Community Leader',
  program: 'Community Outreach',
  quote:
  "ANCHOR's community outreach program has made mental health services accessible to our community for the first time. Their dedication to advocacy is truly inspiring.",
  rating: 5,
  featured: true,
  visible: true,
  avatar: 'NA'
}];

const stagger = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};
export function TestimonialsManager() {
  const [items, setItems] = useState(testimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const toggleFeatured = (id: string) => {
    setItems((prev) =>
    prev.map((t) =>
    t.id === id ?
    {
      ...t,
      featured: !t.featured
    } :
    t
    )
    );
  };
  const toggleVisible = (id: string) => {
    setItems((prev) =>
    prev.map((t) =>
    t.id === id ?
    {
      ...t,
      visible: !t.visible
    } :
    t
    )
    );
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
          <h1 className="text-2xl font-semibold text-navy-950">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} testimonials ·{' '}
            {items.filter((t) => t.featured).length} featured
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">
          <PlusIcon size={16} />
          Add Testimonial
        </button>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {items.map((t) => {
          const isEditing = editingId === t.id;
          return (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className={`bg-white rounded-xl border p-5 transition-all ${!t.visible ? 'opacity-50' : ''} ${isEditing ? 'border-accent shadow-md' : 'border-border'}`}>

              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center text-slate-300 cursor-grab flex-shrink-0 mt-1">
                  <GripVerticalIcon size={14} />
                </div>
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ?
                  <input
                    type="text"
                    defaultValue={t.name}
                    className="w-full text-sm font-semibold text-navy-950 border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent/30" /> :


                  <h3 className="text-sm font-semibold text-navy-950">
                      {t.name}
                    </h3>
                  }
                  {isEditing ?
                  <input
                    type="text"
                    defaultValue={t.position}
                    className="w-full text-xs text-slate-500 border border-border rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-accent/30" /> :


                  <p className="text-xs text-slate-500">{t.position}</p>
                  }
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleFeatured(t.id)}
                    className={`p-1 rounded transition-colors ${t.featured ? 'text-accent' : 'text-slate-300 hover:text-slate-400'}`}
                    title={
                    t.featured ? 'Remove from featured' : 'Mark as featured'
                    }>

                    <SparklesIcon size={16} />
                  </button>
                  <button
                    onClick={() => toggleVisible(t.id)}
                    className={`p-1 rounded transition-colors ${t.visible ? 'text-slate-400 hover:text-slate-600' : 'text-slate-300'}`}
                    title={t.visible ? 'Hide' : 'Show'}>

                    {t.visible ?
                    <EyeIcon size={16} /> :

                    <EyeOffIcon size={16} />
                    }
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-3 ml-10">
                {[1, 2, 3, 4, 5].map((star) =>
                <StarIcon
                  key={star}
                  size={14}
                  className={
                  star <= t.rating ?
                  'text-amber-400 fill-amber-400' :
                  'text-slate-200'
                  } />

                )}
              </div>

              {/* Quote */}
              <div className="ml-10">
                {isEditing ?
                <textarea
                  rows={3}
                  defaultValue={t.quote}
                  className="w-full text-sm text-slate-600 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" /> :


                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    "{t.quote}"
                  </p>
                }
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                    {t.program}
                  </span>
                  <button
                    onClick={() => setEditingId(isEditing ? null : t.id)}
                    className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">

                    {isEditing ? 'Done' : 'Edit'}
                  </button>
                </div>
              </div>
            </motion.div>);

        })}
      </motion.div>
    </motion.div>);

}