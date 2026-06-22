import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { FormsListView } from './campaigns/FormsListView';
import { FormCreateView } from './campaigns/FormCreateView';
import { FormDetailView } from './campaigns/FormDetailView';

export function CampaignForms() {
  return (
    <div className="flex h-screen bg-[#0f1a2a] font-sans text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-brand">
          <Routes>
            <Route index element={<FormsListView />} />
            <Route path="new" element={<FormCreateView />} />
            <Route path=":id" element={<FormDetailView />} />
            <Route path="*" element={<Navigate to="/forms" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
