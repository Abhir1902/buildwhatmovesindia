import { notFound } from "next/navigation";
import { RequirementDesk } from "@/components/filing/requirement-desk";
import { portalById, type PortalId } from "@/data/portals";

export default async function ComplianceDeskPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!portalById(slug) || slug === "posh" || slug === "gst") notFound();
  return <RequirementDesk id={slug as PortalId} />;
}
