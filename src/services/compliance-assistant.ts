import { getDb } from "@/lib/json-db";
import { suiteApps } from "@/suite/apps";
import type {
  BusinessProfile,
  DiscoveryAnswers,
  IntentMatch,
  Professional,
  ComplianceRequirement,
} from "@/domain/types";

const intents: IntentMatch[] = [
  { id: "posh", title: "Implement POSH", reason: "Workplace policy for organisations with employees.", href: "/compliance/posh" },
  { id: "gst", title: "Register or file GST", reason: "Tax registration and recurring returns.", href: "/compliance/gst" },
  { id: "hire", title: "Hire employees", reason: "EPF, ESI, professional tax and workplace policy often follow hiring.", href: "/compliance/epf" },
  { id: "location", title: "Open another location", reason: "Local licences and Shops & Establishment typically restart per site.", href: "/compliance/shops" },
  { id: "missing", title: "I'm not sure what I'm missing", reason: "Build a compliance map from a short business profile.", href: "/discover" },
  { id: "professional", title: "Find a professional", reason: "Match help to the task, not a generic directory.", href: "/professionals" },
];

const synonyms: Record<string, string[]> = {
  gst: ["gst", "gstin", "gstr", "3b", "chalan", "challan", "tax return", "goods and service"],
  posh: ["posh", "harassment", "icc", "committee", "workplace policy"],
  epf: ["epf", "pf", "provident", "salary", "payroll", "ecr"],
  esi: ["esi", "esic", "medical", "insurance"],
  shops: ["shop", "establishment", "licence renewal", "license", "gumasta"],
  mca: ["mca", "roc", "aoc", "mgt", "company filing", "annual return"],
  factory: ["factory", "dish", "licence", "license"],
  ptax: ["ptax", "professional tax", "pt"],
  hire: ["hire", "employee", "staff", "naukri", "naukri lagao"],
  location: ["branch", "dusri dukaan", "another location", "new office"],
  missing: ["missing", "not sure", "kya chhut", "what am i", "map"],
  professional: ["ca", "cs", "lawyer", "professional", "madad", "help"],
};

export type SearchHit = {
  id: string;
  title: string;
  reason: string;
  href: string;
  group: "apps" | "actions" | "items" | "glossary";
  score: number;
};

function scoreText(query: string, hay: string) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const h = hay.toLowerCase();
  if (h === q) return 12;
  if (h.includes(q)) return 8;
  return q.split(/\s+/).filter((w) => w.length > 2 && h.includes(w)).length;
}

function synonymBoost(query: string, id: string) {
  const q = query.toLowerCase();
  const list = synonyms[id] ?? [];
  return list.some((alias) => q.includes(alias) || alias.includes(q)) ? 10 : 0;
}

function db() {
  return getDb();
}

export const ComplianceAssistant = {
  analyzeBusiness(profile: BusinessProfile = db().business) {
    return { profile };
  },

  identifyRequirements() {
    return db().requirements;
  },

  explainRequirement(id: string) {
    const item = db().requirements.find((r) => r.id === id);
    if (!item) return null;
    return {
      why: item.applicability,
      sources: item.sources,
      confidence: item.confidence,
      jurisdiction: item.jurisdiction,
    };
  },

  createJourney(id: string) {
    const item = db().requirements.find((r) => r.id === id);
    if (!item) return null;
    const completed = item.steps.filter((s) => s.status === "complete").length;
    return {
      requirementId: item.id,
      title: item.id === "posh" ? "Implement POSH" : item.title,
      subtitle: item.description,
      completedSteps: completed,
      totalSteps: item.steps.length,
      steps: item.steps,
    };
  },

  recommendProfessionals(requirementId?: string): Professional[] {
    const professionals = db().professionals;
    if (!requirementId) return professionals.slice(0, 3);
    const matched = professionals.filter((p) => p.forRequirementIds.includes(requirementId));
    return matched.length ? matched : professionals.slice(0, 2);
  },

  matchIntent(query: string): IntentMatch[] {
    return this.search(query)
      .filter((hit) => hit.group === "actions" || hit.group === "items")
      .slice(0, 5)
      .map((hit) => ({ id: hit.id, title: hit.title, reason: hit.reason, href: hit.href }));
  },

  search(query: string): SearchHit[] {
    const q = query.trim();
    const hits: SearchHit[] = [];

    for (const app of suiteApps) {
      const hay = app.id === "calendar" ? `${app.id} ${app.href} tasks deadlines` : `${app.id} ${app.href}`;
      const score = scoreText(q, hay) + (q ? 1 : 2);
      hits.push({
        id: `app-${app.id}`,
        title: app.id,
        reason: app.href,
        href: app.href,
        group: "apps",
        score: q ? score : 3,
      });
    }

    for (const intent of intents) {
      const score =
        scoreText(q, `${intent.title} ${intent.reason} ${intent.id}`) +
        synonymBoost(q, intent.id) +
        (q.toLowerCase().includes(intent.id) ? 15 : 0);
      if (!q || score > 0) {
        hits.push({
          id: intent.id,
          title: intent.title,
          reason: intent.reason,
          href: intent.href,
          group: "actions",
          score: q ? score : 2,
        });
      }
    }

    const { requirements, portals, glossary, tasks, documents } = db();

    for (const req of requirements.filter((r) => ["posh", "gst", "shops", "epf", "esi", "mca", "factory", "ptax"].includes(r.id))) {
      const score = scoreText(q, `${req.title} ${req.category} ${req.description} ${req.id}`) + synonymBoost(q, req.id);
      if (!q || score > 0) {
        hits.push({
          id: `req-${req.id}`,
          title: req.title,
          reason: req.nextAction,
          href: req.href,
          group: "items",
          score,
        });
      }
    }

    for (const portal of portals) {
      const score = scoreText(q, `${portal.id} ${portal.period} file`) + synonymBoost(q, portal.id);
      if (q && score > 0) {
        hits.push({
          id: `file-${portal.id}`,
          title: `File ${portal.id.toUpperCase()}`,
          reason: portal.period,
          href: `/file?p=${portal.id}`,
          group: "actions",
          score: score + 1,
        });
      }
    }

    for (const term of glossary) {
      const score = scoreText(q, `${term.term} ${term.plain} ${term.aliases.join(" ")}`);
      if (!q || score > 0) {
        hits.push({
          id: `g-${term.id}`,
          title: term.term,
          reason: term.plain,
          href: "/overview",
          group: "glossary",
          score,
        });
      }
    }

    for (const task of tasks) {
      const score = scoreText(q, `${task.title} ${task.reason}`);
      if (q && score > 0) {
        hits.push({ id: task.id, title: task.title, reason: task.nextAction, href: "/calendar", group: "items", score });
      }
    }

    for (const doc of documents) {
      const score = scoreText(q, doc.name);
      if (q && score > 0) {
        hits.push({ id: doc.id, title: doc.name, reason: doc.category, href: "/documents", group: "items", score });
      }
    }

    hits.sort((a, b) => b.score - a.score);
    const seen = new Set<string>();
    return hits.filter((hit) => {
      if (seen.has(hit.id)) return false;
      seen.add(hit.id);
      return !q || hit.score > 0;
    });
  },

  suggestions() {
    return intents;
  },

  discover(answers: DiscoveryAnswers): {
    attention: ComplianceRequirement[];
    upcoming: ComplianceRequirement[];
    healthy: number;
    potential: ComplianceRequirement[];
  } {
    const allRequirements = db().requirements;
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
        applicability: "You indicated import/export activity. An IEC from DGFT may apply. Confirm with a trade professional.",
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
        applicability: "Each additional workplace often needs its own local registration. This is a prompt to check, not a filing.",
        confidence: "medium",
      });
    }
    if (employees >= 10 || answers.employees.includes("10")) {
      potential.push(allRequirements.find((r) => r.id === "posh")!);
    }

    return {
      attention: allRequirements.filter((r) => r.status === "attention").slice(0, 5),
      upcoming: allRequirements.filter((r) => r.status === "upcoming").slice(0, 9),
      healthy: 28,
      potential: potential.filter(Boolean).slice(0, 4),
    };
  },
};

export type ComplianceAssistantApi = typeof ComplianceAssistant;
