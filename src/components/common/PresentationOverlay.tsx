import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { soundFX } from '../../utils/soundEffects';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  Shield,
  Radio
} from 'lucide-react';

interface PresentationStepInfo {
  step: number;
  title: string;
  targetView: string;
  note: string;
  actionGuidance: string;
}

const BRIEFING_STEPS: PresentationStepInfo[] = [
  {
    step: 1,
    title: 'Overview Command Center',
    targetView: 'Intelligence Dashboard',
    note: '“Our system brings different investigation evidence into one integrated interface.”',
    actionGuidance: 'High-level operational metrics across all 6 active cases, recent FIR evidence intake, and activity logs.',
  },
  {
    step: 2,
    title: 'Operation Blue Ledger Dossier',
    targetView: 'Active Case Scope (DEMO-2026-001)',
    note: '“This case demonstrates how financial records and associated entities can be examined together.”',
    actionGuidance: 'Review case status, category, linked evidence count, and suspect signatories (Rahul Sharma, Amit Kumar, Rohit Verma).',
  },
  {
    step: 3,
    title: 'Source Evidence Verification (FIR-DEMO-001)',
    targetView: 'Evidence Vault',
    note: '“Investigation evidence can be reviewed at the source before relationships are accepted.”',
    actionGuidance: 'Inspect the verbatim deposition of FIR No. 402/2026 lodged at Central Cyber Crime Police Station.',
  },
  {
    step: 4,
    title: 'Automated Entity Extraction Pipeline',
    targetView: 'Entity Registry & Resolution',
    note: '“The system organizes important entities found in the supplied sample records.”',
    actionGuidance: 'Review extracted persons, bank accounts, and phone identifiers with confidence scores and verification workflows.',
  },
  {
    step: 5,
    title: 'Tactical Network Graph Topology',
    targetView: 'Network Analysis Engine',
    note: '“Entities are represented as nodes, and their recorded relationships are represented as edges.”',
    actionGuidance: 'Explore interactive graph nodes representing people, accounts, vehicles, and their recorded connections.',
  },
  {
    step: 6,
    title: 'Multi-Hop Perimeter Analysis (1 to 4 Hops)',
    targetView: 'Network Analysis (Hop Traversal)',
    note: '“Multi-hop exploration helps reveal indirect connections across the recorded network.”',
    actionGuidance: 'Select Rahul Sharma (P001) and toggle 1-hop, 2-hop, 3-hop, and 4-hop exploration to reveal indirect associations.',
  },
  {
    step: 7,
    title: 'Forensic Financial Fund Flow',
    targetView: 'Financial Trail Ledger',
    note: '“The investigator can follow the recorded movement of funds and inspect the supporting transaction evidence.”',
    actionGuidance: 'Examine the ₹5L -> ₹3L -> ₹1.8L / ₹1.2L transfer chain and view calculated account balance metrics.',
  },
  {
    step: 8,
    title: 'Telecommunications & Tower Relay Matrix',
    targetView: 'Communication Analysis (Operation Silent Call)',
    note: '“The communication view helps examine recorded interactions and their timing.”',
    actionGuidance: 'Inspect the 8-node telecommunication CDR chain and identify high-frequency phone relays across hops.',
  },
  {
    step: 9,
    title: 'Incident Chronology & Activity Timeline',
    targetView: 'Investigation Timeline',
    note: '“The timeline places recorded events in chronological context.”',
    actionGuidance: 'Examine chronological call timestamps preceding electronic fund transfers and evidence verification events.',
  },
  {
    step: 10,
    title: 'AI Heuristic Insights & Prioritized Leads',
    targetView: 'AI Insights Command',
    note: '“These are potential investigation leads, not conclusions about guilt.”',
    actionGuidance: 'Review prioritized findings regarding rapid cascaded dispersal, duplicate warnings, and data gaps.',
  },
  {
    step: 11,
    title: 'Certified Investigation Dossier & Export',
    targetView: 'Reports Dossier & Export',
    note: '“The system can summarize case information and maintain references to the evidence used.”',
    actionGuidance: 'Preview the synthesized case report distinguishing verified evidence from candidate leads, and test Print or CSV export.',
  },
];

export const PresentationOverlay: React.FC = () => {
  const {
    isPresentationActive,
    presentationStep,
    nextPresentationStep,
    prevPresentationStep,
    exitPresentation,
    goToPresentationStep,
  } = useInvestigation();

  if (!isPresentationActive) return null;

  const current = BRIEFING_STEPS[presentationStep - 1] || BRIEFING_STEPS[0];
  const progressPercent = Math.round((presentationStep / BRIEFING_STEPS.length) * 100);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-4xl bg-[#090f19]/95 backdrop-blur-xl border border-cyan-500/60 rounded-xl shadow-2xl shadow-cyan-950/80 p-3.5 text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Progress Line */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2.5">
        <div
          className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Info & Presenter Note */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-950 text-cyan-300 border border-cyan-600/70 font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
              BRIEFING STEP {presentationStep} OF 11
            </span>
            <h2 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
              <span>{current.title}</span>
              <span className="text-xs font-normal text-slate-400 font-mono">({current.targetView})</span>
            </h2>
          </div>

          {/* Presenter Note */}
          <div className="bg-[#050a14] border border-cyan-950 rounded px-3 py-1.5 mt-1 text-xs">
            <div className="text-cyan-300 font-serif italic text-xs leading-snug">
              {current.note}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5 font-sans">
              <strong className="text-slate-300 font-mono">Focus:</strong> {current.actionGuidance}
            </div>
          </div>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {/* Step Selector Dropdown */}
          <div className="relative">
            <select
              value={presentationStep}
              onChange={(e) => {
                soundFX.playClick();
                goToPresentationStep(Number(e.target.value));
              }}
              aria-label="Select Briefing Step"
              className="bg-[#050a14] border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 font-mono"
            >
              {BRIEFING_STEPS.map((s) => (
                <option key={s.step} value={s.step}>
                  {s.step}. {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Previous Step */}
          <button
            onClick={() => {
              soundFX.playClick();
              prevPresentationStep();
            }}
            disabled={presentationStep === 1}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
              presentationStep === 1
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Next Step / Complete */}
          <button
            onClick={() => {
              soundFX.playClick();
              nextPresentationStep();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white transition-all shadow-md shadow-cyan-950/60 cursor-pointer uppercase tracking-wider font-mono"
          >
            {presentationStep === 11 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Protocol</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Exit */}
          <button
            onClick={() => {
              soundFX.playClick();
              exitPresentation();
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Exit Briefing Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
