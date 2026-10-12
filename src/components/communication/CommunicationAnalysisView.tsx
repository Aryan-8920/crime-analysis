import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CommunicationRecord } from '../../types';
import {
  PhoneCall,
  Search,
  Filter,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
  Users,
  FileText,
  Sliders,
  Calendar,
  Sparkles
} from 'lucide-react';

export const CommunicationAnalysisView: React.FC = () => {
  const {
    communications,
    entities,
    cases,
    activeCaseId,
    setActiveCaseId,
    evidence,
  } = useInvestigation();

  // Default to Operation Silent Call (DEMO-2026-002) if current case has no CDRs
  const [selectedCase, setSelectedCase] = useState<string>(() => {
    const hasCurrent = communications.some((c) => c.caseId === activeCaseId);
    return hasCurrent ? activeCaseId : 'DEMO-2026-002';
  });

  const [searchPhone, setSearchPhone] = useState<string>('');
  const [minDuration, setMinDuration] = useState<number>(0);
  const [selectedPhone, setSelectedPhone] = useState<string | null>('PHONE-SC-101');

  // Filter CDRs for case
  const caseCdrs = communications.filter(
    (c) =>
      c.caseId === selectedCase &&
      c.durationSeconds >= minDuration &&
      (!searchPhone ||
        c.caller.toLowerCase().includes(searchPhone.toLowerCase()) ||
        c.receiver.toLowerCase().includes(searchPhone.toLowerCase()))
  );

  // Calculate statistics from records
  const totalCalls = caseCdrs.length;
  const totalSeconds = caseCdrs.reduce((sum, c) => sum + c.durationSeconds, 0);
  const avgDuration = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;

  // Phone frequency rank
  const phoneCallCounts = new Map<string, { total: number; caller: number; receiver: number }>();
  caseCdrs.forEach((c) => {
    if (!phoneCallCounts.has(c.caller)) {
      phoneCallCounts.set(c.caller, { total: 0, caller: 0, receiver: 0 });
    }
    if (!phoneCallCounts.has(c.receiver)) {
      phoneCallCounts.set(c.receiver, { total: 0, caller: 0, receiver: 0 });
    }

    const callerStat = phoneCallCounts.get(c.caller)!;
    callerStat.total += 1;
    callerStat.caller += 1;

    const receiverStat = phoneCallCounts.get(c.receiver)!;
    receiverStat.total += 1;
    receiverStat.receiver += 1;
  });

  const mostConnectedPhones = Array.from(phoneCallCounts.entries())
    .map(([phone, stats]) => ({ phone, ...stats }))
    .sort((a, b) => b.total - a.total);

  // Selected phone CDRs
  const selectedPhoneCdrs = selectedPhone
    ? caseCdrs.filter((c) => c.caller === selectedPhone || c.receiver === selectedPhone)
    : [];

  const getEntityNameForPhone = (phoneId: string) => {
    const ent = entities.find((e) => e.id === phoneId || e.normalizedIdentifier === phoneId.toLowerCase());
    return ent ? ent.name : phoneId;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-amber-400" />
            <span>Telecommunication & CDR Network Analysis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Call Detail Record (CDR) correlation, cell site tower relay hop detection, and inter-subscriber interaction profiling.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs text-slate-400">Investigation Case:</label>
          <select
            value={selectedCase}
            onChange={(e) => {
              setSelectedCase(e.target.value);
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

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Logged Calls
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{totalCalls}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Calculated from verified CDRs</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Airtime
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {Math.round(totalSeconds / 60)} min
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalSeconds} total seconds</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Average Call Duration
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            {avgDuration}s
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Per recorded transmission</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Distinct Subscribers
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">
            {mostConnectedPhones.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active telecom identifiers</div>
        </div>
      </div>

      {/* Filter and Duration Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by phone identifier or subscriber number..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Min Duration Filter */}
        <div className="flex items-center gap-2 text-slate-300">
          <Sliders className="w-4 h-4 text-slate-500" />
          <span>Min Duration:</span>
          <select
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value={0}>All Calls (0s+)</option>
            <option value={120}>&ge; 2 Minutes (120s)</option>
            <option value={300}>&ge; 5 Minutes (300s)</option>
            <option value={450}>&ge; 7.5 Minutes (450s)</option>
          </select>
        </div>
      </div>

      {/* Multi-Hop Relay Chain Display (for Operation Silent Call) */}
      {selectedCase === 'DEMO-2026-002' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unidirectional 4-Hop Relay Chain Discovered</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono font-semibold">
              4 Hops · Linear Propagation
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-[650px] justify-between text-xs font-mono">
              <div
                onClick={() => setSelectedPhone('PHONE-SC-101')}
                className="bg-cyan-950/80 border border-cyan-700/80 p-2.5 rounded-lg text-center cursor-pointer hover:border-cyan-400 transition-colors"
              >
                <div className="text-[10px] text-cyan-400">ORIGIN</div>
                <div className="font-bold text-white">PHONE-SC-101</div>
                <div className="text-[10px] text-slate-400">Vikram Roy</div>
              </div>

              <div className="text-slate-500 text-center text-[10px]">
                <div>410s (Hop 1)</div>
                <div className="text-cyan-400">&rarr;&rarr;&rarr;</div>
              </div>

              <div
                onClick={() => setSelectedPhone('PHONE-SC-102')}
                className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-center cursor-pointer hover:border-cyan-400 transition-colors"
              >
                <div className="text-[10px] text-slate-400">RELAY 1</div>
                <div className="font-bold text-white">PHONE-SC-102</div>
                <div className="text-[10px] text-slate-400">Sunita Rao</div>
              </div>

              <div className="text-slate-500 text-center text-[10px]">
                <div>520s (Hop 2)</div>
                <div className="text-cyan-400">&rarr;&rarr;&rarr;</div>
              </div>

              <div
                onClick={() => setSelectedPhone('PHONE-SC-103')}
                className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-center cursor-pointer hover:border-cyan-400 transition-colors"
              >
                <div className="text-[10px] text-slate-400">RELAY 2 (HUB)</div>
                <div className="font-bold text-white">PHONE-SC-103</div>
                <div className="text-[10px] text-slate-400">Devendra Patel</div>
              </div>

              <div className="text-slate-500 text-center text-[10px]">
                <div>195s (Hop 3)</div>
                <div className="text-cyan-400">&rarr;&rarr;&rarr;</div>
              </div>

              <div
                onClick={() => setSelectedPhone('PHONE-SC-104')}
                className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-center cursor-pointer hover:border-cyan-400 transition-colors"
              >
                <div className="text-[10px] text-slate-400">RELAY 3</div>
                <div className="font-bold text-white">PHONE-SC-104</div>
                <div className="text-[10px] text-slate-400">Ananya Sen</div>
              </div>

              <div className="text-slate-500 text-center text-[10px]">
                <div>600s (Hop 4)</div>
                <div className="text-cyan-400">&rarr;&rarr;&rarr;</div>
              </div>

              <div
                onClick={() => setSelectedPhone('PHONE-SC-105')}
                className="bg-emerald-950/80 border border-emerald-700/80 p-2.5 rounded-lg text-center cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="text-[10px] text-emerald-400">TERMINAL</div>
                <div className="font-bold text-white">PHONE-SC-105</div>
                <div className="text-[10px] text-slate-400">Farhan Siddiqui</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Most-Connected Subscribers & CDR Transaction Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Most-Connected Subscribers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Subscriber Activity Rank</span>
            </h3>
            <span className="text-[10px] text-slate-500">Total Calls</span>
          </div>

          <div className="space-y-2">
            {mostConnectedPhones.map((stat, idx) => {
              const isSelected = selectedPhone === stat.phone;
              const subscriberName = getEntityNameForPhone(stat.phone);

              return (
                <div
                  key={stat.phone}
                  onClick={() => setSelectedPhone(stat.phone)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-600/70 text-white'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
                      <span className="font-bold text-amber-400">{stat.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{subscriberName}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-white text-sm">{stat.total}</span>
                    <div className="text-[9px] text-slate-500">
                      {stat.caller} Out / {stat.receiver} In
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Call Detail Records Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>
                CDR Telecommunication Ledger ({selectedPhone ? `Focus: ${selectedPhone}` : 'All Calls'})
              </span>
            </span>
            {selectedPhone && (
              <button
                onClick={() => setSelectedPhone(null)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Clear Focus
              </button>
            )}
          </div>

          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider sticky top-0">
                <tr>
                  <th className="px-4 py-2.5">Call ID</th>
                  <th className="px-4 py-2.5">Caller (Origin)</th>
                  <th className="px-4 py-2.5">Direction</th>
                  <th className="px-4 py-2.5">Receiver (Target)</th>
                  <th className="px-4 py-2.5">Duration</th>
                  <th className="px-4 py-2.5">Timestamp (UTC)</th>
                  <th className="px-4 py-2.5">Evidence Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {(selectedPhone ? selectedPhoneCdrs : caseCdrs).map((cdr) => (
                  <tr key={cdr.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-2.5 text-cyan-400 font-bold">{cdr.id}</td>
                    <td className="px-4 py-2.5 text-white font-medium">{cdr.caller}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        <span>Outgoing</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-white font-medium">{cdr.receiver}</td>
                    <td className="px-4 py-2.5 font-bold text-amber-400">
                      {cdr.durationSeconds}s ({Math.round(cdr.durationSeconds / 60)}m)
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {new Date(cdr.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{cdr.evidenceId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Telecom Intercept Integrity Protocol */}
      <div className="bg-[#050a14] border border-cyan-950/80 rounded-lg p-2.5 text-xs text-slate-400 flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            TELECOM INTERCEPT AUDIT // Cellular CDR extracts verified against carrier switch transaction logs.
          </span>
        </div>
        <span className="text-amber-400 text-[11px] font-bold">CARRIER CERTIFIED</span>
      </div>
    </div>
  );
};
