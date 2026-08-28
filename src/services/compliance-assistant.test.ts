import { describe, expect, it } from "vitest";
import { ComplianceAssistant } from "@/services/compliance-assistant";

describe("ComplianceAssistant", () => {
  it("matches POSH intent from natural language", () => {
    const matches = ComplianceAssistant.matchIntent("We have 14 employees and haven't implemented POSH.");
    expect(matches[0]?.id).toBe("posh");
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
