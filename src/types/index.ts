export type CasePriority = 'High' | 'Medium' | 'Low';
export type CaseStatus = 'Under Analysis' | 'Under Review' | 'Evidence Review' | 'New' | 'Closed';

export interface Case {
  id: string;
  title: string;
  category: string;
  priority: CasePriority;
  status: CaseStatus;
  description: string;
  assignedAnalyst?: string;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceType =
  | 'FIR / Document'
  | 'Bank Statement'
  | 'Call Detail Record (CDR)'
  | 'IP / Device Log'
  | 'Vehicle Record'
  | 'Location Observation'
  | 'Entity Report'
  | 'Other';

export type ProcessingStatus = 'Unprocessed' | 'Processed' | 'Failed';
export type ReviewStatus = 'Verified' | 'Pending Review' | 'Rejected' | 'Candidate';

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  fileName: string;
  type: EvidenceType;
  source: string;
  textContent?: string;
  description: string;
  createdAt: string;
  processingStatus: ProcessingStatus;
  reviewStatus: ReviewStatus;
}

export type EntityType =
  | 'Person'
  | 'Phone Number'
  | 'Bank Account'
  | 'Vehicle'
  | 'IP Address'
  | 'Device'
  | 'Online Account'
  | 'Location'
  | 'Organization'
  | 'Transaction'
  | 'Evidence Document';

export interface Entity {
  id: string;
  caseId: string;
  type: EntityType;
  name: string;
  normalizedIdentifier: string;
  confidence: number; // 0 to 1
  reviewStatus: ReviewStatus;
  sourceEvidenceIds: string[];
  metadata?: Record<string, string | number>;
  notes?: string;
  possibleDuplicateOf?: string;
}

export type RelationshipType =
  | 'PERSON_HAS_PHONE'
  | 'PERSON_ASSOCIATED_WITH_ACCOUNT'
  | 'PERSON_ASSOCIATED_WITH_VEHICLE'
  | 'ACCOUNT_TRANSFERRED_TO_ACCOUNT'
  | 'PHONE_CALLED_PHONE'
  | 'ACCOUNT_ACCESSED_FROM_IP'
  | 'DEVICE_ASSOCIATED_WITH_ACCOUNT'
  | 'VEHICLE_OBSERVED_AT_LOCATION'
  | 'ENTITY_MENTIONED_IN_EVIDENCE'
  | 'ASSOCIATED_WITH';

export interface Relationship {
  id: string;
  caseId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: RelationshipType;
  sourceEvidenceIds: string[];
  excerpt?: string;
  confidence: number;
  reviewStatus: ReviewStatus;
  timestamp?: string;
}

export interface Transaction {
  id: string;
  caseId: string;
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  currency: string;
  timestamp: string;
  evidenceId: string;
  referenceNo: string;
  notes?: string;
  potentialAnomaly?: boolean;
}

export interface CommunicationRecord {
  id: string;
  caseId: string;
  caller: string;
  receiver: string;
  timestamp: string;
  durationSeconds: number;
  evidenceId: string;
  callType?: 'Incoming' | 'Outgoing';
}

export type TimelineEventType =
  | 'Evidence Added'
  | 'Evidence Analyzed'
  | 'Entity Extracted'
  | 'Relationship Approved'
  | 'Relationship Rejected'
  | 'Transaction Recorded'
  | 'Call Recorded'
  | 'Vehicle Observation'
  | 'Analyst Note'
  | 'Report Generated';

export interface TimelineEvent {
  id: string;
  caseId: string;
  entityId?: string;
  eventType: TimelineEventType;
  description: string;
  timestamp: string;
  evidenceId?: string;
}

export interface Finding {
  id: string;
  caseId: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  confidence: number;
  evidenceIds: string[];
  reviewStatus: 'Pending Review' | 'Accepted' | 'Rejected';
  category: 'Financial Anomaly' | 'Network Structure' | 'Communication Cluster' | 'Data Gap' | 'Identity Correlation';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  relatedCaseId?: string;
  relatedRecordId?: string;
  description: string;
}
