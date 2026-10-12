import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Settings,
  RotateCcw,
  ShieldAlert,
  Database,
  Cpu,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    resetToSampleDataset,
    cases,
    evidence,
    entities,
    relationships,
    transactions,
    communications,
    findings,
  } = useInvestigation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleReset = () => {
    resetToSampleDataset();
    setShowConfirm(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>System Settings & Demo Repository Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Local runtime controls, storage persistence telemetry, and synthetic dataset initialization.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Successfully restored initial seed repository across all 6 cases!</span>
        </div>
      )}

      {/* System Information Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Application Identification & Mode</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Application Title:</span>
            <span className="text-white font-semibold">AI-Powered Criminal Network Analysis System</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Operational Mode:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5 font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              OPERATIONAL SECURE SUITE // LEVEL 4
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Execution Architecture:</span>
            <span className="text-cyan-300 font-medium font-mono">High-Performance Forensic Engine (Cytoscape + Web Audio)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Cryptographic State:</span>
            <span className="text-emerald-400 font-medium font-mono">Verified Local Session (Air-Gapped Ready)</span>
          </div>
        </div>
      </div>

      {/* Repository Storage Status Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Local Storage Record Census</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-sans">Investigation Cases</span>
            <span className="text-lg font-bold text-white">{cases.length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-sans">Evidence Documents</span>
            <span className="text-lg font-bold text-emerald-400">{evidence.length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-sans">Identified Entities</span>
            <span className="text-lg font-bold text-cyan-400">{entities.length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-sans">Network Links</span>
            <span className="text-lg font-bold text-purple-400">{relationships.length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-sans">Bank Transfers</span>
            <span className="text-lg font-bold text-amber-400">{transactions.length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-sans">Investigation Leads</span>
            <span className="text-lg font-bold text-rose-400">{findings.length}</span>
          </div>
        </div>
      </div>

      {/* Dataset Reset & Management Card */}
      <div className="bg-slate-900/90 border border-amber-900/60 rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Restore Investigation Repository Baseline</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Restores the six core active investigation dockets (Operation Blue Ledger, Operation Silent Call, Operation Shadow Route, Operation Digital Trace, Operation Cross Link, and Operation Open File) back to their baseline states.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center gap-2 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Repository to Initial State</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Repository State Restoration</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to restore the repository? Any local case modifications or newly ingested evidence files will be reset to the standard initial 6 investigation dockets.
            </p>
            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
