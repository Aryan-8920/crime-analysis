import React from 'react';
import { useInvestigation, NavTab } from '../../context/InvestigationContext';
import { soundFX } from '../../utils/soundEffects';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Network,
  PhoneCall,
  DollarSign,
  Clock,
  Sparkles,
  FileCheck2,
  ScrollText,
  Settings,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: (ctx: ReturnType<typeof useInvestigation>) => number | string;
}

export const Sidebar: React.FC = () => {
  const ctx = useInvestigation();
  const { activeTab, setActiveTab, activeCase, cases, evidence, entities, findings } = ctx;

  const currentCaseEvidenceCount = evidence.filter((e) => e.caseId === activeCase.id).length;
  const currentCaseEntityCount = entities.filter((e) => e.caseId === activeCase.id).length;
  const currentCaseFindingCount = findings.filter(
    (f) => f.caseId === activeCase.id && f.reviewStatus === 'Pending Review'
  ).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Dockets', icon: Briefcase, badgeCount: () => cases.length },
    { id: 'evidence', label: 'Evidence Vault', icon: FileText, badgeCount: () => currentCaseEvidenceCount },
    { id: 'entities', label: 'Entity Registry', icon: Users, badgeCount: () => currentCaseEntityCount },
    { id: 'network', label: 'Network Analysis', icon: Network },
    { id: 'communication', label: 'Telecommunications', icon: PhoneCall },
    { id: 'financial', label: 'Financial Trail', icon: DollarSign },
    { id: 'timeline', label: 'Incident Timeline', icon: Clock },
    {
      id: 'insights',
      label: 'AI Insights Command',
      icon: Sparkles,
      badgeCount: () => (currentCaseFindingCount > 0 ? currentCaseFindingCount : ''),
    },
    { id: 'reports', label: 'Investigation Dossier', icon: FileCheck2 },
    { id: 'audit', label: 'Compliance Audit Log', icon: ScrollText },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#060a12] border-r border-cyan-950/70 flex flex-col shrink-0 text-slate-300 select-none shadow-2xl">
      {/* Current Active Case Context Box */}
      <div className="p-3.5 border-b border-cyan-950/70 bg-[#080e1a]/80">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-cyan-400/90 font-mono tracking-wider">
          <span>Active Case Context</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono">
          <span className="text-xs font-bold text-cyan-300">{activeCase.id}</span>
          <span className="text-[10px] text-rose-400 font-semibold">
            {activeCase.priority} Priority
          </span>
        </div>
        <div className="text-xs font-semibold text-white truncate mt-0.5" title={activeCase.title}>
          {activeCase.title}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = item.badgeCount ? item.badgeCount(ctx) : undefined;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950 via-[#0a182c] to-[#0a182c] text-cyan-200 border border-cyan-500/50 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                {badge !== undefined && badge !== '' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? 'bg-cyan-900/90 text-cyan-200'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-cyan-950/70 bg-[#05080e] text-[10px] font-mono text-slate-500 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>CORE ENGINE</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE 100%
          </span>
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          6 Cases Synchronized · Sub-millisecond BFS
        </div>
      </div>
    </aside>
  );
};
