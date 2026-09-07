import seed from "@/data/db.json";
import type { Professional } from "@/domain/types";

export const professionals = seed.professionals as Professional[];

export const professionalTypeLabel: Record<Professional["type"], string> = {
  ca: "Chartered Accountant",
  cs: "Company Secretary",
  labour_lawyer: "Labour Lawyer",
  posh_specialist: "POSH Specialist",
  hr_consultant: "HR Consultant",
  gst_practitioner: "GST Practitioner",
  licensing_consultant: "Licensing Consultant",
};
