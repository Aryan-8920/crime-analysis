import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Clock,
  User,
  ShieldAlert
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, cases } = useInvestigation();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [caseFilter, setCaseFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchCase = caseFilter === 'all' || log.relatedCaseId === caseFilter;
    const matchAction = actionFilter === 'all' || log.action === actionFilter;
    const matchSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      (log.relatedRecordId && log.relatedRecordId.toLowerCase().includes(search.toLowerCase()));
    return matchCase && matchAction && matchSearch;
  });

  const actions = Array.from(new Set(auditLogs.map((l) => l.action)));

  const handleExportCSV = () => {
    const headers = ['LogID', 'Timestamp', 'Actor', 'Action', 'RelatedCase', 'RelatedRecord', 'Description'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      `"${l.action}"`,
      l.relatedCaseId || '',
      l.relatedRecordId || '',
      `"${l.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `audit_trail_export_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <span>Operational Audit Trail & Action Journal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable chain recording all analyst modifications, evidence ingestion, candidate approvals, and entity disambiguation operations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search action, actor, record ID, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Actions</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>

          {/* Case Scope */}
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Analyst / Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Case</th>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-sans text-cyan-300 font-medium">{log.actor}</td>
                  <td className="px-4 py-3 font-sans text-white font-semibold">{log.action}</td>
                  <td className="px-4 py-3 text-purple-400">{log.relatedCaseId || '-'}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">{log.relatedRecordId || '-'}</td>
                  <td className="px-4 py-3 font-sans text-slate-300 max-w-sm leading-snug">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="bg-[#050a14] border border-cyan-950/80 rounded-lg p-2.5 text-xs text-slate-400 flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            CRYPTOGRAPHIC AUDIT COMPLIANCE // All investigator modifications, entity merges, and evidence extractions are immutably signed with analyst attribution.
          </span>
        </div>
        <span className="text-emerald-400 text-[11px] font-bold">TAMPER RESISTANT</span>
      </div>
    </div>
  );
};
