import { businessProfile } from "@/data/business";

export type PortalId = "gst" | "posh" | "epf" | "shops" | "mca" | "esi" | "factory" | "ptax";

export type PortalDef = {
  id: PortalId;
  requirementId: string;
  period: string;
  rows: { label: string; value: string }[];
};

export const portals: PortalDef[] = [
  {
    id: "gst",
    requirementId: "gst",
    period: "Aug 2026",
    rows: [
      { label: "GSTIN", value: businessProfile.gstin ?? "—" },
      { label: "Return", value: "GSTR-3B" },
      { label: "Outward taxable supplies", value: "₹18,40,000" },
      { label: "Input tax credit", value: "₹2,10,000" },
      { label: "Tax payable", value: "₹1,21,200" },
    ],
  },
  {
    id: "posh",
    requirementId: "posh",
    period: "FY 2025–26",
    rows: [
      { label: "Establishment", value: businessProfile.name },
      { label: "District", value: "Pune" },
      { label: "Complaints received", value: "0" },
      { label: "Internal Committee members", value: "4" },
      { label: "Awareness sessions", value: "1" },
    ],
  },
  {
    id: "epf",
    requirementId: "epf",
    period: "Aug 2026",
    rows: [
      { label: "Establishment code", value: "PUPUN0025444000" },
      { label: "Employees", value: String(businessProfile.employees) },
      { label: "Wage month", value: "August 2026" },
      { label: "ECR contribution", value: "₹1,86,420" },
    ],
  },
  {
    id: "shops",
    requirementId: "shops",
    period: "2026 renewal",
    rows: [
      { label: "Registration", value: "MH-PUN-SE-2019-4412" },
      { label: "Premises", value: "Pune manufacturing unit" },
      { label: "Employees declared", value: String(businessProfile.employees) },
    ],
  },
  {
    id: "mca",
    requirementId: "mca",
    period: "FY 2025–26",
    rows: [
      { label: "CIN", value: "U29253PN2019PTC184201" },
      { label: "Form", value: "AOC-4 / MGT-7" },
      { label: "Financial year", value: "2025–26" },
    ],
  },
  {
    id: "esi",
    requirementId: "esi",
    period: "Aug 2026",
    rows: [
      { label: "Employer code", value: "31001234560000999" },
      { label: "Covered employees", value: "11" },
      { label: "Contribution", value: "₹48,200" },
    ],
  },
  {
    id: "factory",
    requirementId: "factory",
    period: "Licence check 2026",
    rows: [
      { label: "Occupier", value: businessProfile.name },
      { label: "Power", value: "Installed — manufacturing" },
      { label: "Workers", value: String(businessProfile.employees) },
    ],
  },
  {
    id: "ptax",
    requirementId: "ptax",
    period: "Aug 2026",
    rows: [
      { label: "PT registration", value: "27751234567P" },
      { label: "Employees", value: String(businessProfile.employees) },
      { label: "Tax deducted", value: "₹2,800" },
    ],
  },
];

export function portalById(id: string) {
  return portals.find((item) => item.id === id);
}

export function deskHref(id: string) {
  return portalById(id) ? `/compliance/${id}` : "/file";
}

export function makeAcknowledgement(id: PortalId) {
  const stamp = Date.now().toString().slice(-6);
  const prefix: Record<PortalId, string> = {
    gst: "AA270826",
    posh: "SHBX/MH/PUN/",
    epf: "TRRN",
    shops: "MHSE",
    mca: "SRN",
    esi: "ESIC",
    factory: "DISH",
    ptax: "MHPT",
  };
  return `${prefix[id]}${stamp}`;
}
