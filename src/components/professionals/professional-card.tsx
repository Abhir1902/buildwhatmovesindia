"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { professionalTypeLabel } from "@/data/professionals";
import { businessProfile } from "@/data/business";
import { useDemo } from "@/state/demo-provider";
import { FileNow } from "@/components/filing/file-now";
import { useI18n } from "@/i18n/provider";
import type { Professional } from "@/domain/types";

export function ProfessionalCard({
  professional,
  requirementId,
  requirementTitle,
}: {
  professional: Professional;
  requirementId: string;
  requirementTitle: string;
}) {
  const { addRequest, requests } = useDemo();
  const { t } = useI18n();
  const sent = requests.some((r) => r.professionalId === professional.id);
  const [done, setDone] = useState(sent);
  const [sending, setSending] = useState(false);

  return (
    <article className="flex flex-col gap-4 border-b border-neutral-200 py-6 last:border-b-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="text-base font-medium">{professional.name}</h3>
          <p className="text-sm text-neutral-500">
            {professional.specialty} · {professional.city}
          </p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          {professional.years} {t.professionals.years} · {professional.verified ? t.professionals.verified : ""}
        </p>
      </div>
      <p className="text-xs text-neutral-500">{professionalTypeLabel[professional.type]}</p>
      <ul className="text-sm text-neutral-700">
        {professional.canHelp.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
      <FileNow id={requirementId} />
      {done ? (
        <p className="text-sm" role="status">
          {t.professionals.sent.replace("{name}", professional.name.split(" ")[0])}{" "}
          <span className="font-mono text-xs uppercase tracking-wide">{t.professionals.waiting}</span>
        </p>
      ) : (
        <Modal>
          <ModalTrigger asChild>
            <Button>{t.professionals.request}</Button>
          </ModalTrigger>
          <ModalContent title={requirementTitle}>
            <p className="text-sm text-neutral-600">{t.professionals.share}</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>{businessProfile.name}</li>
              <li>
                {businessProfile.city} · {businessProfile.employees} {t.common.employees}
              </li>
              <li>
                {t.professionals.helping}: {professional.name}
              </li>
            </ul>
            <Button
              className="mt-6 w-full"
              disabled={sending}
              onClick={() => {
                setSending(true);
                window.setTimeout(() => {
                  addRequest({ professionalId: professional.id, requirementId, status: "waiting" });
                  setDone(true);
                  setSending(false);
                }, 500);
              }}
            >
              {sending ? t.professionals.sending : t.professionals.send}
            </Button>
          </ModalContent>
        </Modal>
      )}
    </article>
  );
}
