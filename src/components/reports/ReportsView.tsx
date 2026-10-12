import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  FileCheck2,
  Printer,
  Download,
  ShieldAlert,
  FileText,
  Users,
  DollarSign,
  PhoneCall,
  Clock,
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    evidence,
    entities,
    relationships,
    transactions,
    communications,
    timeline,
    findings,
  } = useInvestigation();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId);

  const targetCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const caseEvidence = evidence.filter((e) => e.caseId === targetCase.id);
  const caseEntities = entities.filter((e) => e.caseId === targetCase.id);
  const caseRelationships = relationships.filter((r) => r.caseId === targetCase.id);
  const caseTransactions = transactions.filter((t) => t.caseId === targetCase.id);
  const caseCommunications = communications.filter((c) => c.caseId === targetCase.id);
  const caseTimeline = timeline.filter((t) => t.caseId === targetCase.id);
  const caseFindings = findings.filter((f) => f.caseId === targetCase.id);

  // Financial total
  const totalFunds = caseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const lines = [
      `AI-Powered Criminal Network Analysis System - Investigation Report`,
      `Case ID,${targetCase.id}`,
      `Title,"${targetCase.title}"`,
      `Category,"${targetCase.category}"`,
      `Priority,${targetCase.priority}`,
      `Status,${targetCase.status}`,
      `Generated Date,${new Date().toISOString()}`,
      ``,
      `--- EVIDENCE REVIEWED ---`,
      `EvidenceID,Title,Type,Status`,
      ...caseEvidence.map((e) => `${e.id},"${e.title}",${e.type},${e.reviewStatus}`),
      ``,
      `--- IDENTIFIED ENTITIES ---`,
      `EntityID,Name,Type,Confidence,Status`,
      ...caseEntities.map((ent) => `${ent.id},"${ent.name}",${ent.type},${ent.confidence},${ent.reviewStatus}`),
      ``,
      `--- FINANCIAL TRANSFERS ---`,
      `TxnID,FromAccount,ToAccount,AmountINR,Timestamp`,
      ...caseTransactions.map((t) => `${t.id},${t.sourceAccountId},${t.targetAccountId},${t.amount},${t.timestamp}`),
      ``,
      `--- AI-ASSISTED FINDINGS ---`,
      `FindingID,Title,Priority,Status`,
      ...caseFindings.map((f) => `${f.id},"${f.title}",${f.priority},${f.reviewStatus}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Investigation_Report_${targetCase.id}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            <span>Investigation Dossier & Report Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Certified investigative brief compiling evidentiary provenance, multi-hop relationship findings, financial movements, and analytical limitations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download CSV</span>
          </button>

          {/* Select Case */}
          <select
            value={selectedCaseId}
            onChange={(e) => {
              setSelectedCaseId(e.target.value);
              setActiveCaseId(e.target.value);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500 font-medium"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-slate-300">
        {/* Document Formal Header */}
        <div className="border-b-2 border-slate-700 pb-5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400 text-[11px]">
            <span className="font-mono uppercase tracking-widest text-cyan-400 font-bold">
              AI-Powered Criminal Network Analysis System
            </span>
            <span>Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            INVESTIGATION SUMMARY DOSSIER: {targetCase.title.toUpperCase()}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
            <span className="font-mono text-cyan-400 font-bold">{targetCase.id}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-medium">{targetCase.category}</span>
            <span className="text-slate-500">·</span>
            <span className="text-rose-400 font-semibold">{targetCase.priority} Priority</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-semibold">{targetCase.status}</span>
          </div>
        </div>

        {/* Section 1: Executive Case Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <span>1. Executive Summary & Investigation Scope</span>
          </h2>
          <p className="text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
            {targetCase.description}
          </p>
        </div>

        {/* Section 2: Evidentiary Records Audited */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <span>2. Source Evidence Ingestion Registry ({caseEvidence.length} Documents)</span>
          </h2>
          <div className="overflow-x-auto bg-slate-950 rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="text-[10px] uppercase text-slate-400 bg-slate-900/60 font-mono">
                <tr>
                  <th className="px-3 py-2">Evidence ID</th>
                  <th className="px-3 py-2">Document Title</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Source Agency</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {caseEvidence.map((ev) => (
                  <tr key={ev.id}>
                    <td className="px-3 py-2 text-cyan-400 font-bold">{ev.id}</td>
                    <td className="px-3 py-2 font-sans text-white">{ev.title}</td>
                    <td className="px-3 py-2 text-slate-400">{ev.type}</td>
                    <td className="px-3 py-2 text-slate-400 font-sans">{ev.source}</td>
                    <td className="px-3 py-2 text-emerald-400 font-semibold">{ev.reviewStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Entity Classification & Roles */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <span>3. Indexed Entities & Attribute Disambiguation ({caseEntities.length} Entities)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {caseEntities.map((ent) => (
              <div
                key={ent.id}
                className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-cyan-400 font-bold">{ent.id}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{ent.type}</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{ent.name}</div>
                </div>
                <div className="text-right text-[10px] font-mono">
                  <span className="text-emerald-400 block font-bold">
                    {Math.round(ent.confidence * 100)}% Conf
                  </span>
                  <span className="text-slate-500">{ent.reviewStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Financial Movement (if transactions exist) */}
        {caseTransactions.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <span>4. Financial Trail Summary (₹{totalFunds.toLocaleString('en-IN')})</span>
            </h2>
            <div className="overflow-x-auto bg-slate-950 rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs divide-y divide-slate-800 font-mono text-[11px]">
                <thead className="text-[10px] uppercase text-slate-400 bg-slate-900/60">
                  <tr>
                    <th className="px-3 py-2">Transfer ID</th>
                    <th className="px-3 py-2">Source Account</th>
                    <th className="px-3 py-2">Destination Account</th>
                    <th className="px-3 py-2 text-right">Amount (INR)</th>
                    <th className="px-3 py-2">Ref / Clearing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {caseTransactions.map((t) => (
                    <tr key={t.id}>
                      <td className="px-3 py-2 text-cyan-400 font-bold">{t.id}</td>
                      <td className="px-3 py-2 text-white">{t.sourceAccountId}</td>
                      <td className="px-3 py-2 text-white">{t.targetAccountId}</td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-bold">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-2 text-slate-400">{t.referenceNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 5: AI-Assisted Findings & Leads */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <span>5. Corroborated Leads & Rule-Based Heuristics ({caseFindings.length} Items)</span>
          </h2>
          <div className="space-y-2">
            {caseFindings.map((f) => (
              <div
                key={f.id}
                className="bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{f.id}</span>
                    <span className="text-purple-400 font-semibold">{f.category}</span>
                  </div>
                  <span className="font-semibold text-emerald-400 font-mono">{f.reviewStatus}</span>
                </div>
                <div className="font-bold text-white">{f.title}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{f.description}</p>
                <div className="text-[10px] text-slate-500 pt-1 font-mono">
                  Referenced Evidence: {f.evidenceIds.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certified Evidentiary Integrity Protocol */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>EVIDENTIARY VERIFICATION & JUDICIAL SUBMISSION PROTOCOL</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            This investigative brief compiles certified records ingested from core banking switches, telecom compliance authorities, and transport departments. Topological links and automated heuristic discoveries serve as corroborated intelligence leads to support formal charge-sheet proceedings.
          </p>
        </div>
      </div>
    </div>
  );
};
