import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Case, CasePriority, CaseStatus } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  FileText,
  Users,
  Network,
  DollarSign,
  PhoneCall,
  Clock,
  Sparkles,
  FileCheck2,
  X,
  ArrowUpDown,
  Calendar,
  UserCheck
} from 'lucide-react';

export const CasesView: React.FC = () => {
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    setActiveTab,
    createCase,
    evidence,
    entities,
    relationships,
    transactions,
    communications,
    timeline,
    findings,
  } = useInvestigation();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [selectedCaseDetailId, setSelectedCaseDetailId] = useState<string | null>(null);

  // New Case Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Financial Fraud Analysis');
  const [newPriority, setNewPriority] = useState<CasePriority>('High');
  const [newStatus, setNewStatus] = useState<CaseStatus>('Under Analysis');
  const [newDescription, setNewDescription] = useState('');
  const [newAnalyst, setNewAnalyst] = useState('Special Crime Investigator');
  const [formError, setFormError] = useState('');

  // Active detailed case inspection
  const detailCase = cases.find((c) => c.id === (selectedCaseDetailId || activeCaseId)) || cases[0];
  const caseEvidence = evidence.filter((e) => e.caseId === detailCase.id);
  const caseEntities = entities.filter((e) => e.caseId === detailCase.id);
  const caseRelationships = relationships.filter((r) => r.caseId === detailCase.id);
  const caseTransactions = transactions.filter((t) => t.caseId === detailCase.id);
  const caseCommunications = communications.filter((c) => c.caseId === detailCase.id);
  const caseTimeline = timeline.filter((t) => t.caseId === detailCase.id);
  const caseFindings = findings.filter((f) => f.caseId === detailCase.id);

  // Filter & Sort logic
  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchCategory && matchPriority && matchStatus;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter a case title.');
      return;
    }
    if (!newDescription.trim()) {
      setFormError('Please enter a case description.');
      return;
    }

    const createdId = createCase({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      status: newStatus,
      description: newDescription.trim(),
      assignedAnalyst: newAnalyst.trim(),
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setFormError('');
    setSelectedCaseDetailId(createdId);
  };

  const categories = Array.from(new Set(cases.map((c) => c.category)));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>Case Management & Dossiers</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active criminal investigation dockets, cross-source evidence vaults, and registered forensic registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Create New Case Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Case</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search cases by ID, title, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case List Display: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCases.map((c) => {
            const isSelected = c.id === detailCase.id;
            const evCount = evidence.filter((e) => e.caseId === c.id).length;
            const entCount = entities.filter((e) => e.caseId === c.id).length;

            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCaseDetailId(c.id);
                  setActiveCaseId(c.id);
                }}
                className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 shadow-md shadow-cyan-950/40 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-400">{c.id}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        c.priority === 'High'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                          : c.priority === 'Medium'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                    {c.title}
                  </h3>

                  <div className="text-[11px] text-cyan-500 font-medium">{c.category}</div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1" title="Evidence items">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      {evCount} Evd
                    </span>
                    <span className="flex items-center gap-1" title="Identified Entities">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      {entCount} Ent
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-300">{c.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Analyst</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseDetailId(c.id);
                      setActiveCaseId(c.id);
                    }}
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      c.id === detailCase.id ? 'bg-cyan-950/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-white">{c.title}</td>
                    <td className="px-4 py-3 text-slate-400">{c.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          c.priority === 'High'
                            ? 'text-rose-400'
                            : c.priority === 'Medium'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3 text-slate-400">{c.assignedAnalyst || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyan-400 hover:text-cyan-300 font-medium">Inspect &rarr;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Case Inspection Drawer / Dossier View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-cyan-400 text-sm">{detailCase.id}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-semibold">{detailCase.category}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-medium">{detailCase.status}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">{detailCase.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveCaseId(detailCase.id);
                setActiveTab('network');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Network Graph</span>
            </button>
            <button
              onClick={() => {
                setActiveCaseId(detailCase.id);
                setActiveTab('reports');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Generate Case Report</span>
            </button>
          </div>
        </div>

        {/* Narrative Description & Analyst Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          <div className="lg:col-span-2 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Investigation Brief & Scope
            </div>
            <p className="text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              {detailCase.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Case Metadata
            </div>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Analyst:</span>
                <span className="text-white font-medium">{detailCase.assignedAnalyst || 'Lead Investigator'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initiated:</span>
                <span>{new Date(detailCase.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Ledger Audit:</span>
                <span>{new Date(detailCase.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Evidence Ingested:</span>
                <span className="text-emerald-400 font-mono font-bold">{caseEvidence.length} files</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown of Linked Case Records */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
          <button
            onClick={() => {
              setActiveCaseId(detailCase.id);
              setActiveTab('evidence');
            }}
            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Evidence</span>
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">{caseEvidence.length}</div>
            <div className="text-[10px] text-slate-500">Inspect Vault &rarr;</div>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(detailCase.id);
              setActiveTab('entities');
            }}
            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Entities</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">{caseEntities.length}</div>
            <div className="text-[10px] text-slate-500">Registry &rarr;</div>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(detailCase.id);
              setActiveTab('network');
            }}
            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Links</span>
              <Network className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">{caseRelationships.length}</div>
            <div className="text-[10px] text-slate-500">Graph View &rarr;</div>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(detailCase.id);
              setActiveTab('financial');
            }}
            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Transfers</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">{caseTransactions.length}</div>
            <div className="text-[10px] text-slate-500">Trail View &rarr;</div>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(detailCase.id);
              setActiveTab('communication');
            }}
            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Calls</span>
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">{caseCommunications.length}</div>
            <div className="text-[10px] text-slate-500">CDR Logs &rarr;</div>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(detailCase.id);
              setActiveTab('insights');
            }}
            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Findings</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">{caseFindings.length}</div>
            <div className="text-[10px] text-slate-500">Review Leads &rarr;</div>
          </button>
        </div>
      </div>

      {/* Modal: Create New Case */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Initialize New Investigation Case</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Case Title</label>
                <input
                  type="text"
                  placeholder="e.g., Operation Silent Ledger II"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Financial Fraud Analysis">Financial Fraud Analysis</option>
                    <option value="Communication Network Analysis">Communication Network Analysis</option>
                    <option value="Vehicle and Location Correlation">Vehicle and Location Correlation</option>
                    <option value="Cybercrime Evidence Analysis">Cybercrime Evidence Analysis</option>
                    <option value="Multi-Source Evidence Correlation">Multi-Source Evidence Correlation</option>
                    <option value="General Investigation">General Investigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as CasePriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Under Analysis">Under Analysis</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Evidence Review">Evidence Review</option>
                    <option value="New">New</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Analyst</label>
                  <input
                    type="text"
                    value={newAnalyst}
                    onChange={(e) => setNewAnalyst(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Case Hypothesis</label>
                <textarea
                  rows={3}
                  placeholder="Detail the complaint allegations, suspect entities, and initial investigation strategy..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
