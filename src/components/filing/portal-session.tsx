"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { makeAcknowledgement, portalById, type PortalId } from "@/data/portals";
import { useDemo } from "@/state/demo-provider";
import { useI18n } from "@/i18n/provider";

type Phase = "idle" | "otp" | "review" | "sending" | "done";

export function PortalSession({ portalId }: { portalId: PortalId }) {
  const { t } = useI18n();
  const portal = portalById(portalId);
  const { filings, documents, addFiling } = useDemo();
  const existing = filings.find((item) => item.portalId === portalId);
  const [phase, setPhase] = useState<Phase>(existing ? "done" : "idle");
  const [otp, setOtp] = useState("");
  const [ack, setAck] = useState(existing?.acknowledgement ?? "");
  const [viewAck, setViewAck] = useState(false);

  if (!portal) return null;

  const portalName = t.file.portals[portalId];

  const period = portal.period;

  function start() {
    setPhase("otp");
  }

  function verifyOtp() {
    if (otp.replace(/\D/g, "").length < 6) return;
    setPhase("review");
  }

  function submit() {
    setPhase("sending");
    window.setTimeout(() => {
      const acknowledgement = makeAcknowledgement(portalId);
      setAck(acknowledgement);
      addFiling({
        id: `filing-${portalId}-${Date.now()}`,
        portalId,
        period,
        acknowledgement,
        submittedAt: new Date().toISOString().slice(0, 10),
        status: "submitted",
      });
      setPhase("done");
    }, 900);
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.file.desk}</p>
      <h2 className="mt-1 text-xl font-medium tracking-tight">{portalName}</h2>
      <p className="mt-2 text-sm text-neutral-600">{t.file.insideSetu.replace("{portal}", portalName)}</p>
      <p className="mt-3 text-xs leading-5 text-neutral-500">{t.file.demoNote}</p>

      {phase === "idle" && (
        <Button className="mt-6" onClick={start}>
          {t.file.openInSetu.replace("{portal}", portalName)}
        </Button>
      )}

      {phase === "otp" && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-neutral-600">{t.file.otpHint}</p>
          <label className="block text-sm">
            <span className="text-neutral-500">{t.file.otpLabel}</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1 h-11 w-full rounded-md border border-neutral-200 px-3 font-mono tracking-[0.4em] outline-none focus:border-neutral-400"
              placeholder="••••••"
            />
          </label>
          <Button onClick={verifyOtp} disabled={otp.length < 6}>
            {t.file.verify}
          </Button>
        </div>
      )}

      {phase === "review" && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-neutral-600">
            {t.file.period}: {portal.period}
          </p>
          <dl className="divide-y divide-neutral-200 border-y">
            {portal.rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-neutral-500">{row.label}</dt>
                <dd className="text-right font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
          <Button onClick={submit}>{t.file.submit.replace("{portal}", portalName)}</Button>
        </div>
      )}

      {phase === "sending" && (
        <p className="mt-6 font-mono text-xs text-neutral-500">{t.file.submitting.replace("{portal}", portalName)}</p>
      )}

      {phase === "done" && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium">{t.file.filed}</p>
          <p className="font-mono text-sm">
            {t.file.arn}: {ack}
          </p>
          <p className="text-sm text-neutral-600">{t.file.saved}</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="sm" onClick={() => setViewAck(true)}>
              {t.documents.view}
            </Button>
            <Link href="/documents" className="inline-flex items-center text-sm font-medium underline-offset-4 hover:underline">
              {t.file.openDocs}
            </Link>
          </div>
        </div>
      )}
      <DocumentViewer
        doc={
          viewAck
            ? documents.find((item) => item.name === `${ack}.pdf`) ?? {
                id: `preview-${portalId}`,
                name: `${ack}.pdf`,
                category: "tax",
                status: "uploaded",
                uploadedDate: new Date().toISOString().slice(0, 10),
                linkedComplianceId: portalId,
              }
            : null
        }
        onClose={() => setViewAck(false)}
      />
    </section>
  );
}
