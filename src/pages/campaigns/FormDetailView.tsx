import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Hammer, InboxIcon, BarChart3, Share2, FileText,
  Edit2, Globe, AlertTriangle, Loader2,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../redux/store';
import type { FieldType } from '../../data/formFieldTypes';
import { fetchForm, updateForm, publishForm } from '../../redux/actions/forms';
import { clearCurrentForm } from '../../redux/slices/formsSlice';
import { FormBuilderCore, type BuilderSavePayload } from '../../components/campaigns/FormBuilderCore';
import { ResponsesTable } from '../../components/campaigns/ResponsesTable';
import { AnalyticsCards } from '../../components/campaigns/AnalyticsCards';
import { ShareLinkPanel } from '../../components/campaigns/ShareLinkPanel';

type TabId = 'builder' | 'responses' | 'analytics' | 'share';

const TABS: { id: TabId; label: string; icon: typeof Hammer }[] = [
  { id: 'builder', label: 'Builder', icon: Hammer },
  { id: 'responses', label: 'Responses', icon: InboxIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'share', label: 'Share Link', icon: Share2 },
];

const STATUS_STYLES = {
  active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  draft: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  archived: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
} as const;

export function FormDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { currentForm, isLoading, isSaving, error } = useSelector(
    (state: RootState) => state.forms,
  );

  const paramTab = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    paramTab && TABS.find(t => t.id === paramTab) ? paramTab : 'builder',
  );

  // Fetch form on mount; clear on unmount
  useEffect(() => {
    if (id) {
      dispatch(clearCurrentForm());
      dispatch(fetchForm(id));
    }
    return () => { dispatch(clearCurrentForm()); };
  }, [dispatch, id]);

  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', activeTab);
      return next;
    }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Normalize backend field _id -> id for the builder
  const normalizedFields = useMemo(
    () => (currentForm?.fields ?? []).map(f => ({
      id: (f._id ?? f.id ?? Math.random().toString(36).slice(2, 9)),
      type: f.type as FieldType,
      question: f.question,
      required: f.required,
      options: f.options,
      helpText: f.helpText,
      placeholder: f.placeholder,
      colSpan: f.colSpan as 1 | 2 | undefined,
    })),
    [currentForm?.fields],
  );

  const switchTab = (tab: TabId) => setActiveTab(tab);

  const handleSave = async (payload: BuilderSavePayload) => {
    if (!currentForm) return;
    dispatch(updateForm({
      id: currentForm._id,
      data: {
        title: payload.title,
        description: payload.description,
        fields: payload.fields.map(f => ({ _id: f.id, ...f })),
        status: payload.status,
      },
    }));
  };

  const handlePublish = () => {
    if (!currentForm) return;
    dispatch(publishForm(currentForm._id));
  };

  // Loading state
  if (isLoading && !currentForm) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
        <p className="text-slate-400 text-sm">Loading form…</p>
      </div>
    );
  }

  // Not found / error
  if (!currentForm && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-red-400/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Form Not Found</h2>
          <p className="text-slate-400 text-sm mt-1.5">
            {error ?? "The form you're looking for doesn't exist or has been deleted."}
          </p>
        </div>
        <button
          onClick={() => navigate('/forms')}
          className="flex items-center gap-2 bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forms
        </button>
      </div>
    );
  }

  if (!currentForm) return null;

  const statusStyle = STATUS_STYLES[currentForm.status] ?? STATUS_STYLES.draft;

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="bg-[#111d2e] border-b border-white/[0.06] px-6 py-4 shrink-0">
        {/* Breadcrumb + back */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate('/forms')}
            className="p-1.5 -ml-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500">Campaign Forms</span>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-300 font-medium truncate max-w-xs">{currentForm.title}</span>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-accent-blue" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white truncate">{currentForm.title}</h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className={`text-[11px] font-semibold border rounded-full px-2 py-0.5 capitalize ${statusStyle}`}>
                  {currentForm.status}
                </span>
                <span className="text-xs text-slate-500">{currentForm.category}</span>
                <span className="w-px h-3 bg-white/10" />
                <span className="text-xs text-slate-500">
                  {currentForm.fieldCount} field{currentForm.fieldCount !== 1 ? 's' : ''}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span className="text-xs text-slate-500">
                  {currentForm.responseCount} response{currentForm.responseCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 shrink-0">
            {currentForm.status !== 'active' && (
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                Publish
              </button>
            )}
            {activeTab !== 'builder' && (
              <button
                onClick={() => switchTab('builder')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Form
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4 -mb-4">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-accent-blue border-accent-blue'
                    : 'text-slate-400 border-transparent hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === 'responses' && currentForm.responseCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/10 text-slate-400'
                  }`}>
                    {currentForm.responseCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            {activeTab === 'builder' && (
              <div className="h-full overflow-hidden">
                <FormBuilderCore
                  initialTitle={currentForm.title}
                  initialDescription={currentForm.description}
                  initialFields={normalizedFields}
                  onSave={handleSave}
                  saveLabel="Save Changes"
                  publishLabel="Publish"
                  isSaving={isSaving}
                />
              </div>
            )}

            {activeTab === 'responses' && (
              <div className="overflow-y-auto h-full scrollbar-brand">
                <div className="p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-white">Responses</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {currentForm.responseCount > 0
                        ? `${currentForm.responseCount} submission${currentForm.responseCount !== 1 ? 's' : ''} collected`
                        : 'No responses yet — share your form to start collecting'}
                    </p>
                  </div>
                  <ResponsesTable formId={currentForm._id} />
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="overflow-y-auto h-full scrollbar-brand">
                <div className="p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-white">Analytics</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Performance metrics for <span className="text-white font-medium">{currentForm.title}</span>
                    </p>
                  </div>
                  <AnalyticsCards formId={currentForm._id} />
                </div>
              </div>
            )}

            {activeTab === 'share' && (
              <div className="overflow-y-auto h-full scrollbar-brand">
                <div className="p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-white">Share This Form</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Copy the link, embed the form, or share via QR code
                    </p>
                  </div>
                  <ShareLinkPanel form={currentForm} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
