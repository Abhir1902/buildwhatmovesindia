import seed from "@/data/db.json";
import type { VaultDocument } from "@/domain/types";

export const initialDocuments = seed.documents as VaultDocument[];
