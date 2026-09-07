import seed from "@/data/db.json";

export type PortalId = "gst" | "posh" | "epf" | "shops" | "mca" | "esi" | "factory" | "ptax";

export type PortalDef = {
  id: PortalId;
  requirementId: string;
  period: string;
  rows: { label: string; value: string }[];
};

export const portals = seed.portals as PortalDef[];

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
