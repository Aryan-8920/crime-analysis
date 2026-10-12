import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { TimelineEvent, TimelineEventType } from '../../types';
import {
  Clock,
  Search,
  Filter,
  FileText,
  Users,
  DollarSign,
  PhoneCall,
  Car,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const {
    timeline,
    cases,
    entities,
    evidence,
    activeCaseId,
    setActiveCaseId,
    setSelectedEvidenceId,
    setSelectedEntityId,
    setActiveTab,
  } = useInvestigation();

  const [caseFilter, setCaseFilter] = useState<string>(activeCaseId || 'all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredTimeline = timeline
    .filter((t) => {
      const matchCase = caseFilter === 'all' || t.caseId === caseFilter;
      const matchType = typeFilter === 'all' || t.eventType === typeFilter;
      const matchSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        (t.entityId && t.entityId.toLowerCase().includes(search.toLowerCase())) ||
        (t.evidenceId && t.evidenceId.toLowerCase().includes(search.toLowerCase()));
      return matchCase && matchType && matchSearch;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getEventIcon = (eventType: TimelineEventType) => {
    switch (eventType) {
      case 'Evidence Added':
      case 'Evidence Analyzed':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Entity Extracted':
        return <Users className="w-3.5 h-3.5 text-blue-400" />;
      case 'Transaction Recorded':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Call Recorded':
        return <PhoneCall className="w-3.5 h-3.5 text-amber-400" />;
      case 'Vehicle Observation':
        return <Car className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Investigation Chronology & Evidence Timeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized sequence of incident reports, call timings, banking transfers, and forensic observations.
          </p>
        </div>

        {/* Case Scope */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <label className="text-slate-400">Case Scope:</label>
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
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

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search timeline events, entity IDs, or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Event Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Event Types</option>
          <option value="Evidence Added">Evidence Ingestion</option>
          <option value="Transaction Recorded">Transactions</option>
          <option value="Call Recorded">Phone Calls</option>
          <option value="Vehicle Observation">Vehicle Sightings</option>
          <option value="Evidence Analyzed">Analyst Extractions</option>
        </select>
      </div>

      {/* Chronological Event Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="relative border-l border-slate-800 ml-4 space-y-6">
          {filteredTimeline.map((item) => (
            <div key={item.id} className="relative pl-6 group">
              {/* Event Dot Icon */}
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                {getEventIcon(item.eventType)}
              </div>

              {/* Event Card Content */}
              <div className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-lg p-3.5 transition-colors space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.eventType}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-cyan-400 text-[11px] font-bold">{item.caseId}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {/* Linked Entities / Evidence buttons */}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                  {item.entityId && (
                    <button
                      onClick={() => {
                        setSelectedEntityId(item.entityId!);
                        setActiveTab('entities');
                      }}
                      className="hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span>{item.entityId}</span>
                    </button>
                  )}

                  {item.evidenceId && (
                    <button
                      onClick={() => {
                        setSelectedEvidenceId(item.evidenceId!);
                        setActiveTab('evidence');
                      }}
                      className="hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-emerald-400" />
                      <span>{item.evidenceId}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
