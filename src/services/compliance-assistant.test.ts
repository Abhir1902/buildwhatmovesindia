import { afterEach, describe, expect, it } from "vitest";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { resetDbForTests } from "@/lib/json-db";

afterEach(() => {
  resetDbForTests();
});

describe("ComplianceAssistant", () => {
  it("matches POSH intent from natural language", () => {
    const matches = ComplianceAssistant.matchIntent("We have 14 employees and haven't implemented POSH.");
    expect(matches[0]?.id).toBe("posh");
  });

  it("maps PF / salary synonyms to EPF", () => {
    const hits = ComplianceAssistant.search("pf salary");
    expect(hits.some((hit) => hit.id.includes("epf") || hit.href.includes("epf"))).toBe(true);
  });

  it("finds GST from a multi-word query", () => {
    const hits = ComplianceAssistant.search("file gst return");
    expect(hits.some((hit) => hit.href.includes("gst") || hit.id.includes("gst"))).toBe(true);
  });

  it("resolves a near-miss challan spelling", () => {
    const hits = ComplianceAssistant.search("chalan");
    expect(hits.length).toBeGreaterThan(0);
  });

  it("recommends POSH specialists for the POSH journey", () => {
    const people = ComplianceAssistant.recommendProfessionals("posh");
    expect(people.every((p) => p.forRequirementIds.includes("posh"))).toBe(true);
  });

  it("builds a discovery map with attention items", () => {
    const map = ComplianceAssistant.discover({
      entity: "Private Limited",
      location: "Maharashtra",
      industry: "Engineering / Manufacturing",
      employees: "14",
      turnover: "₹2.4 Cr",
      activities: ["manufacturing"],
      importExport: false,
      locations: "1",
    });
    expect(map.attention.length).toBeGreaterThan(0);
    expect(map.healthy).toBe(28);
  });
});
