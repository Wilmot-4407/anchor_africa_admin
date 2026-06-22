import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { formTemplates, instantiateTemplate, type FormTemplate } from '../../data/formTemplates';
import { FormBuilderCore, type BuilderSavePayload } from '../../components/campaigns/FormBuilderCore';
import type { AppDispatch, RootState } from '../../redux/store';
import type { CampaignFormCategory } from '../../redux/types';
import { createForm } from '../../redux/actions/forms';

type Stage = 'picker' | 'builder';

interface BuilderState {
  title: string;
  description: string;
  category: CampaignFormCategory;
  template: FormTemplate;
}

const TEMPLATE_CATEGORY_MAP: Record<string, CampaignFormCategory> = {
  blank: 'Custom',
  registration: 'Registration',
  contact: 'Contact',
  intake: 'Intake',
  feedback: 'Feedback',
  survey: 'Survey',
};

function TemplatePicker({ onSelect }: { onSelect: (tpl: FormTemplate) => void }) {
  return (
    <div className="min-h-full p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Create a New Form</h2>
          <p className="text-slate-400 text-sm">
            Start from a ready-made template or build any form from scratch.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formTemplates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              className="group text-left bg-[#1b2940] rounded-2xl border border-white/10 p-6 hover:border-accent-blue/50 hover:bg-[#1f2e48] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-4 group-hover:bg-accent-blue group-hover:text-[#0f1a2a] transition-colors">
                <tpl.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white mb-1">{tpl.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormCreateView() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isSaving } = useSelector((state: RootState) => state.forms);

  const [stage, setStage] = useState<Stage>('picker');
  const [builderState, setBuilderState] = useState<BuilderState | null>(null);

  const handleSelectTemplate = (tpl: FormTemplate) => {
    setBuilderState({
      title: tpl.title,
      description: tpl.formDescription,
      category: TEMPLATE_CATEGORY_MAP[tpl.id] ?? 'Custom',
      template: tpl,
    });
    setStage('builder');
  };

  const handleSave = async (payload: BuilderSavePayload) => {
    try {
      const result = await dispatch(
        createForm({
          title: payload.title,
          description: payload.description,
          category: builderState?.category ?? 'Custom',
          fields: payload.fields.map(f => ({
            id: f.id,
            type: f.type,
            question: f.question,
            required: f.required,
            options: f.options,
            helpText: f.helpText,
            placeholder: f.placeholder,
          })),
          settings: { isPublished: payload.status === 'active' },
        }),
      ).unwrap();
      navigate(`/forms/${result._id}`);
    } catch {
      // error already handled by action with toast
    }
  };

  if (stage === 'picker' || !builderState) {
    return (
      <div className="flex flex-col h-full">
        {/* Back bar */}
        <div className="bg-[#111d2e] border-b border-white/[0.06] px-6 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/forms')}
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-400">Campaign Forms</span>
          <span className="text-slate-600">/</span>
          <span className="text-sm font-medium text-white">New Form</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-brand">
          <TemplatePicker onSelect={handleSelectTemplate} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Back bar */}
      <div className="bg-[#111d2e] border-b border-white/[0.06] px-6 py-2 flex items-center gap-3 shrink-0">
        <button
          onClick={() => setStage('picker')}
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-500">Campaign Forms / New Form /</span>
        <span className="text-xs font-medium text-slate-300">{builderState.title}</span>
      </div>

      {/* Builder */}
      <div className="flex-1 overflow-hidden">
        <FormBuilderCore
          initialTitle={builderState.title}
          initialDescription={builderState.description}
          initialFields={instantiateTemplate(builderState.template)}
          onSave={handleSave}
          saveLabel="Save Draft"
          publishLabel="Publish Form"
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
