import type { ComplianceRequirement, ComplianceStep, Professional, Task } from "@/domain/types";
import type { HelpRequest } from "@/lib/json-db";

function docsOverlap(left: string[], right: string[]) {
  return left.some((a) =>
    right.some((b) => {
      const x = a.toLowerCase();
      const y = b.toLowerCase();
      return x === y || x.includes(y) || y.includes(x);
    }),
  );
}

export function focusStepIndex(task: Task, steps: ComplianceStep[]) {
  if (steps.length === 0) return -1;
  const matches = steps
    .map((step, index) => (docsOverlap(step.documents, task.requiredDocuments) ? index : -1))
    .filter((index) => index >= 0);
  const live = matches.find((index) => steps[index].status === "current" || steps[index].status === "upcoming");
  if (live !== undefined) return live;
  if (matches.length > 0) return matches[0];
  const current = steps.findIndex((step) => step.status === "current");
  if (current >= 0) return current;
  return 0;
}

export function stepsForTask(task: Task, steps: ComplianceStep[]): ComplianceStep[] {
  if (steps.length === 0) return [];
  if (task.status === "completed") {
    return steps.map((step) => ({ ...step, status: "complete" as const }));
  }
  const focus = focusStepIndex(task, steps);
  return steps.map((step, index) => ({
    ...step,
    status: index < focus ? "complete" : index === focus ? "current" : "upcoming",
  }));
}

export function isFullyComplete(item: ComplianceRequirement) {
  return item.progress >= 100;
}

const CLOSED_JOURNEYS: Record<string, string[]> = {
  "Director KYC": ["Collect DIN and identity proofs", "File DIR-3 KYC on MCA21", "Archive the SRN in Vault"],
  "Board minutes archive": ["Draft the last Board minutes", "Collect director signatures", "File the signed pack in Vault"],
  "TDS quarterly return": ["Close the quarter's TDS working", "File 24Q / 26Q", "Vault Form 16A / acknowledgement"],
  "TDS payment": ["Reconcile TDS deducted this month", "Deposit on TIN / income-tax portal", "Keep the challan in Vault"],
  "Fire NOC tracker": ["Confirm Pune NOC is current", "Diary the next renewal", "Keep the NOC copy in Vault"],
  "Trade licence copy": ["Confirm PMC trade licence number", "Check expiry against this year", "File the licence scan in Vault"],
  "Bank KYC pack": ["Refresh GSTIN and CIN for the bank", "Sign the KYC form set", "Store the bank acknowledgement"],
  "Invoice series control": ["Lock the GST invoice series", "Reconcile gaps in the register", "Archive the series note"],
  "Statutory registers": ["Update member and director registers", "CS review of the books", "Keep the registers with the minute book"],
  "Form 11 EPF declaration": ["Issue Form 11 to new joiners", "Collect signed declarations", "File with the wage register"],
  "Labour welfare fund": ["Confirm Maharashtra LWF applicability", "Deduct the half-yearly contribution", "Remit and vault the receipt"],
  "Pollution consent reminder": ["Check MPCB consent expiry", "Diary the renewal window", "Keep the consent copy in Vault"],
  "Insurance renewal": ["Review the current policy schedule", "Place the renewal with the broker", "File the renewed policy in Vault"],
  "ISO document review": ["Pull the last internal audit notes", "Close open NCRs", "Archive the review minute"],
};

function makeStep(id: string, index: number, title: string, status: ComplianceStep["status"]): ComplianceStep {
  return {
    id,
    number: String(index + 1).padStart(2, "0"),
    title,
    summary: title,
    whyItMatters: "",
    action: "",
    documents: [],
    status,
  };
}

function synthesizeSteps(item: ComplianceRequirement): ComplianceStep[] {
  const titles =
    item.requiredDocuments.length > 0
      ? item.requiredDocuments
      : (CLOSED_JOURNEYS[item.title] ?? [`Confirm ${item.title}`, `Complete ${item.title}`, "Archive proof in Vault"]);
  const done = isFullyComplete(item) ? titles.length : Math.min(titles.length, Math.floor((item.progress / 100) * titles.length));
  return titles.map((title, index) =>
    makeStep(
      `${item.id}-s-${index}`,
      index,
      title,
      index < done ? "complete" : index === done ? "current" : "upcoming",
    ),
  );
}

/** Register card journey: seed steps, or a short closed list for 100% healthy fillers. */
export function stepsForRequirement(item: ComplianceRequirement): ComplianceStep[] {
  const source = item.steps.length > 0 ? item.steps : synthesizeSteps(item);
  if (isFullyComplete(item)) {
    return source.map((step) => ({ ...step, status: "complete" as const }));
  }
  return source;
}

export type TaskPending = {
  who: string;
  specialty: string;
  city: string;
  stage: string;
  detail: string;
};

export function pendingForTask(
  task: Task,
  steps: ComplianceStep[],
  requests: HelpRequest[],
  professionals: Professional[],
): TaskPending | null {
  if (task.status !== "waiting_professional") return null;
  const request = requests.find((item) => item.requirementId === task.complianceId && item.status === "waiting");
  const professional =
    (request ? professionals.find((item) => item.id === request.professionalId) : undefined) ??
    professionals.find((item) => item.forRequirementIds.includes(task.complianceId));
  const overlay = stepsForTask(task, steps);
  const stuck = overlay.find((step) => step.status === "current");
  const who = professional?.name ?? task.owner;
  const stage = request?.stage ?? stuck?.title ?? task.nextAction;
  const detail =
    request?.detail ??
    stuck?.summary ??
    `${who} still holds this step. Nothing else on this journey can finish until it moves.`;
  return {
    who,
    specialty: professional?.specialty ?? task.owner,
    city: professional?.city ?? "",
    stage,
    detail,
  };
}
