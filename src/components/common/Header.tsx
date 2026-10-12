import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { soundFX } from '../../utils/soundEffects';
import {
  Shield,
  Search,
  Play,
  RotateCcw,
  Briefcase,
  ChevronDown,
  Info,
  X,
  Volume2,
  VolumeX,
  Clock,
  Radio,
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    searchQuery,
    setSearchQuery,
    logout,
    resetToSampleDataset,
    setActiveTab,
    setSelectedEntityId,
    entities,
    evidence
  } = useInvestigation();

  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toUTCString().replace('GMT', 'UTC') + ' / ' + now.toLocaleTimeString([], { hour12: false }) + ' LOC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    soundFX.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) soundFX.playClick();
  };

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  // Global search matching
  const matchingEntities = searchQuery.trim()
    ? entities.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchingCases = searchQuery.trim()
    ? cases.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingEvidence = searchQuery.trim()
    ? evidence.filter(
        (ev) =>
          ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasSearchResults =
    matchingEntities.length > 0 || matchingCases.length > 0 || matchingEvidence.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-[#070b12]/95 backdrop-blur-xl border-b border-cyan-900/30 text-slate-100 shadow-xl shadow-black/40">
      {/* Tactical Top Security & Real-Time Status Bar */}
      <div className="bg-[#05080e] border-b border-cyan-950/60 px-4 py-1 flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/70 px-2 py-0.5 rounded text-[10px] uppercase shadow-sm">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            OPERATIONAL // LAW ENFORCEMENT INTELLIGENCE SUITE
          </span>
          <span className="hidden lg:inline text-slate-500 font-sans">
            Encrypted Session · Audit Trail Active · Level 4 Authorization
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5 text-cyan-300/80 font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{currentTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute tactical audio' : 'Enable tactical audio'}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
              <span className="hidden md:inline">{soundEnabled ? 'FX ON' : 'MUTED'}</span>
            </button>

            <span className="text-slate-700">|</span>

            <button
              onClick={() => {
                soundFX.playClick();
                setShowResetConfirm(true);
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              title="Reset repository to baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-950 via-[#0a1626] to-[#040810] border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <Shield className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                AI-Powered Criminal Network Analysis System
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
              From Fragmented Evidence to Connected Investigation Intelligence.
            </p>
          </div>
        </div>

        {/* Global Search, Active Case Selector, Briefing Trigger */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tactical Global Search */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search entities, FIRs, accounts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.trim().length > 0);
                }}
                onFocus={() => setShowSearchDropdown(searchQuery.trim().length > 0)}
                className="w-44 sm:w-60 bg-[#090f19] border border-slate-700/70 hover:border-cyan-500/60 rounded-md pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && hasSearchResults && (
              <div className="absolute left-0 mt-1 w-80 bg-[#0b121f] border border-cyan-800/60 rounded-lg shadow-2xl z-50 p-2 text-xs divide-y divide-slate-800/80 backdrop-blur-xl">
                {matchingCases.length > 0 && (
                  <div className="py-1">
                    <div className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                      Cases
                    </div>
                    {matchingCases.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveCaseId(c.id);
                          setActiveTab('cases');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-cyan-950/40 flex items-center justify-between text-slate-200"
                      >
                        <span className="font-medium truncate">{c.title}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{c.id}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingEntities.length > 0 && (
                  <div className="py-1">
                    <div className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                      Entities
                    </div>
                    {matchingEntities.map((ent) => (
                      <button
                        key={ent.id}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveCaseId(ent.caseId);
                          setSelectedEntityId(ent.id);
                          setActiveTab('entities');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-cyan-950/40 flex items-center justify-between text-slate-200"
                      >
                        <div className="truncate">
                          <span className="font-medium">{ent.name}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">({ent.type})</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">{ent.id}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingEvidence.length > 0 && (
                  <div className="py-1">
                    <div className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                      Evidence Documents
                    </div>
                    {matchingEvidence.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveCaseId(ev.caseId);
                          setActiveTab('evidence');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-cyan-950/40 flex items-center justify-between text-slate-200"
                      >
                        <span className="font-medium truncate">{ev.title}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{ev.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Case Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundFX.playClick();
                setShowCaseDropdown(!showCaseDropdown);
              }}
              className="flex items-center gap-2 bg-[#090f19] border border-cyan-900/60 hover:border-cyan-500/80 px-3 py-1.5 rounded-md text-xs text-slate-200 transition-all shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <div className="text-left max-w-[120px] sm:max-w-[170px] truncate font-mono">
                <span className="font-bold text-cyan-300">{activeCase?.id}:</span>{' '}
                <span className="text-slate-300 font-sans">{activeCase?.title}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showCaseDropdown && (
              <div className="absolute right-0 mt-1 w-80 bg-[#0b121f] border border-cyan-800/70 rounded-lg shadow-2xl z-50 p-2 text-xs divide-y divide-slate-800/80 backdrop-blur-xl">
                <div className="px-2 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Select Active Investigation Docket
                </div>
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveCaseId(c.id);
                      setShowCaseDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md transition-all flex flex-col gap-0.5 ${
                      c.id === activeCaseId
                        ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-700/80'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-cyan-300">{c.id}</span>
                      <span className="text-[10px] text-rose-400 font-semibold">{c.priority} Priority</span>
                    </div>
                    <div className="text-xs truncate font-medium text-white">{c.title}</div>
                    <div className="text-[10px] text-slate-400">{c.category}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Authenticated Officer Badge & Logout */}
          <div className="flex items-center gap-2 bg-[#090f19] border border-cyan-900/60 rounded-md px-2.5 py-1 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-400 font-bold leading-tight">INSP-RATHORE</span>
              <span className="text-[9px] text-slate-400 leading-tight">LEVEL 4 FORENSICS</span>
            </div>
            <div className="h-4 w-px bg-slate-800 mx-1"></div>
            <button
              onClick={() => {
                soundFX.playClick();
                logout();
              }}
              className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-semibold px-1.5 py-0.5 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Lock Console / Sign Out"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Lock Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b121f] border border-cyan-800/80 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-700/80 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Reset Case Repository State?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  This will reload the certified 6 case dockets (Operation Blue Ledger, Silent Call, Shadow Route, Digital Trace, Cross Link, and Open File) to their initial configuration.
                </p>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundFX.playSuccess();
                  resetToSampleDataset();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
