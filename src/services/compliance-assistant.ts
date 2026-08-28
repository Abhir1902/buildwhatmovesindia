import { allRequirements, healthSummary, requirements } from "@/data/requirements";
import { businessProfile } from "@/data/business";
import { professionals } from "@/data/professionals";
import type {
  BusinessProfile,
  DiscoveryAnswers,
  IntentMatch,
  Professional,
  ComplianceRequirement,
} from "@/domain/types";

const intents: IntentMatch[] = [
  {
    id: "posh",
    title: "Implement POSH",
    reason: "Workplace policy for organisations with employees.",
    href: "/compliance/posh",
  },
  {
    id: "gst",
    title: "Register or file GST",
    reason: "Tax registration and recurring returns.",
    href: "/compliance/gst",
  },
  {
    id: "hire",
    title: "Hire employees",
    reason: "EPF, ESI, professional tax and workplace policy often follow hiring.",
    href: "/compliance/epf",
  },
  {
    id: "location",
    title: "Open another location",
    reason: "Local licences and Shops & Establishment typically restart per site.",
    href: "/compliance/shops",
  },
  {
    id: "missing",
    title: "I'm not sure what I'm missing",
    reason: "Build a compliance map from a short business profile.",
    href: "/discover",
  },
  {
    id: "professional",
    title: "Find a professional",
    reason: "Match help to the task, not a generic directory.",
    href: "/professionals",
  },
];

export const ComplianceAssistant = {
  analyzeBusiness(profile: BusinessProfile = businessProfile) {
    return {
      profile,
      readiness: healthSummary.readiness,
      attention: healthSummary.attention,
      summary: healthSummary,
    };
  },

  identifyRequirements() {
    return allRequirements;
  },

  explainRequirement(id: string) {
    const item = allRequirements.find((r) => r.id === id);
    if (!item) return null;
    return {
      why: item.applicability,
      sources: item.sources,
      confidence: item.confidence,
      jurisdiction: item.jurisdiction,
    };
  },

  createJourney(id: string) {
    const item = requirements.find((r) => r.id === id);
    if (!item) return null;
    const completed = item.steps.filter((s) => s.status === "complete").length;
    return {
      requirementId: item.id,
      title: item.id === "posh" ? "Implement POSH" : item.title,
      subtitle:
        item.id === "posh"
          ? "Build the required workplace framework step by step."
          : item.description,
      completedSteps: completed,
      totalSteps: item.steps.length,
      steps: item.steps,
    };
  },

  recommendProfessionals(requirementId?: string): Professional[] {
    if (!requirementId) return professionals.slice(0, 3);
    const matched = professionals.filter((p) => p.forRequirementIds.includes(requirementId));
    return matched.length ? matched : professionals.slice(0, 2);
  },

  matchIntent(query: string): IntentMatch[] {
    const q = query.toLowerCase();
    if (!q.trim()) return intents;
    const boost: Record<string, number> = {
      posh: q.includes("posh") ? 10 : 0,
      gst: q.includes("gst") ? 10 : 0,
      missing: /not sure|missing|what am i/i.test(q) ? 10 : 0,
      hire: /hire|employee/.test(q) && !q.includes("posh") ? 4 : 0,
      location: /location|branch|another/.test(q) ? 8 : 0,
      professional: /professional|lawyer|ca|help/.test(q) ? 5 : 0,
    };
    return intents
      .map((intent) => {
        const hay = `${intent.title} ${intent.reason} ${intent.id}`.toLowerCase();
        const score =
          (boost[intent.id] ?? 0) +
          q.split(/\s+/).filter((w) => w.length > 3 && hay.includes(w)).length;
        return { intent, score };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((row) => row.intent)
      .slice(0, 5);
  },

  discover(answers: DiscoveryAnswers): {
    attention: ComplianceRequirement[];
    upcoming: ComplianceRequirement[];
    healthy: number;
    potential: ComplianceRequirement[];
  } {
    const employees = Number.parseInt(answers.employees, 10) || 0;
    const potential: ComplianceRequirement[] = [];
    if (answers.importExport) {
      potential.push({
        ...allRequirements[0],
        id: "iec",
        slug: "iec",
        title: "Import Export Code",
        category: "Trade",
        status: "upcoming",
        description: "IEC may be needed before goods cross the border.",
        applicability:
          "You indicated import/export activity. An IEC from DGFT may apply. Confirm with a trade professional.",
        href: "/professionals",
        nextAction: "Speak to a licensing consultant",
        confidence: "medium",
        progress: 0,
      });
    }
    if (Number.parseInt(answers.locations, 10) > 1) {
      potential.push({
        ...allRequirements.find((r) => r.id === "shops")!,
        id: "shops-multi",
        title: "Additional location registrations",
        applicability:
          "Each additional workplace often needs its own local registration. This is a prompt to check, not a filing.",
        confidence: "medium",
      });
    }
    if (employees >= 10) {
      potential.push(allRequirements.find((r) => r.id === "posh")!);
    }

    return {
      attention: allRequirements.filter((r) => r.status === "attention").slice(0, 5),
      upcoming: allRequirements.filter((r) => r.status === "upcoming").slice(0, 9),
      healthy: 28,
      potential: potential.filter(Boolean).slice(0, 4),
    };
  },

  suggestions() {
    return intents;
  },
};

export type ComplianceAssistantApi = typeof ComplianceAssistant;
