export type Confidence = "low" | "medium" | "high";
export type Priority = "low" | "medium" | "high";
export type RequirementStatus = "healthy" | "upcoming" | "attention" | "completed";
export type StepStatus = "complete" | "current" | "upcoming";
export type TaskStatus = "todo" | "in_progress" | "waiting_professional" | "completed";
export type DocumentCategory =
  | "corporate"
  | "tax"
  | "employees"
  | "licences"
  | "policies"
  | "contracts";
export type DocumentStatus = "current" | "expiring" | "missing" | "uploaded";
export type ProfessionalType =
  | "ca"
  | "cs"
  | "labour_lawyer"
  | "posh_specialist"
  | "hr_consultant"
  | "gst_practitioner"
  | "licensing_consultant";
export type BusinessScale = "small" | "medium" | "large";

export type ComplianceSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  jurisdiction: string;
  lastVerified: string;
};

export type ComplianceStep = {
  id: string;
  number: string;
  title: string;
  summary: string;
  whyItMatters: string;
  action: string;
  documents: string[];
  status: StepStatus;
};

export type ComplianceRequirement = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  status: RequirementStatus;
  priority: Priority;
  jurisdiction: string;
  dueDate?: string;
  progress: number;
  nextAction: string;
  href: string;
  confidence: Confidence;
  applicability: string;
  sources: ComplianceSource[];
  steps: ComplianceStep[];
  requiredDocuments: string[];
  professionalTypes: ProfessionalType[];
  recurring?: string;
  scaleRelevance: BusinessScale[];
};

export type ComplianceJourney = {
  requirementId: string;
  title: string;
  subtitle: string;
  completedSteps: number;
  totalSteps: number;
  steps: ComplianceStep[];
};

export type BusinessProfile = {
  id: string;
  name: string;
  city: string;
  state: string;
  industry: string;
  entity: string;
  employees: number;
  annualTurnover: string;
  gstRegistered: boolean;
  gstin?: string;
  importExport: boolean;
  locations: number;
  scale: BusinessScale;
};

export type Professional = {
  id: string;
  name: string;
  type: ProfessionalType;
  specialty: string;
  city: string;
  years: number;
  verified: boolean;
  canHelp: string[];
  languages: string[];
  forRequirementIds: string[];
};

export type Task = {
  id: string;
  title: string;
  reason: string;
  dueDate: string;
  owner: string;
  status: TaskStatus;
  complianceId: string;
  requiredDocuments: string[];
  nextAction: string;
};

export type FilingStatus = "draft" | "submitted";

export type GovernmentFiling = {
  id: string;
  portalId: string;
  period: string;
  acknowledgement: string;
  submittedAt: string;
  status: FilingStatus;
};

export type VaultDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedDate?: string;
  expiryDate?: string;
  linkedComplianceId?: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  href: string;
};

export type DiscoveryAnswers = {
  entity: string;
  location: string;
  industry: string;
  employees: string;
  turnover: string;
  activities: string[];
  importExport: boolean;
  locations: string;
};

export type IntentMatch = {
  id: string;
  title: string;
  reason: string;
  href: string;
};
