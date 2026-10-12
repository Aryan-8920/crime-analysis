import React from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { CasesView } from './components/cases/CasesView';
import { EvidenceVaultView } from './components/evidence/EvidenceVaultView';
import { EntityExplorerView } from './components/entities/EntityExplorerView';
import { NetworkGraphView } from './components/network/NetworkGraphView';
import { CommunicationAnalysisView } from './components/communication/CommunicationAnalysisView';
import { FinancialTrailView } from './components/financial/FinancialTrailView';
import { TimelineView } from './components/timeline/TimelineView';
import { AiInsightsView } from './components/insights/AiInsightsView';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useInvestigation();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 min-h-0">
      {activeTab === 'overview' && <OverviewDashboard />}
      {activeTab === 'cases' && <CasesView />}
      {activeTab === 'evidence' && <EvidenceVaultView />}
      {activeTab === 'entities' && <EntityExplorerView />}
      {activeTab === 'network' && <NetworkGraphView />}
      {activeTab === 'communication' && <CommunicationAnalysisView />}
      {activeTab === 'financial' && <FinancialTrailView />}
      {activeTab === 'timeline' && <TimelineView />}
      {activeTab === 'insights' && <AiInsightsView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'audit' && <AuditLogView />}
      {activeTab === 'settings' && <SettingsView />}
    </main>
  );
};

const WorkspaceShell: React.FC = () => {
  const { isAuthenticated, login } = useInvestigation();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden select-none">
      {/* Top Tactical Header */}
      <Header />

      {/* Workspace Shell */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Center Main Work Area */}
        <MainContent />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <InvestigationProvider>
      <WorkspaceShell />
    </InvestigationProvider>
  );
}
