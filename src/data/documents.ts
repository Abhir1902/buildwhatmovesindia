import type { VaultDocument } from "@/domain/types";

export const initialDocuments: VaultDocument[] = [
  {
    id: "doc-gst",
    name: "GST Certificate",
    category: "tax",
    status: "current",
    uploadedDate: "2024-03-12",
    linkedComplianceId: "gst",
  },
  {
    id: "doc-coi",
    name: "Certificate of Incorporation",
    category: "corporate",
    status: "current",
    uploadedDate: "2019-07-04",
    linkedComplianceId: "mca",
  },
  {
    id: "doc-posh-draft",
    name: "POSH Policy (draft)",
    category: "policies",
    status: "missing",
    linkedComplianceId: "posh",
  },
  {
    id: "doc-ic",
    name: "Internal Committee nominations",
    category: "employees",
    status: "uploaded",
    uploadedDate: "2026-08-18",
    linkedComplianceId: "posh",
  },
  {
    id: "doc-shops",
    name: "Shops & Establishment certificate",
    category: "licences",
    status: "expiring",
    uploadedDate: "2025-10-01",
    expiryDate: "2026-09-29",
    linkedComplianceId: "shops",
  },
  {
    id: "doc-lease",
    name: "Pune unit lease deed",
    category: "contracts",
    status: "current",
    uploadedDate: "2023-01-15",
  },
  {
    id: "doc-epf",
    name: "EPF establishment code letter",
    category: "employees",
    status: "current",
    uploadedDate: "2022-06-21",
    linkedComplianceId: "epf",
  },
];
