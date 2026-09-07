import seed from "@/data/db.json";
import type { ComplianceRequirement } from "@/domain/types";

export const allRequirements = seed.requirements as ComplianceRequirement[];
export const requirements = allRequirements.filter((item) => seed.featuredRequirementIds.includes(item.id));
export const healthyFillers = allRequirements.filter((item) => item.id.startsWith("healthy-"));
export const upcomingFillers = allRequirements.filter((item) => item.id.startsWith("upcoming-"));
export const healthSummary = seed.health;
