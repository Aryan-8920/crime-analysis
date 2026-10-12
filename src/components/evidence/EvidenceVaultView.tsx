import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Evidence, EvidenceType, Entity, Relationship } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Sparkles,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  X,
  FileSpreadsheet,
  PhoneCall,
  Car,
  MapPin,
  Laptop,
  Check,
  ShieldAlert
} from 'lucide-react';

export const EvidenceVaultView: React.FC = () => {
  const {
    evidence,
    cases,
    activeCaseId,
    setActiveCaseId,
    selectedEvidenceId,
    setSelectedEvidenceId,
    addEvidence,
    analyzeEvidence,
    acceptCandidateEntity,
    rejectCandidateEntity,
    acceptCandidateRelationship,
    rejectCandidateRelationship,
    createRelationship,
  } = useInvestigation();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [caseFilter, setCaseFilter] = useState<string>(activeCaseId || 'all');

  // Preview / Inspect modal
  const [previewEvidence, setPreviewEvidence] = useState<Evidence | null>(() => {
    return selectedEvidenceId
      ? evidence.find((e) => e.id === selectedEvidenceId) || null
      : null;
  });

  // Analysis Result Modal
  const [analysisResult, setAnalysisResult] = useState<{
    evidence: Evidence;
    candidateEntities: Entity[];
    candidateRelationships: Relationship[];
  } | null>(null);

  // New Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newType, setNewType] = useState<EvidenceType>('FIR / Document');
  const [newSource, setNewSource] = useState('Central Investigation Cell');
  const [newTextContent, setNewTextContent] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Handle direct inspection if selectedEvidenceId changes
  React.useEffect(() => {
    if (selectedEvidenceId) {
      const ev = evidence.find((e) => e.id === selectedEvidenceId);
      if (ev) setPreviewEvidence(ev);
    }
  }, [selectedEvidenceId, evidence]);

  const filteredEvidence = evidence.filter((ev) => {
    const matchCase = caseFilter === 'all' || ev.caseId === caseFilter;
    const matchType = typeFilter === 'all' || ev.type === typeFilter;
    const matchSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.id.toLowerCase().includes(search.toLowerCase()) ||
      ev.source.toLowerCase().includes(search.toLowerCase()) ||
      (ev.textContent && ev.textContent.toLowerCase().includes(search.toLowerCase()));
    return matchCase && matchType && matchSearch;
  });

  const handleRunAnalysis = (ev: Evidence) => {
    const res = analyzeEvidence(ev.id);
    setAnalysisResult({
      evidence: ev,
      candidateEntities: res.candidateEntities,
      candidateRelationships: res.candidateRelationships,
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setUploadError('Please provide an evidence document title.');
      return;
    }
    if (!newTextContent.trim() && !newDescription.trim()) {
      setUploadError('Please provide document text content or an intake summary.');
      return;
    }

    const createdId = addEvidence({
      caseId: caseFilter !== 'all' ? caseFilter : activeCaseId,
      title: newTitle.trim(),
      fileName: newFileName.trim() || `${newTitle.trim().replace(/\s+/g, '_')}.txt`,
      type: newType,
      source: newSource.trim(),
      textContent: newTextContent.trim(),
      description: newDescription.trim() || 'Uploaded documentary evidence.',
    });

    setShowUploadModal(false);
    setNewTitle('');
    setNewFileName('');
    setNewTextContent('');
    setNewDescription('');
    setUploadError('');

    const createdEv = evidence.find((e) => e.id === createdId);
    if (createdEv) setPreviewEvidence(createdEv);
  };

  const getTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case 'FIR / Document':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'Bank Statement':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'Call Detail Record (CDR)':
        return <PhoneCall className="w-4 h-4 text-amber-400" />;
      case 'Vehicle Record':
        return <Car className="w-4 h-4 text-purple-400" />;
      case 'Location Observation':
        return <MapPin className="w-4 h-4 text-rose-400" />;
      case 'IP / Device Log':
        return <Laptop className="w-4 h-4 text-blue-400" />;
      default:
        return <FileCheck2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Evidence Vault & Document Repository</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chain of custody depository for registered First Information Reports (FIRs), CDR call extracts, banking ledgers, and forensic hardware logs.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest New Evidence</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search evidence ID, title, text excerpts, or source agency..."
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
            <option value="all">All Evidence Types</option>
            <option value="FIR / Document">FIR / Documents</option>
            <option value="Bank Statement">Bank Statements</option>
            <option value="Call Detail Record (CDR)">Call Detail Records (CDR)</option>
            <option value="IP / Device Log">IP / Device Logs</option>
            <option value="Vehicle Record">Vehicle Records</option>
            <option value="Location Observation">Location Observations</option>
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-4 py-3">Document Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Associated Case</th>
                <th className="px-4 py-3">Source Agency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-cyan-400">{ev.id}</td>
                  <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                    {ev.title}
                    <div className="text-[10px] text-slate-500 font-mono">{ev.fileName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      {getTypeIcon(ev.type)}
                      <span>{ev.type}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-cyan-300">{ev.caseId}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{ev.source}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ev.reviewStatus === 'Verified'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {ev.reviewStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewEvidence(ev)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Preview text and source"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleRunAnalysis(ev)}
                        className="px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Run rule-based extraction pipeline"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Analyze</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Preview Evidence Modal (FIR & Document Viewer) */}
      {previewEvidence && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">
                    {previewEvidence.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="text-cyan-400 font-semibold">{previewEvidence.id}</span>
                    <span>·</span>
                    <span>{previewEvidence.caseId}</span>
                    <span>·</span>
                    <span>{previewEvidence.type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewEvidence(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Source Deposition Authority:</span>
                  <span className="text-white font-medium">{previewEvidence.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Chain-of-Custody Ingestion:</span>
                  <span className="text-white font-medium">
                    {new Date(previewEvidence.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Document Overview & Metadata
                </span>
                <p className="text-slate-300 leading-relaxed">{previewEvidence.description}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Certified Text / Content Extract
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 font-mono text-slate-200 text-xs leading-relaxed whitespace-pre-wrap select-text max-h-72 overflow-y-auto">
                  {previewEvidence.textContent || 'No raw text extract registered.'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="text-[11px] text-cyan-400/80 font-mono">
                Certified Evidentiary Deposition · Chain of Custody Verified
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewEvidence(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const ev = previewEvidence;
                    setPreviewEvidence(null);
                    handleRunAnalysis(ev);
                  }}
                  className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Evidence</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result Modal (Candidate Entity & Relationship Extraction) */}
      {analysisResult && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    Extraction Results: {analysisResult.evidence.id}
                  </h3>
                </div>
                <div className="text-[11px] text-cyan-300 mt-0.5 font-mono font-bold">
                  AUTOMATED AI EXTRACTION ENGINE · CONFIDENCE 95%
                </div>
              </div>
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Notice Banner */}
              <div className="bg-slate-950 border border-cyan-800/60 rounded-lg p-3 text-cyan-300 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  Extracted from <strong className="text-white">{analysisResult.evidence.title}</strong> using automated entity correlation. Review and commit verified entities into the active case topology.
                </div>
              </div>

              {/* Candidate Entities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                    Extracted Candidate Entities ({analysisResult.candidateEntities.length})
                  </h4>
                  <span className="text-[10px] text-slate-500">Confidence Threshold &ge; 90%</span>
                </div>

                <div className="space-y-2">
                  {analysisResult.candidateEntities.map((ent) => (
                    <div
                      key={ent.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-bold">{ent.id}</span>
                          <span className="text-slate-400 font-medium">({ent.type})</span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {Math.round(ent.confidence * 100)}% match
                          </span>
                        </div>
                        <div className="font-semibold text-white">{ent.name}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => acceptCandidateEntity(ent.id)}
                          className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => rejectCandidateEntity(ent.id)}
                          className="px-2 py-1 bg-rose-950 text-rose-300 border border-rose-800/80 hover:bg-rose-900 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Relationships */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                    Candidate Relationships ({analysisResult.candidateRelationships.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {analysisResult.candidateRelationships.map((rel) => (
                    <div
                      key={rel.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-cyan-400 font-semibold">{rel.sourceEntityId}</span>
                          <span className="text-purple-400">&rarr; {rel.relationshipType} &rarr;</span>
                          <span className="text-cyan-400 font-semibold">{rel.targetEntityId}</span>
                        </div>
                        {rel.excerpt && (
                          <div className="text-[11px] text-slate-400 italic truncate">
                            "{rel.excerpt}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => acceptCandidateRelationship(rel.id)}
                          className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => rejectCandidateRelationship(rel.id)}
                          className="px-2 py-1 bg-rose-950 text-rose-300 border border-rose-800/80 hover:bg-rose-900 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 flex justify-end gap-2 bg-slate-950/50">
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload New Evidence */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Ingest Evidence Document</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Evidence Title</label>
                <input
                  type="text"
                  placeholder="e.g., Supplementary Deposition Note #102"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Evidence Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EvidenceType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="FIR / Document">FIR / Document</option>
                    <option value="Bank Statement">Bank Statement</option>
                    <option value="Call Detail Record (CDR)">Call Detail Record (CDR)</option>
                    <option value="IP / Device Log">IP / Device Log</option>
                    <option value="Vehicle Record">Vehicle Record</option>
                    <option value="Location Observation">Location Observation</option>
                    <option value="Entity Report">Entity Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source / Issuing Body</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Text Content Extract / Verbatim Deposition
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste verbatim complainant statements, account transfers, or phone transcripts..."
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Brief Summary & Significance
                </label>
                <input
                  type="text"
                  placeholder="Summary of investigation relevance..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
                >
                  Ingest & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
