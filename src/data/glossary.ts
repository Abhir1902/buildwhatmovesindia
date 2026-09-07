import seed from "@/data/db.json";

export type GlossaryTerm = {
  id: string;
  term: string;
  plain: string;
  aliases: string[];
};

export const glossary = seed.glossary as GlossaryTerm[];
