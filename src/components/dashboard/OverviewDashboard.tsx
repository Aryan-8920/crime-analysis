import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { soundFX } from '../../utils/soundEffects';
import {
  Briefcase,
  FileText,
  Users,
  Network,
  AlertCircle,
  FileCheck2,
  DollarSign,
  PhoneCall,
  Clock,
  Play,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    cases,
    evidence,
    entities,
    relationships,
    findings,
    timeline,
    auditLogs,
    setActiveCaseId,
    setActiveTab,
  } = useInvestigation();

  const totalCases = cases.length;
  const totalEvidence = evidence.length;
  const totalEntities = entities.length;
  const totalRelationships = relationships.length;
  const highPriorityLeads = findings.filter((f) => f.priority === 'High').length;
  const reportsGenerated = 4;

  const priorityCount = {
    High: cases.filter((c) => c.priority === 'High').length,
    Medium: cases.filter((c) => c.priority === 'Medium').length,
    Low: cases.filter((c) => c.priority === 'Low').length,
  };

  const evidenceTypeCounts = evidence.reduce((acc, ev) => {
    acc[ev.type] = (acc[ev.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentCases = [...cases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
  const recentActivities = [...timeline].slice(0, 6);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Intelligence Command Center */}
      <div className="bg-gradient-to-r from-[#070e1b] via-[#091322] to-[#040810] border border-cyan-900/50 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded flex items-center gap-1.5">
                <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                COMMAND HEADQUARTERS // LIVE FORENSICS CONSOLE
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-mono">6 DOCKETS SYNCHRONIZED</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1.5 tracking-tight">
              Operational Criminal Network Intelligence Center
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Consolidated workspace indexing forensic evidence, multi-hop entity graphs, financial transfer corridors, and telecommunication relay analysis across 6 active investigation cases.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveCaseId('DEMO-2026-001');
                setActiveTab('network');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/80 transition-all cursor-pointer ring-1 ring-cyan-300/40"
            >
              <Network className="w-3.5 h-3.5 text-cyan-200" />
              <span>Explore Network Graph</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveCaseId('DEMO-2026-001');
                setActiveTab('financial');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#090f19] hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Financial Trail</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveCaseId('DEMO-2026-001');
                setActiveTab('evidence');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#090f19] hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Summary Data Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Cases */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('cases');
          }}
          className="bg-[#090f19]/90 border border-slate-800/90 hover:border-cyan-500/60 rounded-xl p-3.5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Active Dockets</span>
            <Briefcase className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalCases}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>6 Major Investigations</span>
          </div>
        </div>

        {/* Card 2: Evidence Records */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('evidence');
          }}
          className="bg-[#090f19]/90 border border-slate-800/90 hover:border-emerald-500/60 rounded-xl p-3.5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Evidence Files</span>
            <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalEvidence}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>FIRs, CDRs, Statements</span>
          </div>
        </div>

        {/* Card 3: Identified Entities */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('entities');
          }}
          className="bg-[#090f19]/90 border border-slate-800/90 hover:border-blue-500/60 rounded-xl p-3.5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Entities Indexed</span>
            <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalEntities}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Persons, Accounts, Devices</span>
          </div>
        </div>

        {/* Card 4: Network Links */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('network');
          }}
          className="bg-[#090f19]/90 border border-slate-800/90 hover:border-purple-500/60 rounded-xl p-3.5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Topology Links</span>
            <Network className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalRelationships}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Cross-Correlated Edges</span>
          </div>
        </div>

        {/* Card 5: Priority Leads */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('insights');
          }}
          className="bg-[#090f19]/90 border border-slate-800/90 hover:border-amber-500/60 rounded-xl p-3.5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Priority Leads</span>
            <AlertCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{highPriorityLeads}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Immediate Review Required</span>
          </div>
        </div>

        {/* Card 6: Reports Ready */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('reports');
          }}
          className="bg-[#090f19]/90 border border-slate-800/90 hover:border-teal-500/60 rounded-xl p-3.5 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Reports Certified</span>
            <FileCheck2 className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{reportsGenerated}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Dossiers Ready for Filing</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Cases (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#090f19]/90 border border-slate-800/90 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Active Criminal Investigation Cases
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('cases');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All 6 Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {recentCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveCaseId(c.id);
                    setActiveTab('cases');
                  }}
                  className="py-3 px-2 -mx-2 hover:bg-cyan-950/30 rounded-lg transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono font-bold text-cyan-400">{c.id}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300 font-medium">{c.category}</span>
                      <span className="text-slate-500">·</span>
                      <span
                        className={`font-mono font-bold text-[11px] ${
                          c.priority === 'High'
                            ? 'text-rose-400'
                            : c.priority === 'Medium'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {c.priority} Priority
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate">{c.title}</div>
                    <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>
                  </div>

                  <div className="shrink-0 text-right sm:pl-3 font-mono">
                    <span className="text-[11px] font-bold text-emerald-400 block">
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investigation Analytics & Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority & Status Distribution */}
            <div className="bg-[#090f19]/90 border border-slate-800/90 rounded-xl p-4 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Case Priority Distribution
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-mono">
                    <span>High Priority</span>
                    <span className="text-rose-400 font-bold">{priorityCount.High} cases</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-rose-500 h-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                      style={{ width: `${(priorityCount.High / totalCases) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-mono">
                    <span>Medium Priority</span>
                    <span className="text-amber-400 font-bold">{priorityCount.Medium} cases</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-amber-500 h-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      style={{ width: `${(priorityCount.Medium / totalCases) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-mono">
                    <span>Low Priority</span>
                    <span className="text-slate-400 font-bold">{priorityCount.Low} cases</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-slate-500 h-full"
                      style={{ width: `${(priorityCount.Low / totalCases) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Ingestion Breakdown */}
            <div className="bg-[#090f19]/90 border border-slate-800/90 rounded-xl p-4 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Evidence Category Intake
              </h3>
              <div className="space-y-1.5 text-xs">
                {Object.entries(evidenceTypeCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-300 truncate">{type}</span>
                    <span className="font-mono text-cyan-300 font-bold">{count} docs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream & Fast Tracks */}
        <div className="space-y-4">
          {/* Quick Actions Panel */}
          <div className="bg-[#090f19]/90 border border-slate-800/90 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono text-cyan-400">
              Investigation Fast Tracks
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveCaseId('DEMO-2026-001');
                  setActiveTab('cases');
                }}
                className="p-2.5 bg-[#050a14] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/60 rounded-lg text-left transition-all cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="font-bold text-white">Blue Ledger</div>
                <div className="text-[10px] text-slate-400 font-mono">Case 001</div>
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveCaseId('DEMO-2026-001');
                  setActiveTab('evidence');
                }}
                className="p-2.5 bg-[#050a14] hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/60 rounded-lg text-left transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-bold text-white">Inspect FIR</div>
                <div className="text-[10px] text-slate-400 font-mono">FIR-DEMO-001</div>
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveCaseId('DEMO-2026-002');
                  setActiveTab('communication');
                }}
                className="p-2.5 bg-[#050a14] hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/60 rounded-lg text-left transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-bold text-white">Silent Call CDR</div>
                <div className="text-[10px] text-slate-400 font-mono">Case 002</div>
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveCaseId('DEMO-2026-001');
                  setActiveTab('reports');
                }}
                className="p-2.5 bg-[#050a14] hover:bg-teal-950/40 border border-slate-800 hover:border-teal-500/60 rounded-lg text-left transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-teal-400 mb-1" />
                <div className="font-bold text-white">Generate Dossier</div>
                <div className="text-[10px] text-slate-400 font-mono">Print / CSV</div>
              </button>
            </div>
          </div>

          {/* Chronological Event Activity Stream */}
          <div className="bg-[#090f19]/90 border border-slate-800/90 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Investigation Journal
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('audit');
                }}
                className="text-[11px] text-slate-400 hover:text-cyan-300 font-mono"
              >
                Audit Log &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="text-xs flex gap-2.5 items-start">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></div>
                  <div className="min-w-0">
                    <div className="text-slate-200 leading-snug">{act.description}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                      <span className="text-cyan-400">{act.caseId}</span>
                      <span>·</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Graph Preview Card */}
          <div className="bg-[#090f19]/90 border border-slate-800/90 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono text-purple-400">
                <Network className="w-3.5 h-3.5" />
                Topology Cluster Metrics
              </h3>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveCaseId('DEMO-2026-001');
                  setActiveTab('network');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold font-mono"
              >
                Launch Graph &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Signatories in Operation Blue Ledger form a multi-hop cluster connecting source remitter Rahul Sharma to terminal recipients Vikas Singh and Neeraj Gupta.
            </p>
            <div className="bg-[#050a14] border border-slate-800 rounded-lg p-3 flex items-center justify-around text-center font-mono">
              <div>
                <div className="text-sm font-bold text-cyan-400">5</div>
                <div className="text-[10px] text-slate-400 font-sans">Persons</div>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <div className="text-sm font-bold text-emerald-400">5</div>
                <div className="text-[10px] text-slate-400 font-sans">Bank Accounts</div>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <div className="text-sm font-bold text-amber-400">4</div>
                <div className="text-[10px] text-slate-400 font-sans">Transfers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
