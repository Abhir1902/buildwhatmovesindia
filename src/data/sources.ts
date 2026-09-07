import seed from "@/data/db.json";
import type { ComplianceSource } from "@/domain/types";

export const sources = seed.sources as ComplianceSource[];
