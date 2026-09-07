import type { ComplianceRequirement, GovernmentFiling, VaultDocument } from "@/domain/types";

export type HealthInput = {
  requirements: ComplianceRequirement[];
  documents: VaultDocument[];
  filings: GovernmentFiling[];
};

export type HealthSummary = {
  total: number;
  completed: number;
  pendingApproval: number;
  remaining: number;
  readiness: number;
};

/** Obligation is complete enough for the donut's dark slice. */
export const COMPLETED_MIN = 0.8;
/** Obligation is in progress / waiting — the middle slice. */
export const PENDING_MIN = 0.4;

function isPresentProof(doc: VaultDocument) {
  return doc.status !== "missing";
}

function filingProofs(requirementId: string, filings: GovernmentFiling[]) {
  return filings.some((filing) => filing.status === "submitted" && filing.portalId === requirementId) ? 1 : 0;
}

/** How many vault files + acknowledgements count toward this obligation. */
export function proofCount(
  requirement: ComplianceRequirement,
  documents: VaultDocument[],
  filings: GovernmentFiling[],
) {
  const linked = documents.filter((doc) => doc.linkedComplianceId === requirement.id && isPresentProof(doc)).length;
  return linked + filingProofs(requirement.id, filings);
}

/**
 * Share of required proofs on file, 0–1.
 * Obligations with no required documents are treated as fully evidenced.
 */
export function coverage(
  requirement: ComplianceRequirement,
  documents: VaultDocument[],
  filings: GovernmentFiling[],
) {
  const needed = requirement.requiredDocuments.length;
  if (needed === 0) return 1;
  return Math.min(1, proofCount(requirement, documents, filings) / needed);
}

/**
 * One obligation: recorded progress, gated by vault coverage.
 * score = (progress / 100) × coverage
 */
export function obligationScore(
  requirement: ComplianceRequirement,
  documents: VaultDocument[],
  filings: GovernmentFiling[],
) {
  return (requirement.progress / 100) * coverage(requirement, documents, filings);
}

function weight(requirement: ComplianceRequirement) {
  return Math.max(requirement.requiredDocuments.length, 1);
}

function bucket(score: number): "completed" | "pendingApproval" | "remaining" {
  if (score >= COMPLETED_MIN) return "completed";
  if (score >= PENDING_MIN) return "pendingApproval";
  return "remaining";
}

/**
 * Company readiness.
 *
 * readiness = round(100 × Σ(score × weight) / Σ(weight))
 *   score  = (progress / 100) × coverage
 *   weight = max(requiredDocuments.length, 1)
 *
 * So an obligation that asks for three proofs pulls three times as hard as one
 * with no vault file, and an empty vault zeroes every obligation that still
 * needs documents.
 */
export function computeHealth({ requirements, documents, filings }: HealthInput): HealthSummary {
  const total = requirements.length;
  if (total === 0) {
    return { total: 0, completed: 0, pendingApproval: 0, remaining: 0, readiness: 0 };
  }

  let weighted = 0;
  let mass = 0;
  let completed = 0;
  let pendingApproval = 0;
  let remaining = 0;

  for (const requirement of requirements) {
    const score = obligationScore(requirement, documents, filings);
    const w = weight(requirement);
    weighted += score * w;
    mass += w;
    const slice = bucket(score);
    if (slice === "completed") completed += 1;
    else if (slice === "pendingApproval") pendingApproval += 1;
    else remaining += 1;
  }

  return {
    total,
    completed,
    pendingApproval,
    remaining,
    readiness: Math.round((100 * weighted) / mass),
  };
}
