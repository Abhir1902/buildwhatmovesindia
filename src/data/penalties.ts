import seed from "@/data/db.json";

export type PenaltyBand = {
  id: string;
  requirementId: string;
  amountInr: number;
  label: string;
  consequence: string;
  sourceNote: string;
};

export const penalties = seed.penalties as PenaltyBand[];
