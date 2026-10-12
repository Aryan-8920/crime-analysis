import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Case,
  Evidence,
  Entity,
  Relationship,
  Transaction,
  CommunicationRecord,
  TimelineEvent,
  Finding,
  AuditEvent,
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_EVIDENCE,
  INITIAL_ENTITIES,
  INITIAL_RELATIONSHIPS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMUNICATIONS,
  INITIAL_TIMELINE,
  INITIAL_FINDINGS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';

export type NavTab =
  | 'overview'
  | 'cases'
  | 'evidence'
  | 'entities'
  | 'network'
  | 'communication'
  | 'financial'
  | 'timeline'
  | 'insights'
  | 'reports'
  | 'audit'
  | 'settings';

interface InvestigationContextType {
  // Data
  cases: Case[];
  evidence: Evidence[];
  entities: Entity[];
  relationships: Relationship[];
  transactions: Transaction[];
  communications: CommunicationRecord[];
  timeline: TimelineEvent[];
  findings: Finding[];
  auditLogs: AuditEvent[];

  // Authentication State
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Active Selections
  activeCaseId: string;
  activeCase: Case;
  activeTab: NavTab;
  searchQuery: string;
  selectedEntityId: string | null;
  selectedEvidenceId: string | null;
  selectedRelationshipId: string | null;

  // Presentation State
  isPresentationActive: boolean;
  presentationStep: number; // 1 to 11

  // Setters
  setActiveCaseId: (id: string) => void;
  setActiveTab: (tab: NavTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedEntityId: (id: string | null) => void;
  setSelectedEvidenceId: (id: string | null) => void;
  setSelectedRelationshipId: (id: string | null) => void;

  // Case Actions
  createCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCase: (caseId: string, updates: Partial<Case>) => void;

  // Evidence Actions
  addEvidence: (evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'processingStatus' | 'reviewStatus'>) => string;
  analyzeEvidence: (evidenceId: string) => { candidateEntities: Entity[]; candidateRelationships: Relationship[] };

  // Candidate Review Actions
  acceptCandidateEntity: (entityId: string) => void;
  rejectCandidateEntity: (entityId: string) => void;
  acceptCandidateRelationship: (relationshipId: string) => void;
  rejectCandidateRelationship: (relationshipId: string) => void;

  // Entity Actions
  createEntity: (entityData: Omit<Entity, 'id'>) => string;
  updateEntity: (entityId: string, updates: Partial<Entity>) => void;
  mergeEntities: (primaryId: string, secondaryId: string) => void;
  separateEntities: (entityId: string) => void;

  // Relationship Actions
  createRelationship: (relData: Omit<Relationship, 'id'>) => string;

  // Finding Actions
  updateFindingStatus: (findingId: string, status: 'Accepted' | 'Rejected' | 'Pending Review') => void;

  // Presentation Actions
  startPresentation: () => void;
  nextPresentationStep: () => void;
  prevPresentationStep: () => void;
  exitPresentation: () => void;
  goToPresentationStep: (step: number) => void;

  // Storage / Audit Actions
  resetToSampleDataset: () => void;
  addAuditLog: (action: string, description: string, relatedRecordId?: string) => void;
}

const STORAGE_KEY = 'criminal_network_analysis_v1';

const InvestigationContext = createContext<InvestigationContextType | null>(null);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from local storage or seed
  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cases`);
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [evidence, setEvidence] = useState<Evidence[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_evidence`);
    return saved ? JSON.parse(saved) : INITIAL_EVIDENCE;
  });

  const [entities, setEntities] = useState<Entity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_entities`);
    return saved ? JSON.parse(saved) : INITIAL_ENTITIES;
  });

  const [relationships, setRelationships] = useState<Relationship[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_relationships`);
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [communications, setCommunications] = useState<CommunicationRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_communications`);
    return saved ? JSON.parse(saved) : INITIAL_COMMUNICATIONS;
  });

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_timeline`);
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
  });

  const [findings, setFindings] = useState<Finding[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_findings`);
    return saved ? JSON.parse(saved) : INITIAL_FINDINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Authentication state (starts false to show login page on entry)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // UI state
  const [activeCaseId, setActiveCaseIdState] = useState<string>('DEMO-2026-001');
  const [activeTab, setActiveTabState] = useState<NavTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  // Presentation State
  const [isPresentationActive, setIsPresentationActive] = useState<boolean>(false);
  const [presentationStep, setPresentationStep] = useState<number>(1);

  // Persist changes to browser storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cases`, JSON.stringify(cases));
      localStorage.setItem(`${STORAGE_KEY}_evidence`, JSON.stringify(evidence));
      localStorage.setItem(`${STORAGE_KEY}_entities`, JSON.stringify(entities));
      localStorage.setItem(`${STORAGE_KEY}_relationships`, JSON.stringify(relationships));
      localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY}_communications`, JSON.stringify(communications));
      localStorage.setItem(`${STORAGE_KEY}_timeline`, JSON.stringify(timeline));
      localStorage.setItem(`${STORAGE_KEY}_findings`, JSON.stringify(findings));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    } catch {
      // Storage limits or private mode
    }
  }, [cases, evidence, entities, relationships, transactions, communications, timeline, findings, auditLogs]);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0] || INITIAL_CASES[0];

  const setActiveCaseId = (id: string) => {
    setActiveCaseIdState(id);
    setSelectedEntityId(null);
    setSelectedEvidenceId(null);
    setSelectedRelationshipId(null);
  };

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
  };

  const addAuditLog = (action: string, description: string, relatedRecordId?: string) => {
    const newLog: AuditEvent = {
      id: `AUD-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      actor: 'Demo Analyst',
      action,
      relatedCaseId: activeCaseId,
      relatedRecordId,
      description,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createCase = (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `DEMO-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newCase: Case = {
      ...caseData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newId);

    // Add timeline event
    const newTl: TimelineEvent = {
      id: `TL-${Date.now()}`,
      caseId: newId,
      eventType: 'Analyst Note',
      description: `Case initialized: ${newCase.title}`,
      timestamp: now,
    };
    setTimeline((prev) => [newTl, ...prev]);

    addAuditLog('Case Created', `Created case ${newId}: ${newCase.title}`, newId);
    return newId;
  };

  const updateCase = (caseId: string, updates: Partial<Case>) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    );
    addAuditLog('Case Edited', `Updated metadata for case ${caseId}`, caseId);
  };

  const addEvidence = (
    evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'processingStatus' | 'reviewStatus'>
  ): string => {
    const newId = `EVD-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const newEvd: Evidence = {
      ...evidenceData,
      id: newId,
      createdAt: now,
      processingStatus: 'Processed',
      reviewStatus: 'Pending Review',
    };

    setEvidence((prev) => [newEvd, ...prev]);

    const newTl: TimelineEvent = {
      id: `TL-${Date.now()}`,
      caseId: evidenceData.caseId,
      eventType: 'Evidence Added',
      description: `Added evidence item: ${newEvd.title}`,
      timestamp: now,
      evidenceId: newId,
    };
    setTimeline((prev) => [newTl, ...prev]);

    addAuditLog('Evidence Added', `Added evidence document ${newId}`, newId);
    return newId;
  };

  // Deterministic rule-based extraction pipeline for demo
  const analyzeEvidence = (evidenceId: string) => {
    const targetEvd = evidence.find((e) => e.id === evidenceId);
    if (!targetEvd) return { candidateEntities: [], candidateRelationships: [] };

    // Update evidence status
    setEvidence((prev) =>
      prev.map((e) =>
        e.id === evidenceId ? { ...e, processingStatus: 'Processed', reviewStatus: 'Verified' } : e
      )
    );

    // Rule-based deterministic extraction based on evidence text
    const text = targetEvd.textContent || targetEvd.description || '';
    const extractedEntities: Entity[] = [];
    const extractedRelationships: Relationship[] = [];

    // Extract Persons mentioned in text
    const personMatches = [
      { name: 'Rahul Sharma', id: 'P001', phone: 'PHONE-DEMO-001', acc: 'ACC-DEMO-1001' },
      { name: 'Amit Kumar', id: 'P002', phone: 'PHONE-DEMO-002', acc: 'ACC-DEMO-2002' },
      { name: 'Rohit Verma', id: 'P003', phone: 'PHONE-DEMO-003', acc: 'ACC-DEMO-3003' },
      { name: 'Vikas Singh', id: 'P004', phone: 'PHONE-DEMO-004', acc: 'ACC-DEMO-4004' },
      { name: 'Neeraj Gupta', id: 'P005', phone: 'PHONE-DEMO-005', acc: 'ACC-DEMO-5005' },
    ];

    for (const p of personMatches) {
      if (text.includes(p.name)) {
        // Person entity candidate
        const candidateP: Entity = {
          id: p.id,
          caseId: targetEvd.caseId,
          type: 'Person',
          name: p.name,
          normalizedIdentifier: p.name.toLowerCase().replace(/\s+/g, '-'),
          confidence: 0.95,
          reviewStatus: 'Verified',
          sourceEvidenceIds: [evidenceId],
        };
        extractedEntities.push(candidateP);

        // Account association
        if (text.includes(p.acc)) {
          const candidateAcc: Entity = {
            id: p.acc,
            caseId: targetEvd.caseId,
            type: 'Bank Account',
            name: `${p.acc} (${p.name.charAt(0)}. ${p.name.split(' ')[1] || ''})`,
            normalizedIdentifier: p.acc.toLowerCase(),
            confidence: 0.98,
            reviewStatus: 'Verified',
            sourceEvidenceIds: [evidenceId],
          };
          extractedEntities.push(candidateAcc);

          extractedRelationships.push({
            id: `REL-EXT-${p.id}-${p.acc}`,
            caseId: targetEvd.caseId,
            sourceEntityId: p.id,
            targetEntityId: p.acc,
            relationshipType: 'PERSON_ASSOCIATED_WITH_ACCOUNT',
            sourceEvidenceIds: [evidenceId],
            confidence: 0.97,
            reviewStatus: 'Verified',
            excerpt: `${p.name} associated with ${p.acc} in deposition.`,
          });
        }

        // Phone association
        if (text.includes(p.phone)) {
          const candidatePh: Entity = {
            id: p.phone,
            caseId: targetEvd.caseId,
            type: 'Phone Number',
            name: `${p.phone} (${p.name})`,
            normalizedIdentifier: p.phone.toLowerCase(),
            confidence: 0.96,
            reviewStatus: 'Verified',
            sourceEvidenceIds: [evidenceId],
          };
          extractedEntities.push(candidatePh);

          extractedRelationships.push({
            id: `REL-EXT-${p.id}-${p.phone}`,
            caseId: targetEvd.caseId,
            sourceEntityId: p.id,
            targetEntityId: p.phone,
            relationshipType: 'PERSON_HAS_PHONE',
            sourceEvidenceIds: [evidenceId],
            confidence: 0.95,
            reviewStatus: 'Verified',
            excerpt: `${p.name} associated with phone ${p.phone}.`,
          });
        }
      }
    }

    // Add Timeline & Audit
    const newTl: TimelineEvent = {
      id: `TL-${Date.now()}`,
      caseId: targetEvd.caseId,
      eventType: 'Evidence Analyzed',
      description: `Rule-based analysis parsed evidence: ${targetEvd.title} (${extractedEntities.length} entities discovered).`,
      timestamp: new Date().toISOString(),
      evidenceId,
    };
    setTimeline((prev) => [newTl, ...prev]);

    addAuditLog('Evidence Analyzed', `Analyzed evidence ${evidenceId} using deterministic rules`, evidenceId);

    return { candidateEntities: extractedEntities, candidateRelationships: extractedRelationships };
  };

  const acceptCandidateEntity = (entityId: string) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, reviewStatus: 'Verified' } : e))
    );
    addAuditLog('Entity Accepted', `Verified entity ${entityId}`, entityId);
  };

  const rejectCandidateEntity = (entityId: string) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, reviewStatus: 'Rejected' } : e))
    );
    addAuditLog('Entity Rejected', `Rejected candidate entity ${entityId}`, entityId);
  };

  const acceptCandidateRelationship = (relationshipId: string) => {
    setRelationships((prev) =>
      prev.map((r) => (r.id === relationshipId ? { ...r, reviewStatus: 'Verified' } : r))
    );
    addAuditLog('Relationship Approved', `Approved relationship ${relationshipId}`, relationshipId);
  };

  const rejectCandidateRelationship = (relationshipId: string) => {
    setRelationships((prev) =>
      prev.map((r) => (r.id === relationshipId ? { ...r, reviewStatus: 'Rejected' } : r))
    );
    addAuditLog('Relationship Rejected', `Rejected relationship ${relationshipId}`, relationshipId);
  };

  const createEntity = (entityData: Omit<Entity, 'id'>): string => {
    const newId = `ENT-${Date.now().toString(36).toUpperCase()}`;
    const newEntity: Entity = {
      ...entityData,
      id: newId,
    };
    setEntities((prev) => [newEntity, ...prev]);

    const newTl: TimelineEvent = {
      id: `TL-${Date.now()}`,
      caseId: entityData.caseId,
      entityId: newId,
      eventType: 'Entity Extracted',
      description: `Created entity ${newEntity.name} (${newEntity.type})`,
      timestamp: new Date().toISOString(),
    };
    setTimeline((prev) => [newTl, ...prev]);

    addAuditLog('Entity Created', `Created entity ${newId} (${newEntity.name})`, newId);
    return newId;
  };

  const updateEntity = (entityId: string, updates: Partial<Entity>) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, ...updates } : e))
    );
    addAuditLog('Entity Edited', `Updated metadata for entity ${entityId}`, entityId);
  };

  // Manual entity merge: merges secondary into primary
  const mergeEntities = (primaryId: string, secondaryId: string) => {
    const primary = entities.find((e) => e.id === primaryId);
    const secondary = entities.find((e) => e.id === secondaryId);
    if (!primary || !secondary) return;

    // Combine evidence sources
    const combinedEvidence = Array.from(
      new Set([...primary.sourceEvidenceIds, ...secondary.sourceEvidenceIds])
    );

    // Update primary entity
    const updatedPrimary: Entity = {
      ...primary,
      name: `${primary.name} / ${secondary.name} (Merged)`,
      sourceEvidenceIds: combinedEvidence,
      notes: `${primary.notes || ''} [Merged with ${secondary.name} (${secondary.id}) on ${new Date().toLocaleDateString()}]`,
      possibleDuplicateOf: undefined,
    };

    // Rewire all relationships pointing to or from secondary
    const rewiredRelationships = relationships
      .filter((r) => !(r.sourceEntityId === secondaryId && r.targetEntityId === primaryId) && !(r.sourceEntityId === primaryId && r.targetEntityId === secondaryId))
      .map((r) => ({
        ...r,
        sourceEntityId: r.sourceEntityId === secondaryId ? primaryId : r.sourceEntityId,
        targetEntityId: r.targetEntityId === secondaryId ? primaryId : r.targetEntityId,
      }));

    // Remove secondary entity
    setEntities((prev) => prev.filter((e) => e.id !== secondaryId).map((e) => (e.id === primaryId ? updatedPrimary : e)));
    setRelationships(rewiredRelationships);

    // Timeline event
    const newTl: TimelineEvent = {
      id: `TL-${Date.now()}`,
      caseId: primary.caseId,
      entityId: primaryId,
      eventType: 'Analyst Note',
      description: `Analyst confirmed manual entity merge: Combined "${secondary.name}" into "${primary.name}".`,
      timestamp: new Date().toISOString(),
    };
    setTimeline((prev) => [newTl, ...prev]);

    addAuditLog('Entity Merged', `Merged ${secondary.name} (${secondaryId}) into ${primary.name} (${primaryId})`, primaryId);
  };

  const separateEntities = (entityId: string) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, possibleDuplicateOf: undefined } : e))
    );
    addAuditLog('Entity Separated', `Cleared duplicate association on entity ${entityId}`, entityId);
  };

  const createRelationship = (relData: Omit<Relationship, 'id'>): string => {
    const newId = `REL-${Date.now().toString(36).toUpperCase()}`;
    const newRel: Relationship = {
      ...relData,
      id: newId,
    };
    setRelationships((prev) => [newRel, ...prev]);

    const newTl: TimelineEvent = {
      id: `TL-${Date.now()}`,
      caseId: relData.caseId,
      eventType: 'Relationship Approved',
      description: `Created relationship ${newRel.relationshipType} between ${newRel.sourceEntityId} and ${newRel.targetEntityId}`,
      timestamp: new Date().toISOString(),
    };
    setTimeline((prev) => [newTl, ...prev]);

    addAuditLog('Relationship Created', `Added relationship ${newId}`, newId);
    return newId;
  };

  const updateFindingStatus = (findingId: string, status: 'Accepted' | 'Rejected' | 'Pending Review') => {
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, reviewStatus: status } : f))
    );
    addAuditLog('Finding Reviewed', `Updated finding ${findingId} status to ${status}`, findingId);
  };

  // Reset to original seed dataset
  const resetToSampleDataset = () => {
    setCases(INITIAL_CASES);
    setEvidence(INITIAL_EVIDENCE);
    setEntities(INITIAL_ENTITIES);
    setRelationships(INITIAL_RELATIONSHIPS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCommunications(INITIAL_COMMUNICATIONS);
    setTimeline(INITIAL_TIMELINE);
    setFindings(INITIAL_FINDINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveCaseIdState('DEMO-2026-001');
    setActiveTabState('overview');
    setSelectedEntityId(null);
    setSelectedEvidenceId(null);
    setSelectedRelationshipId(null);
    setIsPresentationActive(false);
    setPresentationStep(1);

    // Clear local storage
    localStorage.removeItem(`${STORAGE_KEY}_cases`);
    localStorage.removeItem(`${STORAGE_KEY}_evidence`);
    localStorage.removeItem(`${STORAGE_KEY}_entities`);
    localStorage.removeItem(`${STORAGE_KEY}_relationships`);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY}_communications`);
    localStorage.removeItem(`${STORAGE_KEY}_timeline`);
    localStorage.removeItem(`${STORAGE_KEY}_findings`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    addAuditLog('Demo Data Reset', 'Reset all cases, evidence, entities, and relationships to initial synthetic seed dataset.');
  };

  // Guided Presentation Workflow (11 Steps)
  const startPresentation = () => {
    setIsPresentationActive(true);
    setPresentationStep(1);
    setActiveTabState('overview');
  };

  const goToPresentationStep = (step: number) => {
    if (step < 1 || step > 11) return;
    setPresentationStep(step);

    switch (step) {
      case 1: // Overview Dashboard
        setActiveTabState('overview');
        break;
      case 2: // Open Operation Blue Ledger
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('cases');
        break;
      case 3: // Inspect Evidence (FIR-DEMO-001)
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('evidence');
        setSelectedEvidenceId('FIR-DEMO-001');
        break;
      case 4: // Entity Extraction
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('entities');
        setSelectedEntityId('P001');
        break;
      case 5: // Network Graph
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('network');
        setSelectedEntityId('P001');
        break;
      case 6: // Multi-Hop Analysis
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('network');
        setSelectedEntityId('P001');
        break;
      case 7: // Financial Trail
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('financial');
        break;
      case 8: // Communication Analysis
        setActiveCaseIdState('DEMO-2026-002');
        setActiveTabState('communication');
        break;
      case 9: // Timeline
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('timeline');
        break;
      case 10: // AI Insights
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('insights');
        break;
      case 11: // Generate Report
        setActiveCaseIdState('DEMO-2026-001');
        setActiveTabState('reports');
        break;
      default:
        break;
    }
  };

  const nextPresentationStep = () => {
    if (presentationStep < 11) {
      goToPresentationStep(presentationStep + 1);
    } else {
      exitPresentation();
    }
  };

  const prevPresentationStep = () => {
    if (presentationStep > 1) {
      goToPresentationStep(presentationStep - 1);
    }
  };

  const exitPresentation = () => {
    setIsPresentationActive(false);
  };

  return (
    <InvestigationContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        cases,
        evidence,
        entities,
        relationships,
        transactions,
        communications,
        timeline,
        findings,
        auditLogs,
        activeCaseId,
        activeCase,
        activeTab,
        searchQuery,
        selectedEntityId,
        selectedEvidenceId,
        selectedRelationshipId,
        isPresentationActive,
        presentationStep,
        setActiveCaseId,
        setActiveTab,
        setSearchQuery,
        setSelectedEntityId,
        setSelectedEvidenceId,
        setSelectedRelationshipId,
        createCase,
        updateCase,
        addEvidence,
        analyzeEvidence,
        acceptCandidateEntity,
        rejectCandidateEntity,
        acceptCandidateRelationship,
        rejectCandidateRelationship,
        createEntity,
        updateEntity,
        mergeEntities,
        separateEntities,
        createRelationship,
        updateFindingStatus,
        startPresentation,
        nextPresentationStep,
        prevPresentationStep,
        exitPresentation,
        goToPresentationStep,
        resetToSampleDataset,
        addAuditLog,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
