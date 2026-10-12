import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Entity, EntityType, ReviewStatus } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Network,
  FileText,
  AlertTriangle,
  GitMerge,
  Split,
  Edit2,
  Check,
  X,
  CreditCard,
  Phone,
  Car,
  Laptop,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const EntityExplorerView: React.FC = () => {
  const {
    entities,
    cases,
    evidence,
    relationships,
    activeCaseId,
    setActiveCaseId,
    setActiveTab,
    selectedEntityId,
    setSelectedEntityId,
    createEntity,
    updateEntity,
    mergeEntities,
    separateEntities,
  } = useInvestigation();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [caseFilter, setCaseFilter] = useState<string>(activeCaseId || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Entity for Detail Panel
  const [activeEntityId, setActiveEntityId] = useState<string>(() => {
    return selectedEntityId || (entities[0] ? entities[0].id : '');
  });

  // Modal: Create New Entity
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<EntityType>('Person');
  const [newNotes, setNewNotes] = useState('');
  const [createError, setCreateError] = useState('');

  // Modal: Confirm Entity Merge
  const [mergeCandidate, setMergeCandidate] = useState<{
    primary: Entity;
    secondary: Entity;
  } | null>(null);

  // Sync if selectedEntityId prop changed
  React.useEffect(() => {
    if (selectedEntityId) {
      setActiveEntityId(selectedEntityId);
    }
  }, [selectedEntityId]);

  const filteredEntities = entities.filter((ent) => {
    const matchCase = caseFilter === 'all' || ent.caseId === caseFilter;
    const matchType = typeFilter === 'all' || ent.type === typeFilter;
    const matchStatus = statusFilter === 'all' || ent.reviewStatus === statusFilter;
    const matchSearch =
      ent.name.toLowerCase().includes(search.toLowerCase()) ||
      ent.id.toLowerCase().includes(search.toLowerCase()) ||
      ent.normalizedIdentifier.toLowerCase().includes(search.toLowerCase()) ||
      (ent.notes && ent.notes.toLowerCase().includes(search.toLowerCase()));
    return matchCase && matchType && matchStatus && matchSearch;
  });

  const selectedEntity = entities.find((e) => e.id === activeEntityId) || filteredEntities[0] || entities[0];

  // Entity Relationships
  const entityRelationships = selectedEntity
    ? relationships.filter(
        (r) =>
          r.sourceEntityId === selectedEntity.id || r.targetEntityId === selectedEntity.id
      )
    : [];

  // Related Entities mapped
  const relatedEntities = entityRelationships.map((r) => {
    const otherId = r.sourceEntityId === selectedEntity?.id ? r.targetEntityId : r.sourceEntityId;
    const otherEnt = entities.find((e) => e.id === otherId);
    return {
      relationship: r,
      entity: otherEnt,
    };
  });

  // Check if selected entity has duplicate warning
  const duplicateEntity = selectedEntity?.possibleDuplicateOf
    ? entities.find((e) => e.id === selectedEntity.possibleDuplicateOf)
    : null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setCreateError('Please specify an entity name or identifier.');
      return;
    }

    const createdId = createEntity({
      caseId: caseFilter !== 'all' ? caseFilter : activeCaseId,
      name: newName.trim(),
      type: newType,
      normalizedIdentifier: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      confidence: 0.95,
      reviewStatus: 'Verified',
      sourceEvidenceIds: [],
      notes: newNotes.trim(),
    });

    setShowCreateModal(false);
    setNewName('');
    setNewNotes('');
    setCreateError('');
    setActiveEntityId(createdId);
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'Person':
        return <Users className="w-4 h-4 text-cyan-400" />;
      case 'Bank Account':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'Phone Number':
        return <Phone className="w-4 h-4 text-amber-400" />;
      case 'Vehicle':
        return <Car className="w-4 h-4 text-purple-400" />;
      case 'Location':
        return <MapPin className="w-4 h-4 text-rose-400" />;
      case 'Device':
      case 'IP Address':
      case 'Online Account':
        return <Laptop className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Entity Explorer & Disambiguation Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Searchable index of identified persons, bank accounts, phones, vehicles, and network identifiers with identity resolution tools.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Entity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, identifier (e.g., P001, ACC-DEMO-1001, phone)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Case Scope Filter */}
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Entity Types</option>
            <option value="Person">Person</option>
            <option value="Bank Account">Bank Account</option>
            <option value="Phone Number">Phone Number</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Location">Location</option>
            <option value="Device">Device</option>
            <option value="IP Address">IP Address</option>
            <option value="Online Account">Online Account</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Candidate">Candidate</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Entity Registry Table (left) & Detail Dossier Panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Entities List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Indexed Entities ({filteredEntities.length})
            </span>
            <span>Click row to view profile</span>
          </div>

          <div className="overflow-y-auto max-h-[600px] divide-y divide-slate-800/60">
            {filteredEntities.map((ent) => {
              const isSelected = ent.id === selectedEntity?.id;
              const hasDuplicate = !!ent.possibleDuplicateOf;

              return (
                <div
                  key={ent.id}
                  onClick={() => {
                    setActiveEntityId(ent.id);
                    setSelectedEntityId(ent.id);
                  }}
                  className={`p-3.5 hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getEntityIcon(ent.type)}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-cyan-400">{ent.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({ent.type})</span>
                        {hasDuplicate && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/60">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Duplicate Warning
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{ent.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{ent.caseId}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        ent.reviewStatus === 'Verified'
                          ? 'bg-emerald-950/60 text-emerald-300'
                          : 'bg-amber-950/60 text-amber-300'
                      }`}
                    >
                      {ent.reviewStatus}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">
                      {Math.round(ent.confidence * 100)}% Conf
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Entity Dossier Panel */}
        {selectedEntity && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center">
                  {getEntityIcon(selectedEntity.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-cyan-400 font-bold">{selectedEntity.id}</span>
                    <span className="text-slate-400">({selectedEntity.type})</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedEntity.name}</h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveCaseId(selectedEntity.caseId);
                  setSelectedEntityId(selectedEntity.id);
                  setActiveTab('network');
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition-colors"
                title="Explore in Network Graph"
              >
                <Network className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Candidate Duplicate Warning Banner */}
            {duplicateEntity && (
              <div className="bg-amber-950/40 border border-amber-800/80 rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Candidate Duplicate Warning</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  High correlation detected with <strong className="text-white">{duplicateEntity.name}</strong> ({duplicateEntity.id}). Attributes such as vehicle registration and phone prefix match with 88% confidence.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      setMergeCandidate({
                        primary: selectedEntity,
                        secondary: duplicateEntity,
                      })
                    }
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <GitMerge className="w-3 h-3" />
                    <span>Review & Merge</span>
                  </button>
                  <button
                    onClick={() => separateEntities(selectedEntity.id)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors cursor-pointer"
                  >
                    Separate
                  </button>
                </div>
              </div>
            )}

            {/* Profile Attributes */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Profile Attributes
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Associated Case:</span>
                  <span className="font-mono text-cyan-400 font-medium">{selectedEntity.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Normalized Key:</span>
                  <span className="font-mono text-slate-300">{selectedEntity.normalizedIdentifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence Score:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Math.round(selectedEntity.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Review Status:</span>
                  <span className="text-slate-200 font-semibold">{selectedEntity.reviewStatus}</span>
                </div>
                {selectedEntity.notes && (
                  <div className="pt-1 border-t border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Analyst Notes:</span>
                    <span className="text-slate-300 leading-snug">{selectedEntity.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Supporting Evidence References */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Corroborating Evidence ({selectedEntity.sourceEvidenceIds.length})
              </div>
              <div className="space-y-1.5">
                {selectedEntity.sourceEvidenceIds.map((evId) => {
                  const ev = evidence.find((e) => e.id === evId);
                  return (
                    <div
                      key={evId}
                      className="bg-slate-950 border border-slate-800 rounded p-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-white font-medium truncate">
                          {ev ? ev.title : evId}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{evId}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Connections / Recorded Relationships */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Direct Connections ({relatedEntities.length})
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {relatedEntities.map(({ relationship, entity }) => {
                  if (!entity) return null;
                  return (
                    <div
                      key={relationship.id}
                      onClick={() => {
                        setActiveEntityId(entity.id);
                        setSelectedEntityId(entity.id);
                      }}
                      className="bg-slate-950 hover:bg-slate-800/70 border border-slate-800 rounded p-2 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] text-cyan-400 font-mono truncate">
                          {relationship.relationshipType}
                        </div>
                        <div className="font-semibold text-white truncate">{entity.name}</div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{entity.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fast Track to Graph */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveCaseId(selectedEntity.caseId);
                  setSelectedEntityId(selectedEntity.id);
                  setActiveTab('network');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Explore in Interactive Graph &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Confirm Entity Merge */}
      {mergeCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-600/70 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <GitMerge className="w-5 h-5" />
              <span>Confirm Manual Entity Merge</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to merge <strong className="text-white">{mergeCandidate.secondary.name}</strong> ({mergeCandidate.secondary.id}) into <strong className="text-white">{mergeCandidate.primary.name}</strong> ({mergeCandidate.primary.id}).
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <div className="font-semibold text-cyan-300">Automated Actions to be Executed:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>All network relationships pointing to {mergeCandidate.secondary.id} will be re-routed to {mergeCandidate.primary.id}.</li>
                <li>Evidence references from both entities will be unified.</li>
                <li>Audit event will be recorded in compliance log.</li>
                <li>Network visualization graph will immediately reflect the consolidated node.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setMergeCandidate(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  mergeEntities(mergeCandidate.primary.id, mergeCandidate.secondary.id);
                  setMergeCandidate(null);
                }}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold"
              >
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Entity */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Register New Entity Record</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Entity Name / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g., Harish Chandra or ACC-DEMO-9900"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Entity Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EntityType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Person">Person</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="Phone Number">Phone Number</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Location">Location</option>
                  <option value="Device">Device</option>
                  <option value="IP Address">IP Address</option>
                  <option value="Online Account">Online Account</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Analyst Notes & Context</label>
                <textarea
                  rows={3}
                  placeholder="Notes regarding evidence provenance or role..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  Register Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
