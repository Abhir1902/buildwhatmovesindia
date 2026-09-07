import { describe, expect, it } from "vitest";
import type { ComplianceRequirement, GovernmentFiling, VaultDocument } from "@/domain/types";
import { computeHealth, coverage, obligationScore } from "@/lib/health";
import { SEED } from "@/lib/json-db";

function requirement(patch: Partial<ComplianceRequirement> & Pick<ComplianceRequirement, "id" | "progress">): ComplianceRequirement {
  return {
    slug: patch.id,
    title: patch.id,
    category: "Test",
    description: "",
    status: "healthy",
    priority: "low",
    jurisdiction: "India",
    nextAction: "",
    href: "/",
    confidence: "low",
    applicability: "",
    sources: [],
    steps: [],
    requiredDocuments: [],
    professionalTypes: [],
    scaleRelevance: ["small"],
    ...patch,
  };
}

function doc(linkedComplianceId: string, status: VaultDocument["status"] = "current"): VaultDocument {
  return {
    id: `doc-${linkedComplianceId}-${status}`,
    name: "Proof",
    category: "tax",
    status,
    linkedComplianceId,
  };
}

const filing: GovernmentFiling = {
  id: "f-gst",
  portalId: "gst",
  period: "Aug 2026",
  acknowledgement: "ACK",
  submittedAt: "2026-08-29",
  status: "submitted",
};

describe("health formula", () => {
  it("treats progress as complete when no documents are required", () => {
    const row = requirement({ id: "a", progress: 100, requiredDocuments: [] });
    expect(coverage(row, [], [])).toBe(1);
    expect(obligationScore(row, [], [])).toBe(1);
  });

  it("zeroes an obligation that still needs proofs and has an empty vault", () => {
    const row = requirement({ id: "gst", progress: 80, requiredDocuments: ["A", "B"] });
    expect(coverage(row, [], [])).toBe(0);
    expect(obligationScore(row, [], [])).toBe(0);
  });

  it("scales by proofs on file, ignoring missing placeholders", () => {
    const row = requirement({ id: "gst", progress: 80, requiredDocuments: ["A", "B"] });
    expect(coverage(row, [doc("gst"), doc("gst", "missing")], [])).toBe(0.5);
    expect(obligationScore(row, [doc("gst")], [])).toBe(0.4);
  });

  it("counts a submitted filing as one proof", () => {
    const row = requirement({ id: "gst", progress: 100, requiredDocuments: ["A", "B"] });
    expect(coverage(row, [], [filing])).toBe(0.5);
  });

  it("weights obligations by how many proofs they need", () => {
    const health = computeHealth({
      requirements: [
        requirement({ id: "easy", progress: 100, requiredDocuments: [] }),
        requirement({ id: "gst", progress: 100, requiredDocuments: ["A", "B", "C"] }),
      ],
      documents: [],
      filings: [],
    });
    // weights 1 and 3; scores 1 and 0 → 100*1/4 = 25
    expect(health).toEqual({
      total: 2,
      completed: 1,
      pendingApproval: 0,
      remaining: 1,
      readiness: 25,
    });
  });

  it("moves readiness when a required document is added", () => {
    const requirements = [
      requirement({ id: "easy", progress: 100, requiredDocuments: [] }),
      requirement({ id: "gst", progress: 100, requiredDocuments: ["A", "B"] }),
    ];
    const empty = computeHealth({ requirements, documents: [], filings: [] });
    const withDoc = computeHealth({ requirements, documents: [doc("gst")], filings: [] });
    expect(empty.readiness).toBe(33);
    expect(withDoc.readiness).toBe(67);
  });

  it("matches the empty-vault seed", () => {
    expect(computeHealth(SEED)).toEqual({
      total: 38,
      completed: 24,
      pendingApproval: 6,
      remaining: 8,
      readiness: 60,
    });
  });
});
