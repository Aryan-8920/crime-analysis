import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Finding } from '../../types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  GitMerge,
  Filter,
  Check,
  Edit2
} from 'lucide-react';

export const AiInsightsView: React.FC = () => {
  const {
    findings,
    cases,
    activeCaseId,
    setActiveCaseId,
    updateFindingStatus,
    setSelectedEvidenceId,
    setActiveTab,
  } = useInvestigation();

  const [selectedCase, setSelectedCase] = useState<string>(activeCaseId || 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredFindings = findings.filter((f) => {
    const matchCase = selectedCase === 'all' || f.caseId === selectedCase;
    const matchCat = categoryFilter === 'all' || f.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || f.reviewStatus === statusFilter;
    return matchCase && matchCat && matchStatus;
  });

  const categories = Array.from(new Set(findings.map((f) => f.category)));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>AI-Assisted Investigation Leads & Discovered Insights</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based intelligence extraction identifying unusual fund dispersals, relay clusters, candidate duplicate identities, and corroboration gaps.
          </p>
        </div>

        {/* Case Scope */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <label className="text-slate-400">Case Scope:</label>
          <select
            value={selectedCase}
            onChange={(e) => {
              setSelectedCase(e.target.value);
              if (e.target.value !== 'all') setActiveCaseId(e.target.value);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="all">All Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Intelligence Heuristic Banner */}
      <div className="bg-[#090f19] border border-cyan-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-cyan-300 text-xs font-mono">
              AUTOMATED AI HEURISTIC CORRELATION ENGINE · CONFIDENCE 94%
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              Automated hypothesis generation isolating anomalous account velocities, dormant relay networks, and alias disambiguation. Leads are flagged for evidentiary confirmation.
            </p>
          </div>
        </div>

        <div className="shrink-0 font-mono text-[11px] text-emerald-400 bg-[#050a14] px-2.5 py-1 rounded border border-cyan-900/60 font-bold">
          HEURISTIC SCAN COMPLETE
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Finding Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Review Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Accepted">Accepted by Analyst</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-500">
          Showing {filteredFindings.length} investigation leads
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-cyan-400 font-bold text-[11px]">
                  {finding.id}
                </span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-slate-300">{finding.caseId}</span>
                <span className="text-slate-500">·</span>
                <span className="text-purple-400 font-semibold">{finding.category}</span>
                <span className="text-slate-500">·</span>
                <span
                  className={`font-semibold ${
                    finding.priority === 'High'
                      ? 'text-rose-400'
                      : finding.priority === 'Medium'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {finding.priority} Priority
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-emerald-400">
                  {Math.round(finding.confidence * 100)}% Confidence
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    finding.reviewStatus === 'Accepted'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : finding.reviewStatus === 'Rejected'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {finding.reviewStatus}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{finding.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{finding.description}</p>
            </div>

            {/* Supporting Evidence References & Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 text-[11px]">Supporting Evidence:</span>
                {finding.evidenceIds.map((evId) => (
                  <button
                    key={evId}
                    onClick={() => {
                      setSelectedEvidenceId(evId);
                      setActiveTab('evidence');
                    }}
                    className="font-mono text-[11px] text-cyan-400 hover:text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span>{evId}</span>
                  </button>
                ))}
              </div>

              {/* Review Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => updateFindingStatus(finding.id, 'Accepted')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    finding.reviewStatus === 'Accepted'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-800 hover:bg-emerald-900 text-slate-300 hover:text-emerald-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Lead</span>
                </button>
                <button
                  onClick={() => updateFindingStatus(finding.id, 'Rejected')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    finding.reviewStatus === 'Rejected'
                      ? 'bg-rose-700 text-white'
                      : 'bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-200'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
